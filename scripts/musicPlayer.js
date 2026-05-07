// ===== musicPlayer.js =====
// Handles song playback controls

let currentSong = null;
let isPlaying = false;
let currentArtist = "Artist";
let currentTitle = "Song Title";
let currentAlbumArt = "assets/images/default-album.jpg";
let currentVolume = 0.7;
let currentProgress = 0;
let songDuration = 180; // Default duration in seconds
const audio = new Audio();

// Initialize player when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Skip initialization on profile page
  if (window.location.pathname.includes('profile.html')) {
    return;
  }
  initMusicPlayer();
});

function initMusicPlayer() {
  // Skip on profile page
  if (window.location.pathname.includes('profile.html')) {
    return;
  }
  
  // Create player bar if it doesn't exist
  if (!document.getElementById('music-player-bar')) {
    createPlayerBar();
  }
  
  // Set initial volume
  audio.volume = currentVolume;
  
  // Add audio event listeners
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('ended', () => {
    nextSong();
  });
  
  // Update volume display
  updateVolumeDisplay();
  
  // Show player bar with animation after a short delay
  setTimeout(() => {
    const playerBar = document.getElementById('music-player-bar');
    if (playerBar) {
      playerBar.classList.add('active');
      
      // Double-check play button visibility
      const playBtn = playerBar.querySelector('#play-button');
      if (playBtn) {
        playBtn.style.display = 'flex';
        playBtn.style.visibility = 'visible';
        playBtn.style.opacity = '1';
        playBtn.style.background = '#ffffff';
        playBtn.style.color = '#000000';
        
        const playIcon = playBtn.querySelector('#play-icon');
        if (playIcon) {
          playIcon.style.display = 'block';
          playIcon.style.visibility = 'visible';
        }
      }
    }
  }, 500);
}

function createPlayerBar() {
  // Check if player bar already exists
  let playerBar = document.getElementById('music-player-bar');
  if (playerBar) {
    return; // Player bar already exists
  }
  
  playerBar = document.createElement('div');
  playerBar.id = 'music-player-bar';
  
  playerBar.innerHTML = `
    <div class="now-playing">
      <img src="${currentAlbumArt}" alt="Album Art" class="now-playing-img">
      <div class="now-playing-info">
        <div class="now-playing-title">${currentTitle}</div>
        <div class="now-playing-artist">${currentArtist}</div>
      </div>
    </div>
    
    <div class="player-controls">
      <div class="control-buttons">
        <button class="control-button prev" id="prev-button" aria-label="Previous">
          <i class="fas fa-backward-step"></i>
        </button>
        <button class="play-button" id="play-button" aria-label="Play/Pause">
          <i class="fas fa-play" id="play-icon"></i>
        </button>
        <button class="control-button next" id="next-button" aria-label="Next">
          <i class="fas fa-forward-step"></i>
        </button>
      </div>
      
      <div class="progress-container">
        <div class="progress-time current-time" id="current-time">0:00</div>
        <div class="progress-bar" id="progress-bar">
          <div class="progress" id="progress"></div>
        </div>
        <div class="progress-time total-time" id="duration">3:00</div>
      </div>
    </div>
    
    <div class="volume-container">
      <div class="volume-icon" id="volume-icon">
        <i class="fas fa-volume-high"></i>
      </div>
      <div class="volume-slider" id="volume-slider">
        <div class="volume-level" id="volume-level"></div>
      </div>
    </div>
  `;
  
  // Append to body
  document.body.appendChild(playerBar);
  
  // Force play button visibility with inline styles
  const playBtn = document.getElementById('play-button');
  if (playBtn) {
    playBtn.style.cssText = `
      display: flex !important;
      visibility: visible !important;
      opacity: 1 !important;
      width: 40px !important;
      height: 40px !important;
      background: #ffffff !important;
      color: #000000 !important;
      border-radius: 50% !important;
      border: none !important;
      cursor: pointer !important;
      align-items: center !important;
      justify-content: center !important;
      z-index: 1001 !important;
      position: relative !important;
    `;
    
    const playIcon = playBtn.querySelector('#play-icon');
    if (playIcon) {
      playIcon.style.cssText = `
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        font-size: 16px !important;
        color: inherit !important;
      `;
    }
  }
  
  // Add event listeners to player controls
  const playButton = document.getElementById('play-button');
  const nextButton = document.getElementById('next-button');
  const prevButton = document.getElementById('prev-button');
  const volumeIcon = document.getElementById('volume-icon');
  
  if (playButton) {
    playButton.addEventListener('click', togglePlay);
  }
  if (nextButton) {
    nextButton.addEventListener('click', nextSong);
  }
  if (prevButton) {
    prevButton.addEventListener('click', prevSong);
  }
  if (volumeIcon) {
    volumeIcon.addEventListener('click', toggleMute);
  }
  
  // Initialize play button state
  updatePlayButton();
  
  // Progress bar click event
  document.getElementById('progress-bar').addEventListener('click', (e) => {
    const progressBar = document.getElementById('progress-bar');
    const percent = e.offsetX / progressBar.offsetWidth;
    audio.currentTime = percent * songDuration;
    updateProgress();
  });
  
  // Volume slider click event
  document.getElementById('volume-slider').addEventListener('click', (e) => {
    const volumeSlider = document.getElementById('volume-slider');
    const percent = e.offsetX / volumeSlider.offsetWidth;
    setVolume(percent);
  });
}

