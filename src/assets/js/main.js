// Theme toggle
document.getElementById("theme-toggle").addEventListener("click", () => {
  if (document.body.className.includes("dark")) {
    document.body.classList.remove("dark");
    localStorage.setItem("pref-theme", "light");
  } else {
    document.body.classList.add("dark");
    localStorage.setItem("pref-theme", "dark");
  }
});

// Smooth anchor scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    e.preventDefault();
    const id = anchor.getAttribute("href").substring(1);
    const target = document.querySelector(`[id='${decodeURIComponent(id)}']`);
    if (!target) return;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      target.scrollIntoView({ behavior: "smooth" });
    } else {
      target.scrollIntoView();
    }
    if (id === "top") {
      history.replaceState(null, null, " ");
    } else {
      history.pushState(null, null, `#${id}`);
    }
  });
});

// Go to top visibility
const topLink = document.getElementById("top-link");
window.onscroll = () => {
  const scrolled =
    document.body.scrollTop > 800 || document.documentElement.scrollTop > 800;
  topLink.style.visibility = scrolled ? "visible" : "hidden";
  topLink.style.opacity = scrolled ? "1" : "0";
};

// Copy button for code blocks
document.querySelectorAll("pre").forEach((pre) => {
  const button = document.createElement("button");
  button.className = "copy-code-button";
  button.type = "button";
  button.innerText = "复制";
  button.addEventListener("click", async () => {
    const code = pre.querySelector("code");
    if (!code) return;
    await navigator.clipboard.writeText(code.innerText);
    button.innerText = "已复制";
    setTimeout(() => {
      button.innerText = "复制";
    }, 1500);
  });
  pre.appendChild(button);
});
