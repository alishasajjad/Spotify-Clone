// ===== search.js =====
// Handles music search and browse functionality

const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearch");
const browseContent = document.getElementById("browseContent");
const searchResults = document.getElementById("searchResults");
const resultsContent = document.getElementById("resultsContent");
const genreGrid = document.getElementById("genreGrid");

// Demo search data
const demoData = {
  songs: [
    { name: "Blinding Lights", artist: "The Weeknd", cover: "assets/images/album-after-hours.jpg", type: "song" },
    { name: "Shape of You", artist: "Ed Sheeran", cover: "assets/images/category-rock.jpg", type: "song" },
    { name: "Levitating", artist: "Dua Lipa", cover: "assets/images/album-future-nostalgia.jpg", type: "song" },
    { name: "Someone Like You", artist: "Adele", cover: "assets/images/default-album.jpg", type: "song" },
    { name: "Starboy", artist: "The Weeknd", cover: "assets/images/album-after-hours.jpg", type: "song" },
    { name: "Peaches", artist: "Justin Bieber", cover: "assets/images/album-justice.jpg", type: "song" },
  ],
  albums: [
    { name: "After Hours", artist: "The Weeknd", cover: "assets/images/album-after-hours.jpg", type: "album" },
    { name: "Justice", artist: "Justin Bieber", cover: "assets/images/album-justice.jpg", type: "album" },
    { name: "Future Nostalgia", artist: "Dua Lipa", cover: "assets/images/album-future-nostalgia.jpg", type: "album" },
    { name: "SOUR", artist: "Olivia Rodrigo", cover: "assets/images/album-sour.jpg", type: "album" },
  ],
  artists: [
    { name: "The Weeknd", image: "assets/images/artist-weeknd.jpg", type: "artist" },
    { name: "Dua Lipa", image: "assets/images/artist-dua-lipa.jpg", type: "artist" },
    { name: "Justin Bieber", image: "assets/images/artist-bieber.jpg", type: "artist" },
    { name: "Olivia Rodrigo", image: "assets/images/artist-rodrigo.jpg", type: "artist" },
  ],
  playlists: [
    { name: "Today's Top Hits", description: "The hottest tracks right now", cover: "assets/images/playlist-todays-top-hits.jpg", type: "playlist" },
    { name: "Chill Vibes", description: "Relax and unwind", cover: "assets/images/playlist-chill-vibes.jpg", type: "playlist" },
  ]
};

// Genre data
const genres = [
  { name: "Pop", image: "assets/images/category-pop.jpg", color: "#E13300" },
  { name: "Rock", image: "assets/images/category-rock.jpg", color: "#8400E7" },
  { name: "Dark Side", image: "assets/images/category-dark.jpg", color: "#1E3264" },
  { name: "Electronic", image: "assets/images/category-electronic.jpg", color: "#E8115B" },
  { name: "Jazz", image: "assets/images/default-jazz.jpg", color: "#148A08" },
  { name: "Classical", image: "assets/images/default-Classical.jpg", color: "#D84000" },
  { name: "Country", image: "assets/images/default-country.jpg", color: "#E1118C" },
  { name: "R&B", image: "assets/images/default-R_B.jpg", color: "#8B67AB" },
  { name: "Latin", image: "assets/images/default-latin.jpg", color: "#E91429" },
  { name: "Metal", image: "assets/images/default-metal.jpg", color: "#503750" },
  { name: "Indie", image: "assets/images/default-indie.jpg", color: "#BA5D07" },
  { name: "Reggae", image: "assets/images/default-Reggae.jpg", color: "#0D73EC" },
];

const trendingSongsGrid = document.getElementById("trendingSongsGrid");

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  loadGenres();
  loadTrendingSongs();
  setupSearch();
});

