// ===== artists.js =====
// Handles user's followed artists

const artistsContainer = document.getElementById("artistsContainer");

// Get followed artists from localStorage
function getFollowedArtists() {
  const followedArtists = localStorage.getItem('followedArtists');
  return followedArtists ? JSON.parse(followedArtists) : [];
}

// Save artists to localStorage
function saveArtists(artists) {
  localStorage.setItem('followedArtists', JSON.stringify(artists));
}

// Add artist from song data
function addArtistFromSong(songData) {
  if (!songData || !songData.artist) return false;
  
  const followedArtists = getFollowedArtists();
  const artistName = songData.artist;
  
  // Check if artist already exists
  const existingArtist = followedArtists.find(
    artist => artist.name === artistName
  );
  
  if (existingArtist) {
    return false; // Artist already followed
  }
  
  // Create artist object
  const newArtist = {
    name: artistName,
    image: songData.artistImage || songData.cover || 'assets/images/default-album.jpg',
    coverImage: songData.artistImage || songData.cover || 'assets/images/default-album.jpg'
  };
  
  followedArtists.push(newArtist);
  saveArtists(followedArtists);
  
  // Refresh display if on artists page
  if (artistsContainer) {
    displayArtists();
  }
  
  return true;
}

// Remove artist from followed artists
function removeArtist(artistName) {
  const followedArtists = getFollowedArtists();
  const artistIndex = followedArtists.findIndex(artist => artist.name === artistName);
  if (artistIndex !== -1) {
    followedArtists.splice(artistIndex, 1);
    saveArtists(followedArtists);
    displayArtists(); // Refresh display
  }
}

// Export function for global access
window.addArtistFromSong = addArtistFromSong;
window.getFollowedArtists = getFollowedArtists;
window.removeArtist = removeArtist;

// Display followed artists
function displayArtists() {
  if (!artistsContainer) return;
  
  const followedArtists = getFollowedArtists();
  
  // Clear container
  artistsContainer.innerHTML = '';
  
  if (followedArtists.length === 0) {
    artistsContainer.innerHTML = `
      <div class="no-content-message">
        <p>No artists followed yet</p>
      </div>
    `;
    return;
  }
  
  // Render artists
  followedArtists.forEach((artist) => {
    const card = document.createElement("div");
    card.className = "card playlist-card";
    const artistName = artist.name;
    card.innerHTML = `
      <div class="album-art">
        <img src="${artist.image || artist.coverImage || 'assets/images/default-album.jpg'}" alt="${artist.name} Artist Image" loading="lazy" style="border-radius: 50%;">
        <div class="play-overlay">
          <button class="play-btn-large">
            <span class="play-icon">▶</span>
          </button>
        </div>
      </div>
      <div class="card-content">
        <h3>${artist.name}</h3>
        <p>Artist</p>
        <button class="remove-btn" data-artist-name="${artistName}" title="Unfollow artist">
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
    
    // Add click event to navigate to artist page or play (but not on remove button)
    card.addEventListener('click', (e) => {
      // Don't trigger if clicking on remove button
      if (e.target.closest('.remove-btn')) {
        return;
      }
      // You can navigate to an artist detail page if needed
      // For now, just trigger play
      if (typeof playSongFromElement === 'function') {
        const playBtn = card.querySelector('.play-btn-large');
        playBtn.setAttribute('data-title', artist.name);
        playBtn.setAttribute('data-artist', artist.name);
        playBtn.setAttribute('data-cover', artist.image || artist.coverImage || 'assets/images/default-album.jpg');
        playSongFromElement(playBtn);
      }
    });
    
    // Add remove button functionality
    const removeBtn = card.querySelector('.remove-btn');
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const artistName = removeBtn.getAttribute('data-artist-name');
      removeArtist(artistName);
    });
    
    artistsContainer.appendChild(card);
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  displayArtists();
});

