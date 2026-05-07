// Song Detail Panel Functionality
let currentSongData = null;

// Initialize panel functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  setupSongClickHandlers();
  setupPanelCloseHandlers();
});

// Setup click handlers for song cards
function setupSongClickHandlers() {
  // Handle clicks on music cards in home page
  const musicCards = document.querySelectorAll('.music-card');
  musicCards.forEach(card => {
    card.addEventListener('click', function(e) {
      if (!e.target.closest('.play-btn')) {
        const songData = getSongDataFromCard(this);
        openSongDetailPanel(songData);
      }
    });
  });

  // Handle clicks on playlist song items
  const playlistSongs = document.querySelectorAll('.song-item');
  playlistSongs.forEach(song => {
    song.addEventListener('click', function(e) {
      if (!e.target.closest('.play-btn')) {
        const songData = getSongDataFromPlaylist(this);
        openSongDetailPanel(songData);
      }
    });
  });
}

// Setup panel close handlers
function setupPanelCloseHandlers() {
  const overlay = document.querySelector('.song-detail-overlay');
  const closeBtn = document.querySelector('.close-panel-btn');
  
  if (overlay) {
    overlay.addEventListener('click', closeSongDetailPanel);
  }
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeSongDetailPanel);
  }

  // ESC key to close panel
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeSongDetailPanel();
    }
  });
}

// Extract song data from music card
function getSongDataFromCard(card) {
  const coverImg = card.querySelector('img');
  const title = card.querySelector('h3');
  const artist = card.querySelector('p');
  
  return {
    name: title ? title.textContent : 'Unknown Song',
    artist: artist ? artist.textContent : 'Unknown Artist',
    cover: coverImg ? coverImg.src : 'assets/images/default-album.jpg',
    album: card.dataset.album || 'Unknown Album',
    duration: card.dataset.duration || '0:00'
  };
}

// Extract song data from playlist item
function getSongDataFromPlaylist(songItem) {
  const coverImg = songItem.querySelector('.song-cover img');
  const title = songItem.querySelector('.song-title');
  const artist = songItem.querySelector('.song-artist');
  
  return {
    name: title ? title.textContent : 'Unknown Song',
    artist: artist ? artist.textContent : 'Unknown Artist',
    cover: coverImg ? coverImg.src : 'assets/images/default-album.jpg',
    album: songItem.dataset.album || 'Unknown Album',
    duration: songItem.dataset.duration || '0:00'
  };
}

// Open song detail panel
function openSongDetailPanel(songData) {
  currentSongData = songData;
  const panel = document.getElementById('song-detail-panel');
  
  if (!panel) return;
  
  // Update panel content
  updatePanelContent(songData);
  
  // Show panel
  panel.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Add animation class
  setTimeout(() => {
    panel.classList.add('panel-open');
  }, 10);
}

// Close song detail panel
function closeSongDetailPanel() {
  const panel = document.getElementById('song-detail-panel');
  
  if (!panel) return;
  
  // Remove active class
  panel.classList.remove('active', 'panel-open');
  document.body.style.overflow = '';
  
  // Clear current song data
  currentSongData = null;
}

// Update panel content with song data
function updatePanelContent(songData) {
  const coverImg = document.getElementById('song-detail-cover');
  const nameEl = document.getElementById('song-detail-name');
  const artistEl = document.getElementById('song-detail-artist');
  const albumEl = document.getElementById('song-detail-album');
  
  if (coverImg) coverImg.src = songData.cover;
  if (nameEl) nameEl.textContent = songData.name;
  if (artistEl) artistEl.textContent = songData.artist;
  if (albumEl) albumEl.textContent = songData.album;
  
  // Update like button state
  updateLikeButtonState(songData);
}

// Update like button to show current liked status
function updateLikeButtonState(songData) {
  // Find the like button - it's the button with onclick="likeSelectedSong()"
  const actionButtons = document.querySelectorAll('.song-detail-actions .action-btn');
  let likeBtn = null;
  
  actionButtons.forEach(btn => {
    if (btn.getAttribute('onclick') === 'likeSelectedSong()' || 
        btn.onclick && btn.onclick.toString().includes('likeSelectedSong')) {
      likeBtn = btn;
    }
  });
  
  // Fallback: if not found by onclick, try finding by position (second button)
  if (!likeBtn && actionButtons.length > 1) {
    likeBtn = actionButtons[1]; // Second button is usually the like button
  }
  
  if (!likeBtn) return;
  
  // Check if song is liked
  let isLiked = false;
  if (typeof isSongLiked === 'function') {
    isLiked = isSongLiked(songData.name, songData.artist);
  } else {
    // Fallback: check localStorage directly
    const likedSongs = JSON.parse(localStorage.getItem('likedSongs') || '[]');
    isLiked = likedSongs.some(s => s.name === songData.name && s.artist === songData.artist);
  }
  
  // Update button appearance
  if (isLiked) {
    likeBtn.textContent = '♥';
    likeBtn.style.color = '#1db954';
    likeBtn.classList.add('liked');
  } else {
    likeBtn.textContent = '♡';
    likeBtn.style.color = '';
    likeBtn.classList.remove('liked');
  }
}

// Panel action functions
function playSelectedSong() {
  if (currentSongData) {
    playMusic(currentSongData.name, currentSongData.artist, currentSongData.cover);
    closeSongDetailPanel();
  }
}

