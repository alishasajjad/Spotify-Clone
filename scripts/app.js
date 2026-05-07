// ===== app.js =====
// Common app setup and navigation control

document.addEventListener("DOMContentLoaded", () => {
  console.log("🎧 Spotify Clone Loaded");

  // Initialize page transition effect
  document.body.classList.add('page-transition');
  
  // Highlight active page link in navbar
  setActiveNavLink();
  
  // Initialize music player
  initMusicPlayer();
  
  // Add hover effects to cards
  initCardHoverEffects();
  
  // Check for auto-login if on login page
  if (window.location.pathname.includes('login.html')) {
    checkAutoLogin();
  }
  
  // Initialize animated background
  initAnimatedBackground();
});

// Set active navigation link based on current page
function setActiveNavLink() {
  const currentPage = window.location.pathname;
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (currentPage.includes(href) && href !== '#') {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Initialize music player functionality
function initMusicPlayer() {
  const musicPlayerBar = document.getElementById('music-player-bar');
  if (!musicPlayerBar) return;
  
  // Show music player bar
  setTimeout(() => {
    musicPlayerBar.classList.add('active');
  }, 500);
  
  // Play button functionality
  const playButton = document.querySelector('.play-button');
  if (playButton) {
    playButton.addEventListener('click', togglePlayState);
  }
  
  // Initialize progress bar
  initProgressBar();
  
  // Initialize volume slider
  initVolumeControl();
  
  // Add event listeners to control buttons
  initPlayerControls();
}

// Toggle play/pause state
function togglePlayState() {
  const playButton = document.querySelector('.play-button i');
  if (!playButton) return;
  
  if (playButton.classList.contains('fa-play')) {
    playButton.classList.remove('fa-play');
    playButton.classList.add('fa-pause');
    startProgressAnimation();
  } else {
    playButton.classList.remove('fa-pause');
    playButton.classList.add('fa-play');
    pauseProgressAnimation();
  }
}

// Initialize progress bar
function initProgressBar() {
  const progressBar = document.querySelector('.progress-bar');
  const progress = document.querySelector('.progress');
  
  if (!progressBar || !progress) return;
  
  progressBar.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    
    // Update progress bar
    progress.style.width = (percentage * 100) + '%';
    
    // Update current time
    const totalTime = 180; // 3 minutes in seconds
    const currentTime = Math.floor(totalTime * percentage);
    updateTimeDisplay(currentTime, totalTime);
    
    // If paused, switch to play
    const playButton = document.querySelector('.play-button i');
    if (playButton && playButton.classList.contains('fa-play')) {
      togglePlayState();
    }
  });
}

// Initialize volume control
function initVolumeControl() {
  const volumeSlider = document.querySelector('.volume-slider');
  const volumeLevel = document.querySelector('.volume-level');
  const volumeIcon = document.querySelector('.volume-icon i');
  
  if (!volumeSlider || !volumeLevel || !volumeIcon) return;
  
  // Set initial volume
  let volume = 0.5;
  volumeLevel.style.width = (volume * 100) + '%';
  
  // Update volume on click
  volumeSlider.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    volume = x / rect.width;
    
    // Clamp volume between 0 and 1
    volume = Math.max(0, Math.min(1, volume));
    volumeLevel.style.width = (volume * 100) + '%';
    
    // Update volume icon
    updateVolumeIcon(volume);
  });
  
  // Volume icon click to mute/unmute
  volumeIcon.addEventListener('click', function() {
    if (volume > 0) {
      // Store current volume and mute
      volumeIcon.dataset.prevVolume = volume;
      volume = 0;
      volumeLevel.style.width = '0%';
      updateVolumeIcon(0);
    } else {
      // Restore previous volume
      volume = parseFloat(volumeIcon.dataset.prevVolume || 0.5);
      volumeLevel.style.width = (volume * 100) + '%';
      updateVolumeIcon(volume);
    }
  });
}

// Update volume icon based on volume level
function updateVolumeIcon(volume) {
  const volumeIcon = document.querySelector('.volume-icon i');
  if (!volumeIcon) return;
  
  // Remove all volume classes
  volumeIcon.classList.remove('fa-volume-xmark', 'fa-volume-low', 'fa-volume-high');
  
  // Add appropriate volume class
  if (volume === 0) {
    volumeIcon.classList.add('fa-volume-xmark');
  } else if (volume < 0.5) {
    volumeIcon.classList.add('fa-volume-low');
  } else {
    volumeIcon.classList.add('fa-volume-high');
  }
}

// Initialize player controls
function initPlayerControls() {
  const prevButton = document.querySelector('.control-button.prev');
  const nextButton = document.querySelector('.control-button.next');
  
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      // Reset progress and update now playing info
      resetProgress();
      updateNowPlaying('Previous Song', 'Previous Artist', 'assets/images/album-placeholder.jpg');
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      // Reset progress and update now playing info
      resetProgress();
      updateNowPlaying('Next Song', 'Next Artist', 'assets/images/album-placeholder.jpg');
    });
  }
}

