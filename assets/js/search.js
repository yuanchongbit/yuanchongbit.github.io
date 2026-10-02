import Fuse from "/assets/js/fuse.min.mjs";

const input = document.getElementById("searchInput");
const results = document.getElementById("searchResults");

let fuse = null;

function render(items) {
  results.innerHTML = "";
  if (!items.length) {
    results.innerHTML =
      '<li class="search-entry-meta">没有找到相关文章。</li>';
    return;
  }
  for (const { item } of items) {
    const li = document.createElement("li");
    li.innerHTML = `
      <a class="search-entry-title" href="${item.url}">${item.title}</a>
      <div class="search-entry-meta">${item.date}</div>
      <div class="search-entry-snippet">${item.snippet}</div>
    `;
    results.appendChild(li);
  }
}

fetch("/search.json")
  .then((res) => res.json())
  .then((index) => {
    fuse = new Fuse(index, {
      keys: ["title", "content"],
      includeMatches: false,
      threshold: 0.3,
      ignoreLocation: true,
    });
  });

input.addEventListener("input", () => {
  const query = input.value.trim();
  if (!query || !fuse) {
    results.innerHTML = "";
    return;
  }
  render(fuse.search(query).slice(0, 20));
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const first = results.querySelector("a");
    if (first) window.location.href = first.getAttribute("href");
  }
  if (e.key === "Escape") {
    input.value = "";
    results.innerHTML = "";
  }
});
