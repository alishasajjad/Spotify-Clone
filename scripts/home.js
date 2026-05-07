// ===== home.js =====
// Enhanced home page functionality

document.addEventListener('DOMContentLoaded', () => {
  console.log("🏠 Home Page Enhanced");
  
  // Initialize home page sections
  initHomePage();
  
  // Check if user is logged in for personalized content
  checkUserLogin();
});

// Initialize home page sections
function initHomePage() {
  // Load recently played (mock data)
  loadRecentlyPlayed();
  
  // Load made for you recommendations
  loadMadeForYou();
  
  // Load popular albums
  loadPopularAlbums();
  
  // Load browse categories
  loadBrowseCategories();
  
  // Add smooth scrolling for "See all" links
  addSmoothScrolling();
}

// Check if user is logged in and personalize content
function checkUserLogin() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const welcomeMessage = document.getElementById('welcome-message');
  
  if (currentUser && welcomeMessage) {
    welcomeMessage.textContent = `Welcome back, ${currentUser.displayName || currentUser.email}!`;
  }
}

// Load recently played content
function loadRecentlyPlayed() {
  const recentlyPlayedGrid = document.getElementById('recentlyPlayedGrid');
  if (!recentlyPlayedGrid) return;
  
  // Get recently played from localStorage
  const recentlyPlayedFromStorage = JSON.parse(localStorage.getItem('recentlyPlayed') || '[]');
  
  // Use stored songs if available, otherwise use default
  const recentlyPlayed = recentlyPlayedFromStorage.length > 0 
    ? recentlyPlayedFromStorage.slice(0, 6).map(song => ({
        name: song.title || song.name,
        artist: song.artist,
        coverImage: song.coverImage || song.cover || 'assets/images/default-album.jpg',
        album: song.album || song.title || song.name,
        duration: song.duration || '3:00',
        type: song.type || 'song',
        audioFilePath: song.audioFilePath || song.src || ''
      }))
    : [
        {
          name: "Starboy",
          artist: "The Weeknd",
          coverImage: "assets/images/album-after-hours.jpg",
          album: "Starboy",
          duration: "3:50",
          type: "song"
        },
        {
          name: "Blinding Lights",
          artist: "The Weeknd",
          coverImage: "assets/images/album-after-hours.jpg",
          album: "After Hours",
          duration: "3:20",
          type: "song"
        },
        {
          name: "Peaches",
          artist: "Justin Bieber",
          coverImage: "assets/images/album-justice.jpg",
          album: "Justice",
          duration: "3:18",
          type: "song"
        },
        {
          name: "Good 4 U",
          artist: "Olivia Rodrigo",
          coverImage: "assets/images/album-sour.jpg",
          album: "SOUR",
          duration: "2:58",
          type: "song"
        },
        {
          name: "Levitating",
          artist: "Dua Lipa",
          coverImage: "assets/images/album-future-nostalgia.jpg",
          album: "Future Nostalgia",
          duration: "3:23",
          type: "song"
        },
        {
          name: "Stay",
          artist: "The Kid LAROI",
          coverImage: "assets/images/album-fk-love.jpg",
          album: "F*CK LOVE 3",
          duration: "2:21",
          type: "song"
        }
      ];
  
  recentlyPlayedGrid.innerHTML = '';
  recentlyPlayed.forEach(item => {
    const card = createMusicCard(item);
    // Add click event to play the song
    if (item.audioFilePath) {
      card.addEventListener('click', () => {
        playSong({
          title: item.name,
          artist: item.artist,
          cover: item.coverImage,
          src: item.audioFilePath
        });
      });
      card.style.cursor = 'pointer';
    }
    recentlyPlayedGrid.appendChild(card);
  });
}

// Update recently played display (called from other pages)
function updateRecentlyPlayedDisplay() {
  if (document.getElementById('recentlyPlayedGrid')) {
    loadRecentlyPlayed();
  }
}

// Export for global access
window.updateRecentlyPlayedDisplay = updateRecentlyPlayedDisplay;

