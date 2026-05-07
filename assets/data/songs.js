// ===== songs.js =====
// Song data with 20 trending songs

const songsData = [
  {
    id: 1,
    title: "Blinding Lights",
    artist: "The Weeknd",
    coverImageUrl: "assets/images/album-after-hours.jpg",
    audioFileUrl: "assets/music/blinding-lights.mp3",
    album: "After Hours",
    duration: "3:20",
    genre: "Pop"
  },
  {
    id: 2,
    title: "Starboy",
    artist: "The Weeknd",
    coverImageUrl: "assets/images/album-after-hours.jpg",
    audioFileUrl: "assets/music/starboy.mp3",
    album: "Starboy",
    duration: "3:50",
    genre: "Pop"
  },
  {
    id: 3,
    title: "Peaches",
    artist: "Justin Bieber",
    coverImageUrl: "assets/images/album-justice.jpg",
    audioFileUrl: "assets/music/peaches.mp3",
    album: "Justice",
    duration: "3:18",
    genre: "Pop"
  },
  {
    id: 4,
    title: "Levitating",
    artist: "Dua Lipa",
    coverImageUrl: "assets/images/album-future-nostalgia.jpg",
    audioFileUrl: "assets/music/levitating.mp3",
    album: "Future Nostalgia",
    duration: "3:23",
    genre: "Pop"
  },
  {
    id: 5,
    title: "Good 4 U",
    artist: "Olivia Rodrigo",
    coverImageUrl: "assets/images/album-sour.jpg",
    audioFileUrl: "assets/music/good-4-u.mp3",
    album: "SOUR",
    duration: "2:58",
    genre: "Rock"
  },
  {
    id: 6,
    title: "Stay",
    artist: "The Kid LAROI",
    coverImageUrl: "assets/images/album-fk-love.jpg",
    audioFileUrl: "assets/music/stay.mp3",
    album: "F*CK LOVE 3",
    duration: "2:21",
    genre: "Pop"
  },
  {
    id: 7,
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    coverImageUrl: "assets/images/category-dark1.jpg",
    audioFileUrl: "assets/music/watermelon-sugar.mp3",
    album: "Fine Line",
    duration: "2:54",
    genre: "Pop"
  },
  {
    id: 8,
    title: "Don't Start Now",
    artist: "Dua Lipa",
    coverImageUrl: "assets/images/album-future-nostalgia.jpg",
    audioFileUrl: "assets/music/dont-start-now.mp3",
    album: "Future Nostalgia",
    duration: "3:03",
    genre: "Pop"
  },
  {
    id: 9,
    title: "Save Your Tears",
    artist: "The Weeknd",
    coverImageUrl: "assets/images/album-after-hours.jpg",
    audioFileUrl: "assets/music/save-your-tears.mp3",
    album: "After Hours",
    duration: "3:35",
    genre: "Pop"
  },
  {
    id: 10,
    title: "drivers license",
    artist: "Olivia Rodrigo",
    coverImageUrl: "assets/images/album-sour.jpg",
    audioFileUrl: "assets/music/drivers-license.mp3",
    album: "SOUR",
    duration: "4:02",
    genre: "Pop"
  },
  {
    id: 11,
    title: "Montero",
    artist: "Lil Nas X",
    coverImageUrl: "assets/images/default-album.jpg",
    audioFileUrl: "assets/music/montero.mp3",
    album: "Montero",
    duration: "2:17",
    genre: "Dark Side"
  },
  {
    id: 12,
    title: "Heat Waves",
    artist: "Glass Animals",
    coverImageUrl: "assets/images/playlist-top-songs.jpg",
    audioFileUrl: "assets/music/heat-waves.mp3",
    album: "Dreamland",
    duration: "3:58",
    genre: "Indie"
  },
  {
    id: 13,
    title: "Levitating (Remix)",
    artist: "Dua Lipa ft. DaBaby",
    coverImageUrl: "assets/images/album-future-nostalgia.jpg",
    audioFileUrl: "assets/music/levitating-remix.mp3",
    album: "Future Nostalgia",
    duration: "3:23",
    genre: "Pop"
  },
  {
    id: 14,
    title: "Hurt Me More",
    artist: "Doja Cat ft. SZA",
    coverImageUrl: "assets/images/playlist-chill-mix.jpg",
    audioFileUrl: "assets/music/kiss-me-more.mp3",
    album: "Planet Her",
    duration: "3:28",
    genre: "R&B"
  },
  {
    id: 15,
    title: "Industry Baby",
    artist: "Lil Nas X & Jack Harlow",
    coverImageUrl: "assets/images/category-dark.jpg",
    audioFileUrl: "assets/music/industry-baby.mp3",
    album: "Montero",
    duration: "3:32",
    genre: "Dark Side"
  },
  {
    id: 16,
    title: "Shivers",
    artist: "Ed Sheeran",
    coverImageUrl: "assets/images/default-metal.jpg",
    audioFileUrl: "assets/music/shivers.mp3",
    album: "=",
    duration: "3:27",
    genre: "Pop"
  },
  {
    id: 17,
    title: "Bad Habits",
    artist: "Ed Sheeran",
    coverImageUrl: "assets/images/default-Reggae.jpg",
    audioFileUrl: "assets/music/bad-habits.mp3",
    album: "=",
    duration: "3:51",
    genre: "Pop"
  },
  {
    id: 18,
    title: "As It Was",
    artist: "Harry Styles",
    coverImageUrl: "assets/images/default-latin.jpg",
    audioFileUrl: "assets/music/as-it-was.mp3",
    album: "Harry's House",
    duration: "2:47",
    genre: "Pop"
  },
  {
    id: 19,
    title: "About Damn Time",
    artist: "Lizzo",
    coverImageUrl: "assets/images/default-R_B.jpg",
    audioFileUrl: "assets/music/about-damn-time.mp3",
    album: "Special",
    duration: "3:11",
    genre: "R&B"
  },
  {
    id: 20,
    title: "First Class",
    artist: "Jack Harlow",
    coverImageUrl: "assets/images/category-rock.jpg",
    audioFileUrl: "assets/music/first-class.mp3",
    album: "Come Home The Kids Miss You",
    duration: "2:53",
    genre: "Dark Side"
  }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = songsData;
}