// Play a specific song
function playSong(songData) {
  if (!songData) return;
  
  // Update current song info
  currentSong = songData.src || '';
  currentTitle = songData.title || 'Unknown Song';
  currentArtist = songData.artist || 'Unknown Artist';
  currentAlbumArt = songData.cover || 'assets/images/default-album.jpg';
  
  // Add to recently played
  addToRecentlyPlayed(songData);
  
  // Update player display
  updatePlayerDisplay();
  
  // Set audio source and play
  audio.src = currentSong;
  audio.play()
    .then(() => {
      isPlaying = true;
      updatePlayButton();
    })
    .catch(error => {
      console.error('Error playing audio:', error);
      // Simulate playback for demo purposes
      simulatePlayback();
    });
}

// Play song from DOM element with data attributes
function playSongFromElement(element) {
  if (!element) return;
  
  const songData = {
    src: element.dataset.song || '',
    title: element.dataset.title || element.dataset.name || 'Unknown Song',
    artist: element.dataset.artist || 'Unknown Artist',
    cover: element.dataset.cover || element.querySelector('img')?.src || 'assets/images/default-album.jpg'
  };
  
  playSong(songData);
  
  // Show player with animation
  const playerBar = document.getElementById('music-player-bar');
  if (playerBar && !playerBar.classList.contains('active')) {
    playerBar.classList.add('active');
  }
}

// Toggle play/pause
function togglePlay() {
  if (!currentSong) {
    // If no song is selected, play a default song
    playSong({
      title: 'Sample Track',
      artist: 'Spotify Clone',
      cover: 'assets/images/default-album.jpg'
    });
    return;
  }
  
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
  } else {
    audio.play()
      .catch(() => {
        // Simulate playback for demo purposes
        simulatePlayback();
      });
    isPlaying = true;
  }
  
  updatePlayButton();
}

// Simulate playback for demo purposes
function simulatePlayback() {
  isPlaying = true;
  updatePlayButton();
  
  // Clear any existing interval
  if (window.progressInterval) {
    clearInterval(window.progressInterval);
  }
  
  // Start progress animation
  let simulatedTime = 0;
  window.progressInterval = setInterval(() => {
    simulatedTime += 1;
    currentProgress = simulatedTime / songDuration;
    
    // Update progress display
    updateProgressDisplay();
    
    // Stop when reaching the end
    if (simulatedTime >= songDuration) {
      clearInterval(window.progressInterval);
      nextSong();
    }
  }, 1000);
}

// Update play button icon
function updatePlayButton() {
  const playIcon = document.getElementById('play-icon');
  const playButton = document.getElementById('play-button');
  
  if (!playIcon || !playButton) {
    console.warn('Play button elements not found');
    return;
  }
  
  // Ensure button is visible
  playButton.style.display = 'flex';
  playButton.style.visibility = 'visible';
  playButton.style.opacity = '1';
  
  if (isPlaying) {
    playIcon.classList.remove('fa-play');
    playIcon.classList.add('fa-pause');
  } else {
    playIcon.classList.remove('fa-pause');
    playIcon.classList.add('fa-play');
  }
}

// Update progress bar
function updateProgress() {
  if (!audio.duration) return;
  
  currentProgress = audio.currentTime / audio.duration;
  updateProgressDisplay();
}