// Load genres
function loadGenres() {
  if (!genreGrid) return;
  
  genreGrid.innerHTML = '';
  
  genres.forEach(genre => {
    const card = document.createElement('div');
    card.className = 'genre-card';
    card.style.background = `linear-gradient(135deg, ${genre.color}, ${adjustColor(genre.color, 20)})`;
    card.innerHTML = `
      <img src="${genre.image}" alt="${genre.name}" loading="lazy" style="opacity: 0.3;">
      <div class="genre-card-content">
        <h3>${genre.name}</h3>
      </div>
    `;
    
    card.addEventListener('click', () => {
      searchInput.value = genre.name;
      performGenreSearch(genre.name);
    });
    
    genreGrid.appendChild(card);
  });
}

// Load trending songs
function loadTrendingSongs() {
  if (!trendingSongsGrid || typeof songsData === 'undefined') return;
  
  trendingSongsGrid.innerHTML = '';
  
  // Use first 20 songs from songsData
  const trendingSongs = songsData.slice(0, 20);
  
  trendingSongs.forEach(song => {
    const card = createSongCard(song);
    trendingSongsGrid.appendChild(card);
  });
}

// Create song card component
function createSongCard(song) {
  const card = document.createElement('div');
  card.className = 'song-card';
  card.dataset.songId = song.id;
  
  // Check if song is liked
  let isLiked = false;
  if (typeof isSongLiked === 'function') {
    isLiked = isSongLiked(song.title, song.artist);
  } else {
    const likedSongs = JSON.parse(localStorage.getItem('likedSongs') || '[]');
    isLiked = likedSongs.some(s => s.name === song.title && s.artist === song.artist);
  }
  
  card.innerHTML = `
    <div class="song-card-art">
      <img src="${song.coverImageUrl || 'assets/images/default-album.jpg'}" alt="${song.title}" loading="lazy">
      <div class="song-card-overlay">
        <button class="song-play-btn" data-song-id="${song.id}">
          <i class="fas fa-play"></i>
        </button>
      </div>
      <div class="song-card-actions">
        <button class="song-like-btn ${isLiked ? 'liked' : ''}" data-song-id="${song.id}" title="${isLiked ? 'Unlike' : 'Like'}">
          <i class="fas fa-heart"></i>
        </button>
        <button class="song-add-btn" data-song-id="${song.id}" title="Add to Library">
          <i class="fas fa-plus"></i>
        </button>
      </div>
    </div>
    <div class="song-card-info">
      <h3 class="song-card-title">${song.title}</h3>
      <p class="song-card-artist">${song.artist}</p>
    </div>
  `;
  
  // Add hover effect for play button
  const songArt = card.querySelector('.song-card-art');
  const overlay = card.querySelector('.song-card-overlay');
  const actions = card.querySelector('.song-card-actions');
  
  songArt.addEventListener('mouseenter', () => {
    overlay.style.opacity = '1';
    actions.style.opacity = '1';
  });
  
  songArt.addEventListener('mouseleave', () => {
    overlay.style.opacity = '0';
    actions.style.opacity = '0';
  });
  
  // Play button click
  const playBtn = card.querySelector('.song-play-btn');
  playBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playSongFromCard(song);
  });
  
  // Like button click
  const likeBtn = card.querySelector('.song-like-btn');
  likeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSongLike(song, likeBtn);
  });
  
  // Add to Library button click
  const addBtn = card.querySelector('.song-add-btn');
  addBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    addSongToLibrary(song, addBtn);
  });
  
  return card;
}

// Play song from card
function playSongFromCard(song) {
  // Save to recently played
  saveToRecentlyPlayed(song);
  
  // Use musicPlayer.js function if available
  if (typeof playSong === 'function') {
    playSong(song.audioFileUrl || '', song.title, song.artist, song.coverImageUrl || 'assets/images/default-album.jpg');
  } else if (typeof updateNowPlaying === 'function') {
    updateNowPlaying(song.title, song.artist, song.coverImageUrl || 'assets/images/default-album.jpg');
  }
  
  // Show player bar
  const playerBar = document.getElementById('music-player-bar');
  if (playerBar) {
    playerBar.classList.add('active');
  }
}