// Initialize card hover effects
function initCardHoverEffects() {
  const cards = document.querySelectorAll('.card');
  
  cards.forEach(card => {
    // Add play button overlay on hover
    const albumArt = card.querySelector('.album-art');
    if (albumArt && !albumArt.querySelector('.play-overlay')) {
      const playOverlay = document.createElement('div');
      playOverlay.className = 'play-overlay';
      
      const playIcon = document.createElement('div');
      playIcon.className = 'play-icon';
      playIcon.innerHTML = '<i class="fas fa-play"></i>';
      
      playOverlay.appendChild(playIcon);
      albumArt.appendChild(playOverlay);
      
      // Add click event to play the song
      playOverlay.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Get song data from card
        const songTitle = card.querySelector('.card-title')?.textContent || 'Unknown Song';
        const artistName = card.querySelector('.card-artist')?.textContent || 'Unknown Artist';
        const coverUrl = albumArt.querySelector('img')?.src || '';
        
        // Play the song
        playSong(songTitle, artistName, coverUrl);
      });
    }
  });
}

// Play a song and update the music player
function playSong(title, artist, coverUrl) {
  updateNowPlaying(title, artist, coverUrl);
  
  // Show play button as pause
  const playButton = document.querySelector('.play-button i');
  if (playButton) {
    playButton.classList.remove('fa-play');
    playButton.classList.add('fa-pause');
  }
  
  // Reset and start progress
  resetProgress();
  startProgressAnimation();
}

// Update now playing information
function updateNowPlaying(title, artist, coverUrl) {
  const musicPlayerBar = document.getElementById('music-player-bar');
  const nowPlayingImg = document.querySelector('.now-playing-img');
  const nowPlayingTitle = document.querySelector('.now-playing-title');
  const nowPlayingArtist = document.querySelector('.now-playing-artist');
  
  if (!musicPlayerBar || !nowPlayingImg || !nowPlayingTitle || !nowPlayingArtist) return;
  
  // Update now playing information
  nowPlayingImg.src = coverUrl;
  nowPlayingTitle.textContent = title;
  nowPlayingArtist.textContent = artist;
  
  // Show music player bar if not already visible
  musicPlayerBar.classList.add('active');
}

// Reset progress bar
function resetProgress() {
  const progress = document.querySelector('.progress');
  if (!progress) return;
  
  // Clear any existing interval
  if (window.progressInterval) {
    clearInterval(window.progressInterval);
  }
  
  // Reset progress
  progress.style.width = '0%';
  
  // Reset time display
  updateTimeDisplay(0, 180);
}

// Start progress animation
function startProgressAnimation() {
  // Clear any existing interval
  if (window.progressInterval) {
    clearInterval(window.progressInterval);
  }
  
  const progress = document.querySelector('.progress');
  if (!progress) return;
  
  // Get current width percentage
  const currentWidth = parseFloat(progress.style.width || '0');
  let currentTime = Math.floor((currentWidth / 100) * 180); // 3 minutes in seconds
  const totalTime = 180;
  
  // Start progress animation
  window.progressInterval = setInterval(() => {
    currentTime += 1;
    const percentage = (currentTime / totalTime) * 100;
    
    // Update progress bar
    progress.style.width = percentage + '%';
    
    // Update time display
    updateTimeDisplay(currentTime, totalTime);
    
    // Stop when reaching the end
    if (currentTime >= totalTime) {
      clearInterval(window.progressInterval);
      
      // Reset to play icon
      const playButton = document.querySelector('.play-button i');
      if (playButton) {
        playButton.classList.remove('fa-pause');
        playButton.classList.add('fa-play');
      }
    }
  }, 1000);
}

// Pause progress animation
function pauseProgressAnimation() {
  if (window.progressInterval) {
    clearInterval(window.progressInterval);
  }
}

// Update time display
function updateTimeDisplay(currentTime, totalTime) {
  const currentTimeEl = document.querySelector('.current-time');
  const totalTimeEl = document.querySelector('.total-time');
  
  if (!currentTimeEl || !totalTimeEl) return;
  
  currentTimeEl.textContent = formatTime(currentTime);
  totalTimeEl.textContent = formatTime(totalTime);
}

// Format seconds to MM:SS
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Check for auto-login (for login page)
function checkAutoLogin() {
  const rememberMe = localStorage.getItem('rememberMe');
  const savedEmail = localStorage.getItem('userEmail');
  
  if (rememberMe === 'true' && savedEmail) {
    // Redirect to home page
    window.location.href = 'home.html';
  }
}

// Initialize animated background
function initAnimatedBackground() {
  // Check if animated background already exists
  if (!document.querySelector('.animated-gradient-bg')) {
    const animatedBg = document.createElement('div');
    animatedBg.className = 'animated-gradient-bg';
    document.body.appendChild(animatedBg);
  }
}