// Load made for you recommendations
function loadMadeForYou() {
  const madeForYouGrid = document.getElementById('madeForYouGrid');
  if (!madeForYouGrid) return;
  
  const madeForYou = [
    {
      name: "Daily Mix 1",
      description: "The Weeknd, Dua Lipa and more",
      coverImage: "assets/images/playlist-daily-mix.jpg",
      type: "playlist"
    },
    {
      name: "Discover Weekly",
      description: "Your weekly mixtape",
      coverImage: "assets/images/playlist-discover.jpg",
      type: "playlist"
    },
    {
      name: "Release Radar",
      description: "New music from artists you follow",
      coverImage: "assets/images/playlist-release.jpg",
      type: "playlist"
    },
    {
      name: "Your Top Songs 2024",
      description: "Your most played tracks",
      coverImage: "assets/images/playlist-top-songs.jpg",
      type: "playlist"
    },
    {
      name: "Chill Mix",
      description: "The Weeknd, Billie Eilish and more",
      coverImage: "assets/images/playlist-chill-mix.jpg",
      type: "playlist"
    },
    {
      name: "Pop Mix",
      description: "Dua Lipa, Olivia Rodrigo and more",
      coverImage: "assets/images/playlist-pop-mix.jpg",
      type: "playlist"
    }
  ];
  
  madeForYou.forEach(item => {
    const card = createMusicCard(item);
    madeForYouGrid.appendChild(card);
  });
}

// Load popular albums
function loadPopularAlbums() {
  const albumsGrid = document.getElementById('albumsGrid');
  if (!albumsGrid) return;
  
  const popularAlbums = [
    {
      name: "After Hours",
      artist: "The Weeknd",
      coverImage: "assets/images/album-after-hours.jpg",
      type: "album"
    },
    {
      name: "Justice",
      artist: "Justin Bieber",
      coverImage: "assets/images/album-justice.jpg",
      type: "album"
    },
    {
      name: "Future Nostalgia",
      artist: "Dua Lipa",
      coverImage: "assets/images/album-future-nostalgia.jpg",
      type: "album"
    },
    {
      name: "SOUR",
      artist: "Olivia Rodrigo",
      coverImage: "assets/images/album-sour.jpg",
      type: "album"
    },
    {
      name: "F*CK LOVE",
      artist: "The Kid LAROI",
      coverImage: "assets/images/album-fk-love.jpg",
      type: "album"
    },
    {
      name: "Positions",
      artist: "Ariana Grande",
      coverImage: "assets/images/album-positions.jpg",
      type: "album"
    }
  ];
  
  popularAlbums.forEach(album => {
    const card = createMusicCard(album);
    albumsGrid.appendChild(card);
  });
}

// Load browse categories
function loadBrowseCategories() {
  const categoryGrid = document.getElementById('categoryGrid');
  if (!categoryGrid) return;
  
  const categories = [
    {
      name: "Pop",
      coverImage: "assets/images/category-pop.jpg",
      color: "#FF6B6B"
    },
    {
      name: "Rock",
      coverImage: "assets/images/category-rock.jpg",
      color: "#4ECDC4"
    },
    {
      name: "Electronic",
      coverImage: "assets/images/category-electronic.jpg",
      color: "#45B7D1"
    },
    {
      name: "Dark",
      coverImage: "assets/images/category-dark1.jpg",
      color: "#2C3E50"
    },
    {
      name: "Dark Side",
      coverImage: "assets/images/category-dark.jpg",
      color: "#F39C12"
    },
    {
      name: "Jazz",
      coverImage: "assets/images/category-jazz.jpg",
      color: "#E74C3C"
    },
    {
      name: "Classical",
      coverImage: "assets/images/category-classical.jpg",
      color: "#9B59B6"
    },
    {
      name: "Country",
      coverImage: "assets/images/category-country.jpg",
      color: "#27AE60"
    }
  ];
  
  categories.forEach(category => {
    const card = createCategoryCard(category);
    categoryGrid.appendChild(card);
  });
}