// Toggle song like
function toggleSongLike(song, likeBtn) {
  const songData = {
    name: song.title,
    artist: song.artist,
    url: song.audioFileUrl || '',
    albumArt: song.coverImageUrl || 'assets/images/default-album.jpg',
    artistImage: song.coverImageUrl || 'assets/images/default-album.jpg',
    album: song.album || song.title
  };
  
  if (typeof toggleLike === 'function') {
    const wasAdded = toggleLike(songData);
    likeBtn.classList.toggle('liked', wasAdded);
    
    // Update icon
    if (wasAdded) {
      likeBtn.style.color = '#1db954';
    } else {
      likeBtn.style.color = '';
    }
  } else {
    // Fallback
    const likedSongs = JSON.parse(localStorage.getItem('likedSongs') || '[]');
    const songIndex = likedSongs.findIndex(s => s.name === song.title && s.artist === song.artist);
    
    if (songIndex === -1) {
      likedSongs.push(songData);
      likeBtn.classList.add('liked');
      likeBtn.style.color = '#1db954';
    } else {
      likedSongs.splice(songIndex, 1);
      likeBtn.classList.remove('liked');
      likeBtn.style.color = '';
    }
    
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
  }
}

// Add song to library (album and artist)
function addSongToLibrary(song, addBtn) {
  const songData = {
    name: song.title,
    artist: song.artist,
    cover: song.coverImageUrl || 'assets/images/default-album.jpg',
    albumArt: song.coverImageUrl || 'assets/images/default-album.jpg',
    artistImage: song.coverImageUrl || 'assets/images/default-album.jpg',
    album: song.album || song.title
  };
  
  // Add album
  if (typeof addAlbumFromSong === 'function') {
    addAlbumFromSong(songData);
  }
  
  // Add artist
  if (typeof addArtistFromSong === 'function') {
    addArtistFromSong(songData);
  }
  
  // Visual feedback
  const originalHTML = addBtn.innerHTML;
  addBtn.innerHTML = '<i class="fas fa-check"></i>';
  addBtn.style.color = '#1db954';
  setTimeout(() => {
    addBtn.innerHTML = originalHTML;
    addBtn.style.color = '';
  }, 1500);
}

// Save to recently played
function saveToRecentlyPlayed(song) {
  // Use the global addToRecentlyPlayed function if available
  if (typeof addToRecentlyPlayed === 'function') {
    const songData = {
      title: song.title,
      artist: song.artist,
      cover: song.coverImageUrl || 'assets/images/default-album.jpg',
      src: song.audioFileUrl || ''
    };
    addToRecentlyPlayed(songData);
  } else {
    // Fallback to local implementation
    const recentlyPlayed = JSON.parse(localStorage.getItem('recentlyPlayed') || '[]');
    
    // Remove if already exists (by id or by name+artist)
    const existingIndex = recentlyPlayed.findIndex(s => 
      (s.id && song.id && s.id === song.id) || 
      (s.name === song.title && s.artist === song.artist)
    );
    if (existingIndex !== -1) {
      recentlyPlayed.splice(existingIndex, 1);
    }
    
    // Add to beginning
    recentlyPlayed.unshift({
      id: song.id,
      name: song.title,
      title: song.title,
      artist: song.artist,
      coverImage: song.coverImageUrl || 'assets/images/default-album.jpg',
      coverImageUrl: song.coverImageUrl || 'assets/images/default-album.jpg',
      album: song.album || song.title,
      duration: song.duration || '3:00',
      type: 'song'
    });
    
    // Keep only last 50
    if (recentlyPlayed.length > 50) {
      recentlyPlayed.pop();
    }
    
    localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
    
    // Update home page if it exists
    if (typeof updateRecentlyPlayedDisplay === 'function') {
      updateRecentlyPlayedDisplay();
    }
  }
}

// Helper function to adjust color brightness
function adjustColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
  return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

