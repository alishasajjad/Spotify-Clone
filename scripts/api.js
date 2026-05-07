// ===== api.js =====
// Example structure for connecting to a backend or Spotify API

const API_BASE = "https://api.spotify.com/v1";

async function getFeaturedPlaylists() {
  try {
    const response = await fetch(`${API_BASE}/browse/featured-playlists`);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("API Error:", error);
  }
}

// Example: call function on home page
if (window.location.pathname.includes("home.html")) {
  console.log("Fetching featured playlists...");
  // getFeaturedPlaylists(); // Uncomment if you add a backend/API key
}
