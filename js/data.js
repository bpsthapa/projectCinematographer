/* ==========================================================
   Site content. Edit this file to update the portfolio.
   - Add a photo: drop it in assets/img/ (plus an optional
     "-sm" thumbnail) and add one line to `gallery`.
   - Contact links stay hidden until you fill them in.
   ========================================================== */
window.SITE = {
  name: "Krishna Bahadur Thapa",
  role: "Cinematographer",

  // Fill these in before deploying. Empty values are hidden on the page.
  contact: {
    email: "",        // e.g. "name@example.com"
    phone: "",        // e.g. "+977 98XXXXXXXX"
    whatsapp: "",     // digits only with country code, e.g. "97798XXXXXXXX"
    facebook: "",     // full profile URL
    instagram: ""     // full profile URL
  },

  // Hero "viewfinder" slides (landscape images work best)
  hero: [
    { src: "assets/img/venice-hills.jpg", clip: "A001C014", focus: 0.35 },
    { src: "assets/img/venice-field.jpg", clip: "A002C007", focus: 0.62 },
    { src: "assets/img/above-the-clouds.jpg", clip: "A003C021", focus: 0.85 },
    { src: "assets/img/red-under-tree.jpg", clip: "B001C003", focus: 0.18 }
  ],

  quotes: [
    "Documentaries have always inspired me in narrative filmmaking.",
    "Always explore the new possibilities of innovative technology.",
    "Filmmaking is a process through which you discover yourself."
  ],

  path: [
    { title: "Assistant cinematographer", text: "Learning the camera department from the ground up." },
    { title: "Focus puller", text: "Keeping every shot sharp, take after take." },
    { title: "Chief assistant cinematographer", text: "Running the camera team on set." },
    { title: "Cinematographer", text: "Shaping the look and the light of the story." }
  ],

  // `poster` can be a local file or a URL. If it fails to load,
  // the row falls back to a typographic card.
  films: [
    { title: "Hookah", note: "Feature film, directed by Shambhu Thapa", year: "2077 BS", poster: "assets/img/slate-hookah-sm.jpg" },
    { title: "Bhasme Don", note: "Feature film", year: "", poster: "https://neftanepal.org.np/wp-content/uploads/2024/02/bhasme_don.jpg" },
    { title: "Chiso Manchhe", note: "Feature film", year: "", poster: "https://neftanepal.org.np/wp-content/uploads/2024/02/chiso_manchhe.jpeg" },
    { title: "Ghamad Shere", note: "Feature film", year: "", poster: "https://neftanepal.org.np/wp-content/uploads/2024/02/ghamad-shere.jpeg" }
  ],

  gallery: [
    { src: "assets/img/venice-hills.jpg", thumb: "assets/img/venice-hills-sm.jpg", caption: "Operating a Sony Venice in the hills" },
    { src: "assets/img/steadicam-session.jpg", thumb: "assets/img/steadicam-session-sm.jpg", caption: "Steadicam session" },
    { src: "assets/img/nanlux-lighting.jpg", thumb: "assets/img/nanlux-lighting-sm.jpg", caption: "Building light with parabolic softboxes" },
    { src: "assets/img/above-the-clouds.jpg", thumb: "assets/img/above-the-clouds-sm.jpg", caption: "Morning setup above the clouds" },
    { src: "assets/img/slate-hookah.jpg", thumb: "assets/img/slate-hookah-sm.jpg", caption: "Slate for Hookah" },
    { src: "assets/img/high-angle.jpg", thumb: "assets/img/high-angle-sm.jpg", caption: "Rigging a high angle" },
    { src: "assets/img/venice-field.jpg", thumb: "assets/img/venice-field-sm.jpg", caption: "Lining up a shot in the fields" },
    { src: "assets/img/night-monitor.jpg", thumb: "assets/img/night-monitor-sm.jpg", caption: "Checking the frame on a night exterior" },
    { src: "assets/img/steadicam-rig.jpg", thumb: "assets/img/steadicam-rig-sm.jpg", caption: "Steadicam on a wheeled rig" },
    { src: "assets/img/red-under-tree.jpg", thumb: "assets/img/red-under-tree-sm.jpg", caption: "Low and tight on a RED camera" }
  ],

  awards: [
    { year: "2023", title: "Jury member", text: "6th National Inclusive Music Awards (NIM Awards)" },
    { year: "2079 BS", title: "Best Cinematographer of the Year, Folk Song", text: "4th Sagarmatha Music Awards" },
    { year: "2079 BS", title: "Nominee, Cinematographer of the Year", text: "Sagarmatha Music Awards, for the song Mitho Sarangi" },
    { year: "2022", title: "Judge", text: "Nepal’s Kids Model of the Year talent show" },
    { year: "2078 BS", title: "Certificate of appreciation", text: "Artists and Creator Appreciation, held in the presence of Nepal’s Vice President" },
    { year: "", title: "Certificate of appreciation", text: "Himalayan Fashion Adventure, a solo exhibition" }
  ]
};