// Setup search functionality
function setupSearch() {
  if (!searchInput) return;
  
  // Search input handler
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    
    if (query.length > 0) {
      clearSearchBtn.style.display = 'flex';
      performSearch(query);
    } else {
      clearSearchBtn.style.display = 'none';
      showBrowseContent();
    }
  });
  
  // Clear search button
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearSearchBtn.style.display = 'none';
      showBrowseContent();
    });
  }
  
  // Enter key to search
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const query = searchInput.value.trim();
      if (query.length > 0) {
        performSearch(query);
      }
    }
  });
}

// Perform genre-specific search
function performGenreSearch(genreName) {
  if (!genreName) {
    showBrowseContent();
    return;
  }
  
  // Filter songs by genre from songsData
  let genreSongs = [];
  if (typeof songsData !== 'undefined') {
    genreSongs = songsData.filter(song => 
      song.genre && song.genre.toLowerCase() === genreName.toLowerCase()
    );
  }
  
  // If no songs found, show some default songs for that genre
  if (genreSongs.length === 0 && typeof songsData !== 'undefined') {
    // Show a mix of songs for popular genres
    const genreMap = {
      'pop': ['Pop'],
      'rock': ['Rock'],
      'dark side': ['Dark Side'],
      'darkside': ['Dark Side'],
      'electronic': ['Electronic'],
      'jazz': ['Jazz'],
      'classical': ['Classical'],
      'country': ['Country'],
      'r&b': ['R&B'],
      'latin': ['Latin'],
      'metal': ['Metal'],
      'indie': ['Indie'],
      'reggae': ['Reggae']
    };
    
    const matchingGenres = genreMap[genreName.toLowerCase()] || [];
    genreSongs = songsData.filter(song => 
      matchingGenres.some(g => song.genre && song.genre.toLowerCase() === g.toLowerCase())
    );
    
    // If still no matches, show random songs
    if (genreSongs.length === 0) {
      genreSongs = songsData.slice(0, 8);
    }
  }
  
  // Display genre-specific songs
  displayGenreResults(genreName, genreSongs);
}

// Perform search
function performSearch(query) {
  if (!query || query.length === 0) {
    showBrowseContent();
    return;
  }
  
  const lowerQuery = query.toLowerCase();
  
  // Check if query matches a genre name
  const genreNames = genres.map(g => g.name.toLowerCase());
  if (genreNames.includes(lowerQuery)) {
    performGenreSearch(query);
    return;
  }
  
  // Search in songsData if available
  let matchedSongs = [];
  if (typeof songsData !== 'undefined') {
    matchedSongs = songsData.filter(song => 
      song.title.toLowerCase().includes(lowerQuery) || 
      song.artist.toLowerCase().includes(lowerQuery) ||
      (song.genre && song.genre.toLowerCase().includes(lowerQuery))
    );
  }
  
  const results = {
    songs: matchedSongs.length > 0 ? matchedSongs.map(song => ({
      name: song.title,
      artist: song.artist,
      cover: song.coverImageUrl,
      type: 'song',
      songData: song
    })) : demoData.songs.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) || 
      item.artist.toLowerCase().includes(lowerQuery)
    ),
    albums: demoData.albums.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) || 
      item.artist.toLowerCase().includes(lowerQuery)
    ),
    artists: demoData.artists.filter(item => 
      item.name.toLowerCase().includes(lowerQuery)
    ),
    playlists: demoData.playlists.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) || 
      item.description.toLowerCase().includes(lowerQuery)
    )
  };
  
  displaySearchResults(results);
}

