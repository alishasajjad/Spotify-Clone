// ===== albums.js =====
// Handles user's saved albums

const albumsContainer = document.getElementById("albumsContainer");

// Get saved albums from localStorage
function getSavedAlbums() {
  const savedAlbums = localStorage.getItem('savedAlbums');
  return savedAlbums ? JSON.parse(savedAlbums) : [];
}

// Save albums to localStorage
function saveAlbums(albums) {
  localStorage.setItem('savedAlbums', JSON.stringify(albums));
}

// Add album from song data
function addAlbumFromSong(songData) {
  if (!songData) return false;
  
  const savedAlbums = getSavedAlbums();
  const albumName = songData.album || songData.name;
  const artistName = songData.artist || 'Unknown Artist';
  
  // Check if album already exists
  const existingAlbum = savedAlbums.find(
    album => album.name === albumName && album.artist === artistName
  );
  
  if (existingAlbum) {
    return false; // Album already saved
  }
  
  // Create album object
  const newAlbum = {
    name: albumName,
    artist: artistName,
    coverImage: songData.cover || songData.albumArt || 'assets/images/default-album.jpg',
    image: songData.cover || songData.albumArt || 'assets/images/default-album.jpg'
  };
  
  savedAlbums.push(newAlbum);
  saveAlbums(savedAlbums);
  
  // Refresh display if on albums page
  if (albumsContainer) {
    displayAlbums();
  }
  
  return true;
}

// Remove album from saved albums
function removeAlbum(albumKey) {
  const savedAlbums = getSavedAlbums();
  // Split on the last underscore (in case name or artist contains underscores)
  const lastUnderscore = albumKey.lastIndexOf('_');
  if (lastUnderscore === -1) return;
  
  const name = albumKey.substring(0, lastUnderscore);
  const artist = albumKey.substring(lastUnderscore + 1);
  
  const albumIndex = savedAlbums.findIndex(
    album => album.name === name && (album.artist || 'Unknown') === artist
  );
  if (albumIndex !== -1) {
    savedAlbums.splice(albumIndex, 1);
    saveAlbums(savedAlbums);
    displayAlbums(); // Refresh display
  }
}

// Export function for global access
window.addAlbumFromSong = addAlbumFromSong;
window.getSavedAlbums = getSavedAlbums;
window.removeAlbum = removeAlbum;

// Display saved albums
function displayAlbums() {
  if (!albumsContainer) return;
  
  const savedAlbums = getSavedAlbums();
  
  // Clear container
  albumsContainer.innerHTML = '';
  
  if (savedAlbums.length === 0) {
    albumsContainer.innerHTML = `
      <div class="no-content-message">
        <p>No albums saved yet</p>
      </div>
    `;
    return;
  }
  
  // Render albums
  savedAlbums.forEach((album) => {
    const card = document.createElement("div");
    card.className = "card playlist-card";
    const albumKey = `${album.name}_${album.artist || 'Unknown'}`;
    card.innerHTML = `
      <div class="album-art">
        <img src="${album.coverImage || album.image || 'assets/images/default-album.jpg'}" alt="${album.name} Album Cover" loading="lazy">
        <div class="play-overlay">
          <button class="play-btn-large">
            <span class="play-icon">▶</span>
          </button>
        </div>
      </div>
      <div class="card-content">
        <h3>${album.name}</h3>
        <p>${album.artist || 'Artist'}</p>
        <button class="remove-btn" data-album-key="${albumKey}" title="Remove album">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    // Add hover effect for play button
    const albumArt = card.querySelector('.album-art');
    const playOverlay = card.querySelector('.play-overlay');
    
    albumArt.addEventListener('mouseenter', () => {
      playOverlay.style.opacity = '1';
    });
    
    albumArt.addEventListener('mouseleave', () => {
      playOverlay.style.opacity = '0';
    });
    
    // Add click event to navigate to album or play (but not on remove button)
    card.addEventListener('click', (e) => {
      // Don't trigger if clicking on remove button
      if (e.target.closest('.remove-btn')) {
        return;
      }
      // You can navigate to an album detail page if needed
      // For now, just trigger play
      if (typeof playSongFromElement === 'function') {
        const playBtn = card.querySelector('.play-btn-large');
        playBtn.setAttribute('data-title', album.name);
        playBtn.setAttribute('data-artist', album.artist || 'Artist');
        playBtn.setAttribute('data-cover', album.coverImage || album.image || 'assets/images/default-album.jpg');
        playSongFromElement(playBtn);
      }
    });
    
    // Add remove button functionality
    const removeBtn = card.querySelector('.remove-btn');
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const albumKey = removeBtn.getAttribute('data-album-key');
      removeAlbum(albumKey);
    });
    
    albumsContainer.appendChild(card);
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  displayAlbums();
});

