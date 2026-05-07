// ===== library.js =====
// Handles user's saved playlists and songs

const libraryContainer = document.getElementById("libraryContainer");
const likedSongsContainer = document.getElementById("likedSongsContainer");
const likedSongsCount = document.getElementById("likedSongsCount");

// ===== LIKED SONGS SYSTEM =====

// Get liked songs from localStorage
function getLikedSongs() {
  const likedSongs = localStorage.getItem('likedSongs');
  return likedSongs ? JSON.parse(likedSongs) : [];
}

// Check if a song is liked
function isSongLiked(songName, artist) {
  const likedSongs = getLikedSongs();
  return likedSongs.some(song => song.name === songName && song.artist === artist);
}

// Toggle like status for a song
function toggleLike(song) {
  const likedSongs = getLikedSongs();
  const songIndex = likedSongs.findIndex(s => s.name === song.name && s.artist === song.artist);
  
  const wasAdded = songIndex === -1;
  
  if (songIndex === -1) {
    // Song is not liked, add it
    likedSongs.push(song);
  } else {
    // Song is liked, remove it
    likedSongs.splice(songIndex, 1);
  }
  
  // Save to localStorage
  localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
  
  // Update UI
  updateLikedSongsDisplay();
  
  // If song was added (liked), also save the artist to Library → Artists
  if (wasAdded && song.artist && typeof addArtistFromSong === 'function') {
    addArtistFromSong(song);
  }
  
  return wasAdded; // Return true if song was added, false if removed
}

// Export functions for global access
window.isSongLiked = isSongLiked;
window.toggleLike = toggleLike;

// Update liked songs display
function updateLikedSongsDisplay() {
  const likedSongs = getLikedSongs();
  
  // Update count
  if (likedSongsCount) {
    likedSongsCount.textContent = `${likedSongs.length} song${likedSongs.length !== 1 ? 's' : ''}`;
  }
  
  // Clear container
  if (likedSongsContainer) {
    likedSongsContainer.innerHTML = '';
    
    if (likedSongs.length === 0) {
      likedSongsContainer.innerHTML = `
        <div class="no-liked-songs">
          <p>No liked songs yet</p>
        </div>
      `;
    } else {
      // Render liked songs
      likedSongs.forEach((song, index) => {
        const songCard = document.createElement("div");
        songCard.className = "liked-song-card";
        songCard.innerHTML = `
          <img src="${song.albumArt || 'assets/images/default-album.jpg'}" alt="${song.name} Album Cover" class="liked-song-cover" loading="lazy">
          <div class="liked-song-info">
            <div class="liked-song-title">${song.name}</div>
            <div class="liked-song-artist">${song.artist}</div>
          </div>
          <div class="liked-song-actions">
            <button class="play-btn-small" 
              data-song="${song.url || ''}" 
              data-name="${song.name}" 
              data-artist="${song.artist}"
              data-album-art="${song.albumArt || 'assets/images/default-album.jpg'}"
              data-artist-image="${song.artistImage || 'assets/images/default-album.jpg'}"
              onclick="event.stopPropagation();"
              title="Play song">
              <i class="fas fa-play"></i>
            </button>
            <button class="like-btn liked" 
              data-like-name="${song.name}" 
              data-like-artist="${song.artist}"
              onclick="event.stopPropagation();"
              title="Unlike this song">
              <i class="fas fa-heart"></i>
            </button>
          </div>
        `;
        
        // Add click event for song detail panel
        songCard.addEventListener('click', (e) => {
          // Don't open panel if clicking on action buttons
          if (!e.target.closest('.like-btn') && !e.target.closest('.play-btn-small')) {
            const songData = {
              name: song.name,
              artist: song.artist,
              cover: song.albumArt || 'assets/images/default-album.jpg',
              album: song.album || song.name,
              duration: song.duration || '3:24'
            };
            if (typeof openSongDetailPanel === 'function') {
              openSongDetailPanel(songData);
            }
          }
        });
        
        // Add click event for play button
        const playBtn = songCard.querySelector('.play-btn-small');
        playBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          // Try to use playSongFromElement if available (from musicPlayer.js)
          if (typeof playSongFromElement === 'function') {
            playBtn.setAttribute('data-title', song.name);
            playBtn.setAttribute('data-cover', song.albumArt || 'assets/images/default-album.jpg');
            playSongFromElement(playBtn);
          } else if (typeof playSong === 'function') {
            // Try musicPlayer.js version
            if (song.url) {
              playSong(song.url, song.name, song.artist, song.albumArt || 'assets/images/default-album.jpg');
            } else {
              // Fallback to app.js version
              playSong(song.name, song.artist, song.albumArt || 'assets/images/default-album.jpg');
            }
          } else if (typeof updateNowPlaying === 'function') {
            updateNowPlaying(song.name, song.artist, song.albumArt || 'assets/images/default-album.jpg');
          }
        });
        
        // Add click event for like button
        const likeBtn = songCard.querySelector('.like-btn');
        likeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleLike(song);
        });
        
        likedSongsContainer.appendChild(songCard);
      });
    }
  }
}

const savedPlaylists = [
  { 
    name: "Chill Vibes", 
    songs: 15, 
    coverImage: "assets/images/playlist-chill-vibes.jpg",
    description: "Relaxing tunes for your downtime"
  },
  { 
    name: "Workout Mix", 
    songs: 20, 
    coverImage: "assets/images/playlist-workout-beats.jpg",
    description: "High energy tracks to keep you moving"
  },
  { 
    name: "Top Hits 2025", 
    songs: 12, 
    coverImage: "assets/images/playlist-todays-top-hits-2025.jpg",
    description: "The biggest hits of the year"
  },
  { 
    name: "Road Trip Essentials", 
    songs: 18, 
    coverImage: "assets/images/playlist-road-trip.jpg",
    description: "Perfect soundtrack for your journey"
  },
  { 
    name: "Acoustic Sessions", 
    songs: 14, 
    coverImage: "assets/images/playlist-acoustic.jpg",
    description: "Stripped back versions of your favorite songs"
  }
];

if (libraryContainer) {
  savedPlaylists.forEach((playlist) => {
    const card = document.createElement("div");
    card.className = "card playlist-card";
    card.innerHTML = `
      <div class="album-art">
        <img src="${playlist.coverImage || 'assets/images/default-playlist.png'}" alt="${playlist.name} Playlist Cover" loading="lazy">
        <div class="play-overlay">
          <button class="play-btn-large">
            <span class="play-icon">▶</span>
          </button>
        </div>
      </div>
      <h3>${playlist.name}</h3>
      <p>${playlist.description || `${playlist.songs} songs`}</p>
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
    
    libraryContainer.appendChild(card);
  });
  
  // Initialize liked songs display
  updateLikedSongsDisplay();
}