// Display genre-specific results
function displayGenreResults(genreName, songs) {
  if (!searchResults || !resultsContent) return;
  
  browseContent.style.display = 'none';
  searchResults.style.display = 'block';
  resultsContent.innerHTML = '';
  
  // Update results title
  const resultsTitle = document.querySelector('.results-title');
  if (resultsTitle) {
    resultsTitle.textContent = `${genreName} Songs`;
  }
  
  if (!songs || songs.length === 0) {
    resultsContent.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: rgba(255, 255, 255, 0.6);">
        <p style="font-size: 18px; margin: 0;">No ${genreName} songs found</p>
        <p style="font-size: 14px; margin-top: 8px;">Try another genre</p>
      </div>
    `;
      return;
    }

  // Change grid to songs grid layout
  resultsContent.className = 'songs-grid';
  
  // Display songs using song cards
  songs.forEach(song => {
    const card = createSongCard(song);
    resultsContent.appendChild(card);
  });
}

// Display search results
function displaySearchResults(results) {
  if (!searchResults || !resultsContent) return;
  
  browseContent.style.display = 'none';
  searchResults.style.display = 'block';
  resultsContent.innerHTML = '';
  
  // Reset to results grid layout
  resultsContent.className = 'results-content';
  
  // Update results title
  const resultsTitle = document.querySelector('.results-title');
  if (resultsTitle) {
    resultsTitle.textContent = 'Search results';
  }
  
  // Combine all results
  const allResults = [
    ...results.songs,
    ...results.albums,
    ...results.artists,
    ...results.playlists
  ];
  
  if (allResults.length === 0) {
    resultsContent.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: rgba(255, 255, 255, 0.6);">
        <p style="font-size: 18px; margin: 0;">No results found</p>
        <p style="font-size: 14px; margin-top: 8px;">Try searching for something else</p>
      </div>
    `;
    return;
  }
  
  // Check if we have song data objects
  const hasSongData = allResults.some(item => item.songData);
  
  if (hasSongData) {
    // Use song cards for songs with songData
    resultsContent.className = 'songs-grid';
    allResults.forEach(item => {
      if (item.songData) {
        const card = createSongCard(item.songData);
        resultsContent.appendChild(card);
      } else {
        // Regular result card for other types
        const card = document.createElement('div');
        card.className = 'result-card';
        
        const image = item.cover || item.image || 'assets/images/default-album.jpg';
        const title = item.name;
        const subtitle = item.type === 'artist' ? 'Artist' : (item.artist || item.description || item.type);
        
        card.innerHTML = `
          <img src="${image}" alt="${title}" loading="lazy">
          <h3>${title}</h3>
          <p>${subtitle}</p>
        `;
        
        card.addEventListener('click', () => {
          if (item.type === 'playlist') {
            window.location.href = `playlist.html?name=${encodeURIComponent(item.name)}`;
          } else if (item.type === 'album') {
            console.log('Album clicked:', item.name);
          } else if (item.type === 'artist') {
            console.log('Artist clicked:', item.name);
          }
        });
        
        resultsContent.appendChild(card);
      }
    });
  } else {
    // Regular result cards
    allResults.forEach(item => {
      const card = document.createElement('div');
      card.className = 'result-card';
      
      const image = item.cover || item.image || 'assets/images/default-album.jpg';
      const title = item.name;
      const subtitle = item.type === 'artist' ? 'Artist' : (item.artist || item.description || item.type);
      
      card.innerHTML = `
        <img src="${image}" alt="${title}" loading="lazy">
        <h3>${title}</h3>
        <p>${subtitle}</p>
      `;
      
      card.addEventListener('click', () => {
        if (item.type === 'playlist') {
          window.location.href = `playlist.html?name=${encodeURIComponent(item.name)}`;
        } else if (item.type === 'album') {
          console.log('Album clicked:', item.name);
        } else if (item.type === 'artist') {
          console.log('Artist clicked:', item.name);
        } else {
          // Song - open detail panel
          if (typeof openSongDetailPanel === 'function') {
            openSongDetailPanel({
              name: item.name,
              artist: item.artist,
              cover: image,
              album: item.album || item.name
            });
          }
        }
      });
      
      resultsContent.appendChild(card);
    });
  }
}

// Show browse content
function showBrowseContent() {
  if (browseContent) browseContent.style.display = 'block';
  if (searchResults) searchResults.style.display = 'none';
}
