// ===== playlist.js =====
// Displays songs in a playlist

const playlistContainer = document.getElementById("playlistSongs");
const playlistGrid = document.getElementById("playlistGrid");

// Sample playlists for the home page
const featuredPlaylists = [
  { 
    name: "Today's Top Hits", 
    description: "The hottest tracks right now", 
    coverImage: "assets/images/playlist-todays-top-hits.jpg",
    songs: [
      { name: "Starboy", artist: "The Weeknd", url: "assets/music/starboy.mp3", albumArt: "assets/images/album-after-hours.jpg" },
      { name: "Peaches", artist: "Justin Bieber", url: "assets/music/peaches.mp3", albumArt: "assets/images/album-justice.jpg" },
      { name: "Stay", artist: "The Kid LAROI", url: "assets/music/stay.mp3", albumArt: "assets/images/album-fk-love.jpg" }
    ]
  },
  { 
    name: "Chill Vibes", 
    description: "Relax and unwind", 
    coverImage: "assets/images/playlist-chill-vibes.jpg",
    songs: []
  },
  { 
    name: "Workout Beats", 
    description: "Energy for your workout", 
    coverImage: "assets/images/playlist-workout-beats.jpg",
    songs: []
  },
  { 
    name: "Throwback Hits", 
    description: "Classics from the past", 
    coverImage: "assets/images/playlist-throwback-hits.jpg",
    songs: []
  },
  { 
    name: "Indie Mix", 
    description: "Fresh indie discoveries", 
    coverImage: "assets/images/playlist-indie-mix.jpg",
    songs: []
  },
  { 
    name: "Focus Flow", 
    description: "Music to help you concentrate", 
    coverImage: "assets/images/playlist-focus-flow.jpg",
    songs: []
  }
];

// Sample songs for a single playlist
const playlistSongs = [
  { name: "Starboy", artist: "The Weeknd", url: "assets/music/starboy.mp3", albumArt: "assets/images/album-after-hours.jpg", artistImage: "assets/images/artist-weeknd.jpg" },
  { name: "Peaches", artist: "Justin Bieber", url: "assets/music/peaches.mp3", albumArt: "assets/images/album-justice.jpg", artistImage: "assets/images/artist-bieber.jpg" },
  { name: "Stay", artist: "The Kid LAROI", url: "assets/music/stay.mp3", albumArt: "assets/images/album-fk-love.jpg", artistImage: "assets/images/artist-laroi.jpg" },
  { name: "Blinding Lights", artist: "The Weeknd", url: "assets/music/blinding-lights.mp3", albumArt: "assets/images/album-after-hours.jpg", artistImage: "assets/images/artist-weeknd.jpg" },
  { name: "Good 4 U", artist: "Olivia Rodrigo", url: "assets/music/good-4-u.mp3", albumArt: "assets/images/album-sour.jpg", artistImage: "assets/images/artist-rodrigo.jpg" },
  { name: "Levitating", artist: "Dua Lipa", url: "assets/music/levitating.mp3", albumArt: "assets/images/album-future-nostalgia.jpg", artistImage: "assets/images/artist-dua-lipa.jpg" }
];