// Update progress display
function updateProgressDisplay() {
  const progressBar = document.getElementById('progress');
  const currentTimeDisplay = document.getElementById('current-time');
  const durationDisplay = document.getElementById('duration');
  
  if (progressBar) {
    progressBar.style.width = `${currentProgress * 100}%`;
  }
  
  if (currentTimeDisplay) {
    const currentSeconds = Math.floor(currentProgress * songDuration);
    currentTimeDisplay.textContent = formatTime(currentSeconds);
  }
  
  if (durationDisplay) {
    durationDisplay.textContent = formatTime(songDuration);
  }
}

// Format time in MM:SS
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Add song to recently played
function addToRecentlyPlayed(songData) {
  if (!songData) return;
  
  // Get existing recently played songs
  let recentlyPlayed = JSON.parse(localStorage.getItem('recentlyPlayed') || '[]');
  
  // Create song object with required fields
  const songObj = {
    title: songData.title || songData.name || 'Unknown Song',
    artist: songData.artist || 'Unknown Artist',
    coverImage: songData.cover || songData.coverImage || 'assets/images/default-album.jpg',
    audioFilePath: songData.src || songData.audioFilePath || '',
    timestamp: Date.now()
  };
  
  // Remove duplicate if exists (based on title and artist)
  recentlyPlayed = recentlyPlayed.filter(song => 
    !(song.title === songObj.title && song.artist === songObj.artist)
  );
  
  // Add to beginning (most recent)
  recentlyPlayed.unshift(songObj);
  
  // Limit to 20 songs maximum
  if (recentlyPlayed.length > 20) {
    recentlyPlayed = recentlyPlayed.slice(0, 20);
  }
  
  // Save to localStorage
  localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
  
  // Update home page display if it exists
  if (window.updateRecentlyPlayedDisplay) {
    window.updateRecentlyPlayedDisplay();
  }
}

// Set volume
function setVolume(volumeLevel) {
  // Clamp volume between 0 and 1
  currentVolume = Math.max(0, Math.min(1, volumeLevel));
  audio.volume = currentVolume;
  
  updateVolumeDisplay();
  updateVolumeIcon();
}

// Toggle mute
function toggleMute() {
  if (audio.volume > 0) {
    // Store current volume and mute
    audio.dataset.prevVolume = audio.volume;
    setVolume(0);
  } else {
    // Restore previous volume
    setVolume(parseFloat(audio.dataset.prevVolume || 0.7));
  }
}

// Update volume display
function updateVolumeDisplay() {
  const volumeLevel = document.getElementById('volume-level');
  if (volumeLevel) {
    volumeLevel.style.width = `${currentVolume * 100}%`;
  }
}

// Update volume icon based on volume level
function updateVolumeIcon() {
  const volumeIcon = document.querySelector('.volume-icon i');
  if (!volumeIcon) return;
  
  // Remove all volume classes
  volumeIcon.classList.remove('fa-volume-xmark', 'fa-volume-low', 'fa-volume-high');
  
  // Add appropriate volume class
  if (currentVolume === 0) {
    volumeIcon.classList.add('fa-volume-xmark');
  } else if (currentVolume < 0.5) {
    volumeIcon.classList.add('fa-volume-low');
  } else {
    volumeIcon.classList.add('fa-volume-high');
  }
}

// Update player display with current song info
function updatePlayerDisplay() {
  const nowPlayingImg = document.querySelector('.now-playing-img');
  const nowPlayingTitle = document.querySelector('.now-playing-title');
  const nowPlayingArtist = document.querySelector('.now-playing-artist');
  
  if (nowPlayingImg) nowPlayingImg.src = currentAlbumArt;
  if (nowPlayingTitle) nowPlayingTitle.textContent = currentTitle;
  if (nowPlayingArtist) nowPlayingArtist.textContent = currentArtist;
}

// Play next song (demo functionality)
function nextSong() {
  // For demo purposes, just update the song info
  const nextSongs = [
    { title: 'Blinding Lights', artist: 'The Weeknd', cover: 'assets/images/default-album.jpg' },
    { title: 'Save Your Tears', artist: 'The Weeknd', cover: 'assets/images/default-album.jpg' },
    { title: 'Starboy', artist: 'The Weeknd', cover: 'assets/images/default-album.jpg' }
  ];
  
  const randomSong = nextSongs[Math.floor(Math.random() * nextSongs.length)];
  playSong(randomSong);
}