function likeSelectedSong() {
  if (currentSongData) {
    // Prepare song data
    const songData = {
      name: currentSongData.name,
      artist: currentSongData.artist,
      url: currentSongData.url || '',
      albumArt: currentSongData.cover || currentSongData.albumArt || 'assets/images/default-album.jpg',
      artistImage: currentSongData.artistImage || currentSongData.cover || 'assets/images/default-album.jpg',
      album: currentSongData.album || currentSongData.name
    };
    
    // Check current liked status
    let isCurrentlyLiked = false;
    if (typeof isSongLiked === 'function') {
      isCurrentlyLiked = isSongLiked(songData.name, songData.artist);
    } else {
      // Fallback: check localStorage directly
      const likedSongs = JSON.parse(localStorage.getItem('likedSongs') || '[]');
      isCurrentlyLiked = likedSongs.some(s => s.name === songData.name && s.artist === songData.artist);
    }
    
    // Use toggleLike if available (from library.js or playlist.js)
    let wasAdded = false;
    if (typeof toggleLike === 'function') {
      wasAdded = toggleLike(songData);
      
      // If song was liked (added), also save the artist
      if (wasAdded && typeof addArtistFromSong === 'function') {
        addArtistFromSong(songData);
      }
    } else {
      // Fallback: manually toggle liked songs
      const likedSongs = JSON.parse(localStorage.getItem('likedSongs') || '[]');
      const songIndex = likedSongs.findIndex(s => s.name === songData.name && s.artist === songData.artist);
      
      if (songIndex === -1) {
        // Add to liked songs
        likedSongs.push(songData);
        wasAdded = true;
        
        // Save artist when liking
        if (typeof addArtistFromSong === 'function') {
          addArtistFromSong(songData);
        }
      } else {
        // Remove from liked songs
        likedSongs.splice(songIndex, 1);
        wasAdded = false;
      }
      
      localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
    }
    
    // Update button state immediately
    const likeBtn = event.target;
    if (wasAdded) {
      // Song was added (liked)
      likeBtn.textContent = '♥';
      likeBtn.style.color = '#1db954';
      likeBtn.classList.add('liked');
    } else {
      // Song was removed (unliked)
      likeBtn.textContent = '♡';
      likeBtn.style.color = '';
      likeBtn.classList.remove('liked');
    }
  }
}

function addSelectedToPlaylist() {
  if (currentSongData) {
    // Save album to Library → Albums section
    if (typeof addAlbumFromSong === 'function') {
      const added = addAlbumFromSong(currentSongData);
      if (added) {
        // Visual feedback
        const addBtn = event.target;
        const originalText = addBtn.textContent;
        addBtn.textContent = '✓';
        addBtn.style.color = '#1db954';
        setTimeout(() => {
          addBtn.textContent = originalText;
          addBtn.style.color = '';
        }, 1500);
      } else {
        // Album already saved
        const addBtn = event.target;
        const originalText = addBtn.textContent;
        addBtn.textContent = '✓';
        addBtn.style.color = '#1db954';
        setTimeout(() => {
          addBtn.textContent = originalText;
          addBtn.style.color = '';
        }, 1000);
      }
    }
  }
}

function shareSelectedSong() {
  if (currentSongData) {
    // Share song logic
    const shareText = `Check out "${currentSongData.name}" by ${currentSongData.artist}`;
    
    if (navigator.share) {
      navigator.share({
        title: currentSongData.name,
        text: shareText,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Song details copied to clipboard!');
      });
    }
  }
}

// Utility function to play music (integrates with existing music player)
function playMusic(name, artist, cover) {
  // This function should integrate with your existing music player
  console.log('Playing:', name, 'by', artist);
  
  // Create song data for recently played
  const songData = {
    title: name,
    artist: artist,
    cover: cover || 'assets/images/default-album.jpg',
    src: '' // Audio source will be handled by the main music player
  };
  
  // Add to recently played
  if (typeof addToRecentlyPlayed === 'function') {
    addToRecentlyPlayed(songData);
  }
  
  // Update music player if it exists
  if (typeof updateMusicPlayer === 'function') {
    updateMusicPlayer(name, artist, cover);
  }
  
  // Or use existing playMusic function if available
  if (typeof window.playMusic === 'function') {
    window.playMusic(name, artist, cover);
  }
}

// Add artist to Library Artists section
function addSelectedArtist() {
  if (currentSongData && currentSongData.artist) {
    const songData = {
      artist: currentSongData.artist,
      artistImage: currentSongData.artistImage || currentSongData.cover || 'assets/images/default-album.jpg',
      cover: currentSongData.cover || 'assets/images/default-album.jpg'
    };
    
    if (typeof addArtistFromSong === 'function') {
      const added = addArtistFromSong(songData);
      if (added) {
        // Visual feedback
        const artistBtn = event.target;
        const originalText = artistBtn.textContent;
        artistBtn.textContent = '✓';
        artistBtn.style.color = '#1db954';
        setTimeout(() => {
          artistBtn.textContent = originalText;
          artistBtn.style.color = '';
        }, 1500);
      } else {
        // Artist already followed
        const artistBtn = event.target;
        const originalText = artistBtn.textContent;
        artistBtn.textContent = '✓';
        artistBtn.style.color = '#1db954';
        setTimeout(() => {
          artistBtn.textContent = originalText;
          artistBtn.style.color = '';
        }, 1000);
      }
    }
  }
}

// Reinitialize handlers when new content is loaded
function reinitializeSongHandlers() {
  setupSongClickHandlers();
}

// Export functions for global access
window.openSongDetailPanel = openSongDetailPanel;
window.closeSongDetailPanel = closeSongDetailPanel;
window.playSelectedSong = playSelectedSong;
window.likeSelectedSong = likeSelectedSong;
window.addSelectedToPlaylist = addSelectedToPlaylist;
window.addSelectedArtist = addSelectedArtist;
window.shareSelectedSong = shareSelectedSong;
window.reinitializeSongHandlers = reinitializeSongHandlers;