// Render featured playlists on home page
if (playlistGrid) {
  featuredPlaylists.forEach((playlist) => {
    const card = document.createElement("div");
    card.className = "card playlist-card";
    card.innerHTML = `
      <div class="album-art">
        <img src="${playlist.coverImage || 'assets/images/default-playlist.jpg'}" alt="${playlist.name} Playlist Cover" loading="lazy">
        <div class="play-overlay">
          <button class="play-btn-large" data-playlist="${playlist.name}">
            <span class="play-icon">▶</span>
          </button>
        </div>
      </div>
      <h3>${playlist.name}</h3>
      <p>${playlist.description}</p>
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
    
    // Add click event to navigate to playlist
    card.addEventListener('click', () => {
      window.location.href = `playlist.html?name=${encodeURIComponent(playlist.name)}`;
    });
    
    playlistGrid.appendChild(card);
  });
}

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
  updateLikeButtonUI(song.name, song.artist);
  
  // If song was added (liked), also save the artist to Library → Artists
  if (wasAdded && song.artist && typeof addArtistFromSong === 'function') {
    addArtistFromSong(song);
  }
  
  return wasAdded; // Return true if song was added, false if removed
}

// Export functions for global access
window.isSongLiked = isSongLiked;
window.toggleLike = toggleLike;

// Update like button UI
function updateLikeButtonUI(songName, artist) {
  const likeBtn = document.querySelector(`[data-like-name="${songName}"][data-like-artist="${artist}"]`);
  if (likeBtn) {
    const isLiked = isSongLiked(songName, artist);
    likeBtn.innerHTML = isLiked ? '💚' : '🤍';
    likeBtn.classList.toggle('liked', isLiked);
  }
}

// Render songs in a playlist page
if (playlistContainer) {
  playlistSongs.forEach((song, index) => {
    const songRow = document.createElement("div");
    songRow.className = "song-row";
    
    // Add data attributes for song detail panel
    songRow.dataset.name = song.name;
    songRow.dataset.artist = song.artist;
    songRow.dataset.cover = song.albumArt || 'assets/images/default-album.jpg';
    songRow.dataset.album = song.name; // You could add album data here
    songRow.dataset.duration = '3:24'; // Mock duration
    songRow.dataset.type = 'song';
    
    // Check if song is liked
    const isLiked = isSongLiked(song.name, song.artist);
    
    songRow.innerHTML = `
      <div class="song-number">${index + 1}</div>
      <div class="song-info">
        <img src="${song.albumArt || 'assets/images/default-album.jpg'}" alt="${song.name} Album Cover" class="song-album-art" loading="lazy">
        <div class="song-details">
          <div class="song-title">${song.name}</div>
          <div class="song-artist">${song.artist}</div>
        </div>
      </div>
      <div class="song-duration">3:24</div>
      <div class="song-actions">
        <button class="like-btn ${isLiked ? 'liked' : ''}" 
          data-like-name="${song.name}" 
          data-like-artist="${song.artist}"
          onclick="event.stopPropagation();"
          title="${isLiked ? 'Unlike' : 'Like'} this song">
          ${isLiked ? '💚' : '🤍'}
        </button>
        <button class="play-btn" 
          data-song="${song.url}" 
          data-name="${song.name}" 
          data-artist="${song.artist}"
          data-album-art="${song.albumArt || 'assets/images/default-album.jpg'}"
          data-artist-image="${song.artistImage || 'assets/images/default-artist.jpg'}"
          onclick="event.stopPropagation();">
          <span class="play-icon">▶</span>
        </button>
      </div>
    `;
    
    // Add click event for song detail panel
    songRow.addEventListener('click', (e) => {
      // Don't open panel if clicking on play button
      if (!e.target.closest('.play-btn')) {
        const songData = {
          name: song.name,
          artist: song.artist,
          cover: song.albumArt || 'assets/images/default-album.jpg',
          albumArt: song.albumArt || 'assets/images/default-album.jpg',
          artistImage: song.artistImage || song.albumArt || 'assets/images/default-album.jpg',
          album: song.album || song.name,
          duration: song.duration || '3:24',
          url: song.url || ''
        };
        openSongDetailPanel(songData);
      }
    });
    
    // Add hover effect
    songRow.addEventListener('mouseenter', () => {
      songRow.classList.add('song-row-hover');
    });
    
    songRow.addEventListener('mouseleave', () => {
      songRow.classList.remove('song-row-hover');
    });
    
    // Add click event for like button
    const likeBtn = songRow.querySelector('.like-btn');
    likeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const songData = {
        name: song.name,
        artist: song.artist,
        url: song.url,
        albumArt: song.albumArt || 'assets/images/default-album.jpg',
        artistImage: song.artistImage || 'assets/images/default-artist.jpg'
      };
      toggleLike(songData);
    });
    
    playlistContainer.appendChild(songRow);
  });
}

// Handle URL parameters to load specific playlist
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const playlistName = urlParams.get('name');
  
  if (playlistName && document.querySelector('.playlist-header h1')) {
    document.querySelector('.playlist-header h1').textContent = playlistName;
    
    // Find the playlist cover if available
    const playlist = featuredPlaylists.find(p => p.name === playlistName);
    if (playlist && playlist.coverImage && document.querySelector('.playlist-cover img')) {
      document.querySelector('.playlist-cover img').src = playlist.coverImage;
      document.querySelector('.playlist-cover img').alt = `${playlistName} Playlist Cover`;
    }
  }
});