// Create music card (song, playlist, album)
function createMusicCard(item) {
  const card = document.createElement('div');
  card.className = 'card music-card';
  
  // Add data attributes for song detail panel
  card.dataset.name = item.name;
  card.dataset.artist = item.artist || '';
  card.dataset.cover = item.coverImage || 'assets/images/default-album.jpg';
  card.dataset.album = item.album || item.name;
  card.dataset.duration = item.duration || '';
  card.dataset.type = item.type || 'song';
  
  card.innerHTML = `
    <div class="album-art">
      <img src="${item.coverImage || 'assets/images/default-album.jpg'}" alt="${item.name}" loading="lazy">
      <div class="play-overlay">
        <button class="play-btn-large" data-item="${item.name}" onclick="playMusic('${item.name}', '${item.artist}', '${item.coverImage}'); event.stopPropagation();">
          <span class="play-icon">▶</span>
        </button>
      </div>
    </div>
    <h3>${item.name}</h3>
    <p>${item.artist || item.description || item.type}</p>
  `;
  
  // Add click event for song detail panel (only for songs)
  if (item.type === 'song') {
    card.addEventListener('click', (e) => {
      // Don't open panel if clicking on play button
      if (!e.target.closest('.play-btn-large')) {
        const songData = {
          name: item.name,
          artist: item.artist,
          cover: item.coverImage || 'assets/images/default-album.jpg',
          albumArt: item.coverImage || 'assets/images/default-album.jpg',
          artistImage: item.artistImage || item.coverImage || 'assets/images/default-album.jpg',
          album: item.album || item.name,
          duration: item.duration || '',
          url: item.url || ''
        };
        openSongDetailPanel(songData);
      }
    });
  } else {
    // For playlists and albums, keep original navigation behavior
    card.addEventListener('click', () => {
      if (item.type === 'playlist') {
        window.location.href = `playlist.html?name=${encodeURIComponent(item.name)}`;
      } else if (item.type === 'album') {
        window.location.href = `browse.html?album=${encodeURIComponent(item.name)}`;
      }
    });
  }
  
  return card;
}

// Create category card
function createCategoryCard(category) {
  const card = document.createElement('div');
  card.className = 'category-card';
  card.style.backgroundColor = category.color;
  
  card.innerHTML = `
    <h3>${category.name}</h3>
    <div class="category-image">
      <img src="${category.coverImage || 'assets/images/default-album.jpg'}" alt="${category.name}">
    </div>
  `;
  
  card.addEventListener('click', () => {
    window.location.href = `browse.html?category=${encodeURIComponent(category.name)}`;
  });
  
  return card;
}

// Play song function
function playSong(song) {
  // This would integrate with your existing music player
  console.log(`Playing: ${song.name} by ${song.artist}`);
  
  // Update music player bar if it exists
  const nowPlayingTitle = document.querySelector('.now-playing-title');
  const nowPlayingArtist = document.querySelector('.now-playing-artist');
  const nowPlayingImage = document.querySelector('.now-playing-image');
  
  if (nowPlayingTitle) nowPlayingTitle.textContent = song.name;
  if (nowPlayingArtist) nowPlayingArtist.textContent = song.artist;
  if (nowPlayingImage) nowPlayingImage.src = song.coverImage;
  
  // Start playing (you might want to integrate with your existing play function)
  const playButton = document.querySelector('.play-button i');
  if (playButton && playButton.classList.contains('fa-play')) {
    playButton.click(); // Trigger play if paused
  }
}

// Add smooth scrolling for "See all" links
function addSmoothScrolling() {
  const seeAllLinks = document.querySelectorAll('.see-all-link');
  seeAllLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href && href !== '#') {
        window.location.href = href;
      }
    });
  });
}

// Add fade-in animation for cards
function addCardAnimations() {
  const cards = document.querySelectorAll('.card, .category-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
}

// Initialize animations when page loads
setTimeout(addCardAnimations, 100);