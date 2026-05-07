# 🎵 Spotify Clone

A modern **Spotify-inspired multi-page music streaming web application** built using **HTML, CSS, and JavaScript**.
This project recreates the core music streaming experience with features like authentication, playlists, music playback, personal libraries, and persistent browser-based storage — all wrapped inside a clean and responsive frontend architecture.

---

# ✨ Features

## 🔐 Authentication System

* User Signup & Login flow
* Password validation
* Remember Me functionality
* Editable user profile management

---

## 🏠 Dynamic Home Experience

Curated sections inspired by Spotify UI:

* 🎧 Recently Played
* 💡 Made For You
* 🔥 Featured Playlists
* 💿 Popular Albums
* 🎼 Browse by Category

---

## 🔎 Browse & Search Functionality

Interactive discovery experience including:

* Genre-based browsing
* Trending songs section
* Live search support for:

  * Songs
  * Artists
  * Albums
  * Playlists
  * Genres

---

## 🎵 Custom Music Player

Fully interactive player bar with:

* ▶️ Play / Pause
* ⏮️ Previous Track
* ⏭️ Next Track
* ⏱️ Seek & Progress Controls
* 🔊 Volume Slider
* 🔇 Mute Toggle
* 🎶 Dynamic Now-Playing Metadata

---

## ❤️ User Interactions

* Like / Unlike songs
* Save albums to library
* Follow artists
* Playlist interactions
* Song detail action panel

---

## 📚 Personal Library System

Dedicated pages for:

* 🎼 Playlists
* ❤️ Liked Songs
* 💿 Saved Albums
* 🎤 Followed Artists

---

## 💾 Persistent Application State

Using browser `localStorage` for:

* User sessions
* Authentication state
* Recently played tracks
* Liked songs
* Saved albums/artists
* User preferences

---

## 📱 Responsive UI/UX

* Spotify-inspired modern interface
* Mobile-friendly responsive layout
* Smooth interactions & clean visual hierarchy

---

# 🛠️ Tech Stack

## Frontend

* **HTML5** → Semantic page structure
* **CSS3** → Styling, layouts, animations & responsiveness
* **Vanilla JavaScript (ES6)** → Application logic & DOM manipulation

---

## 🌐 Web APIs

* `localStorage` → Client-side persistence
* `Audio API` → Music playback controls

---

## 🎨 External Assets & Libraries

* Font Awesome Icons
* Google Fonts — *Poppins*

---

# 📂 Project Structure

```text
Spotify_Clone/
├── index.html
├── get_started.html
├── login.html
├── signup.html
├── home.html
├── browse.html
├── library.html
├── albums.html
├── artists.html
├── playlist.html
├── profile.html
│
├── scripts/
│   ├── app.js
│   ├── auth.js
│   ├── home.js
│   ├── search.js
│   ├── musicPlayer.js
│   ├── playlist.js
│   ├── library.js
│   ├── albums.js
│   ├── artists.js
│   ├── profile.js
│   └── songDetailPanel.js
│
├── assets/
│   ├── styles/
│   ├── images/
│   └── data/
│       └── songs.js
│
└── ...
```

---

# 🚀 How to Run

Since this is a static frontend project, it can run directly in the browser or through a lightweight local server.

---

## ▶️ Option 1: Open Directly

1. Clone or download the repository
2. Open `index.html` in your browser

---

## ▶️ Option 2: Run with Local Server (Recommended)

### Using VS Code Live Server

* Install the **Live Server** extension
* Right-click `index.html`
* Click **Open with Live Server**

---

### Using Python Server

```bash
python -m http.server 5500
```

Then open:

```text
http://localhost:5500/index.html
```

---

# 🔮 Future Improvements

* 🌍 Real backend integration for authentication & syncing
* 🎵 Music metadata / streaming API integration
* 📂 Queue management system
* ⚡ Advanced playback states
* ♿ Accessibility improvements (ARIA + keyboard navigation)
* 🧪 Automated testing & CI/CD workflows
* ☁️ Cloud-based storage & deployment

---

# 🤝 Contributing

Contributions are welcome!

If you'd like to improve:

* UI/UX
* Architecture
* Music player behavior
* Performance
* Accessibility

Feel free to:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request with a clear explanation

---

# 📄 License

This project is created for **educational and portfolio purposes**.

You may add an **MIT License** if you plan to distribute or open-source it publicly.

---

# ⭐ Final Note

This project was built to strengthen frontend development skills by recreating a real-world music streaming experience using only **HTML, CSS, and Vanilla JavaScript** — without relying on frontend frameworks.

If you like this project, consider giving it a ⭐ on GitHub!
