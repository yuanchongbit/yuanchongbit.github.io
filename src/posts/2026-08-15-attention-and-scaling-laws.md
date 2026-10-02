---
title: "注意力机制与缩放定律速记"
date: 2026-08-15
description: "整理自注意力机制和神经网络缩放定律的阅读笔记：从 Scaled Dot-Product Attention 到 Chinchilla 的计算量最优分配。"
tags: [posts, 机器学习, 学习笔记]
---

这篇是一份速记，整理注意力机制的公式和缩放定律的核心结论，方便以后回顾。

## Attention 的基本公式

给定查询矩阵 $Q$、键矩阵 $K$ 和值矩阵 $V$，缩放点积注意力定义为：

$$
\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
$$

其中 $d_k$ 是键向量的维度。除以 $\sqrt{d_k}$ 的原因是：当 $d_k$ 较大时，点积的方差随维度线性增长，会导致 softmax 进入饱和区，梯度变得极小。

多头注意力则是把 $Q, K, V$ 分别投影到 $h$ 个不同的子空间，各自做注意力后拼接：

$$
\mathrm{MultiHead}(Q,K,V) = \mathrm{Concat}(\mathrm{head}_1, \dots, \mathrm{head}_h)W^O
$$

## 一个最小的实现

用 NumPy 写一个单头注意力的前向传播，帮助理解：

```python
import numpy as np

def softmax(x, axis=-1):
    x = x - x.max(axis=axis, keepdims=True)
    e = np.exp(x)
    return e / e.sum(axis=axis, keepdims=True)

def attention(Q, K, V):
    d_k = Q.shape[-1]
    scores = Q @ K.transpose(0, 2, 1) / np.sqrt(d_k)
    weights = softmax(scores)          # (batch, seq, seq)
    return weights @ V                 # (batch, seq, d_v)
```

## 缩放定律

Kaplan et al. (2020) 的核心观察是：交叉熵损失 $L$ 与模型参数量 $N$、数据量 $D$、训练计算量 $C$ 之间近似呈幂律关系：

$$
L(N) \approx \left(\frac{N_c}{N}\right)^{\alpha_N}, \quad
L(D) \approx \left(\frac{D_c}{D}\right)^{\alpha_D}
$$

而 Chinchilla (Hoffmann et al., 2022) 进一步指出，在给定计算预算 $C \approx 6ND$ 下，参数量 $N$ 和数据量 $D$ 应当**等比例增长**，即训练 token 数约为参数量的 20 倍，才能达到计算量最优。

| 模型规模 | 参数量 | Chinchilla 最优 token 数 |
| -------: | -----: | -----------------------: |
|        1B |    $10^9$ |              $2 \times 10^{10}$ |
|       10B |   $10^{10}$ |              $2 \times 10^{11}$ |
|       70B |   $7 \times 10^{10}$ |           $1.4 \times 10^{12}$ |

## 小结

- Attention 的本质是**可微分的软查找表**，$\sqrt{d_k}$ 缩放是数值稳定性的关键。
- 缩放定律告诉我们：**在算力受限时，模型大小和数据量要一起扩**，只堆参数是不划算的。

## 参考文献

1. Vaswani et al. *Attention Is All You Need*. NeurIPS 2017.
2. Kaplan et al. *Scaling Laws for Neural Language Models*. 2020.
3. Hoffmann et al. *Training Compute-Optimal Large Language Models*. 2022.
