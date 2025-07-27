const API_KEY = "dSmFYQr7C2aHEpofDQQH7549iX1zzKSi";

let currentKeyword = "";
let currentOffset = 0;
let isTrending = true;

window.addEventListener("DOMContentLoaded", () => {
  // Attach dark mode toggle
  const themeToggle = document.getElementById("toggleTheme");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.getElementById("mainContent");
    const aboutContent = document.getElementById("aboutContent");

    document.getElementById("homeBtn").addEventListener("click", () => {
      mainContent.style.display = "block";
      aboutContent.style.display = "none";
    });

    document.getElementById("aboutBtn").addEventListener("click", () => {
      mainContent.style.display = "none";
      aboutContent.style.display = "block";
    });

    document.getElementById("toggleTheme").addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
    });

    // Your original GIF loading functions here…
  });

  // Attach search handler
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", async () => {
      const keyword = searchInput.value.trim();
      if (keyword) {
        currentKeyword = keyword;
        currentOffset = 0;
        isTrending = false;
        await fetchGIFs(currentKeyword, currentOffset);
      }
    });
  }

  // Attach load more handler
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", async () => {
      currentOffset += 12;
      if (isTrending) {
        await fetchTrendingGIFs(currentOffset);
      } else if (currentKeyword) {
        await fetchGIFs(currentKeyword, currentOffset);
      }
    });
  }

  // Initial trending load
  fetchTrendingGIFs();
});

async function fetchGIFs(searchTerm, offset = 0) {
  const grid = document.getElementById("gifGrid");
  if (!grid) return;
  if (offset === 0) grid.innerHTML = "Loading...";

  try {
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(
        searchTerm
      )}&api_key=${API_KEY}&limit=12&offset=${offset}`
    );
    const { data } = await response.json();
    if (offset === 0) grid.innerHTML = "";

    data.forEach((gif) => {
      const div = document.createElement("div");
      div.className = "gif-card";
      div.innerHTML = `<img src="${gif.images.fixed_height.url}" alt="${gif.title}" />`;
      grid.appendChild(div);
    });
  } catch (error) {
    grid.innerHTML = `<p style="color:red;">⚠️ Error loading GIFs. Please try again.</p>`;
    console.error("Search fetch error:", error);
  }
}

async function fetchTrendingGIFs(offset = 0) {
  const grid = document.getElementById("gifGrid");
  if (!grid) return;
  if (offset === 0) grid.innerHTML = "Loading trending GIFs...";
  isTrending = true;

  try {
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=12&offset=${offset}`
    );
    const { data } = await response.json();
    if (offset === 0) grid.innerHTML = "";

    data.forEach((gif) => {
      const div = document.createElement("div");
      div.className = "gif-card";
      div.innerHTML = `<img src="${gif.images.fixed_height.url}" alt="${gif.title}" />`;
      grid.appendChild(div);
    });
  } catch (error) {
    grid.innerHTML = `<p style="color:red;">⚠️ Error loading trending GIFs. Please try again.</p>`;
    console.error("Trending fetch error:", error);
  }
}