// Play previous song (demo functionality)
function prevSong() {
  // For demo purposes, just update the song info
  const prevSongs = [
    { title: 'Peaches', artist: 'Justin Bieber', cover: 'assets/images/default-album.jpg' },
    { title: 'Stay', artist: 'The Kid LAROI, Justin Bieber', cover: 'assets/images/default-album.jpg' },
    { title: 'Mood', artist: '24kGoldn', cover: 'assets/images/default-album.jpg' }
  ];
  
  const randomSong = prevSongs[Math.floor(Math.random() * prevSongs.length)];
  playSong(randomSong);
}

// Add global function to play songs from anywhere in the app
window.playSpotifySong = function(songData) {
  playSong(songData);
};
    setVolume(percent);
  
  // Show player bar with animation
  setTimeout(() => {
    playerBar.classList.add('active');
  }, 500);


function playSong(songURL, songName, artist = "Artist", albumArt = "assets/images/default-album.jpg") {
  // Update player bar info
  currentTitle = songName;
  currentArtist = artist;
  currentAlbumArt = albumArt;
  
  updatePlayerInfo();
  
  // Handle audio
  if (currentSong !== songURL) {
    audio.src = songURL;
    currentSong = songURL;
    
    // Reset progress
    currentProgress = 0;
    updateProgress();
  }
  
  togglePlay();
  
  // Show player bar if it's hidden
  const playerBar = document.getElementById('music-player-bar');
  if (playerBar) {
    playerBar.classList.add('active');
  }
}

// Export for global access
window.playSong = playSong;

function togglePlay() {
  if (!isPlaying) {
    audio.play()
      .then(() => {
        isPlaying = true;
        document.getElementById('play-icon').textContent = "⏸️";
        console.log(`🎶 Playing: ${currentTitle}`);
      })
      .catch(error => {
        console.error("Playback failed:", error);
      });
  } else {
    audio.pause();
    isPlaying = false;
    document.getElementById('play-icon').textContent = "▶️";
    console.log(`⏸️ Paused: ${currentTitle}`);
  }
}

function nextSong() {
  // Placeholder for next song functionality
  console.log("Next song");
  // In a real app, you would load the next song in the playlist
}

function prevSong() {
  // Placeholder for previous song functionality
  console.log("Previous song");
  // In a real app, you would load the previous song in the playlist
}

function updateProgress() {
  const progress = document.getElementById('progress');
  const currentTimeDisplay = document.getElementById('current-time');
  
  if (audio.duration) {
    songDuration = audio.duration;
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = percent + '%';
    currentProgress = audio.currentTime;
    
    // Update time display
    currentTimeDisplay.textContent = formatTime(audio.currentTime);
    document.getElementById('duration').textContent = formatTime(audio.duration);
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function setVolume(volumeLevel) {
  currentVolume = Math.max(0, Math.min(1, volumeLevel));
  audio.volume = currentVolume;
  updateVolumeDisplay();
}

function toggleMute() {
  if (audio.volume > 0) {
    audio.volume = 0;
    document.getElementById('volume-icon').textContent = "🔇";
  } else {
    audio.volume = currentVolume;
    updateVolumeDisplay();
  }
}

function updateVolumeDisplay() {
  const volumeLevel = document.getElementById('volume-level');
  volumeLevel.style.width = (audio.volume * 100) + '%';
  
  // Update volume icon
  const volumeIcon = document.getElementById('volume-icon');
  if (audio.volume > 0.5) {
    volumeIcon.textContent = "🔊";
  } else if (audio.volume > 0) {
    volumeIcon.textContent = "🔉";
  } else {
    volumeIcon.textContent = "🔇";
  }
}

function updatePlayerInfo() {
  document.querySelector('.now-playing-title').textContent = currentTitle;
  document.querySelector('.now-playing-artist').textContent = currentArtist;
  document.querySelector('.now-playing-img').src = currentAlbumArt;
}

// Example usage:
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("play-btn")) {
    const song = e.target.dataset.song;
    const name = e.target.dataset.name;
    const artist = e.target.dataset.artist || "Artist";
    const albumArt = e.target.dataset.albumArt || "assets/images/default-album.jpg";
    playSong(song, name, artist, albumArt);
  }
});
