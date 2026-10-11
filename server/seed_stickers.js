const fs = require('fs');
const path = require('path');
const db = require('./db');

const stickersDir = path.join(__dirname, '..', 'uploads', 'stickers');
fs.mkdirSync(stickersDir, { recursive: true });

const builtInStickers = [
  {
    name: 'Wave Cat',
    filename: 'wave_cat.svg',
    emoji: '🐱',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="44" fill="#ffb74d"/>
      <polygon points="25,30 35,10 45,28" fill="#ff9800"/>
      <polygon points="75,30 65,10 55,28" fill="#ff9800"/>
      <circle cx="38" cy="46" r="6" fill="#222"/>
      <circle cx="62" cy="46" r="6" fill="#222"/>
      <circle cx="40" cy="44" r="2" fill="#fff"/>
      <circle cx="64" cy="44" r="2" fill="#fff"/>
      <polygon points="50,54 46,58 54,58" fill="#e91e63"/>
      <path d="M44,62 Q50,68 56,62" stroke="#222" stroke-width="3" fill="none"/>
      <path d="M20,50 L5,45 M20,55 L5,55 M80,50 L95,45 M80,55 L95,55" stroke="#e65100" stroke-width="2.5"/>
      <path d="M75,25 Q90,15 85,35" stroke="#ff9800" stroke-width="8" fill="none" stroke-linecap="round"/>
    </svg>`
  },
  {
    name: 'Party Blob',
    filename: 'party_blob.svg',
    emoji: '🎉',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M20,60 C15,30 35,15 50,15 C65,15 85,30 80,60 C75,85 25,85 20,60 Z" fill="#5865f2"/>
      <polygon points="50,5 35,28 65,28" fill="#ff3d00"/>
      <polygon points="50,5 35,18 45,28" fill="#ffeb3b"/>
      <circle cx="50" cy="5" r="4" fill="#00e676"/>
      <circle cx="38" cy="42" r="5" fill="#222"/>
      <circle cx="62" cy="42" r="5" fill="#222"/>
      <path d="M38,55 Q50,70 62,55" stroke="#222" stroke-width="4" fill="#ff1744"/>
    </svg>`
  },
  {
    name: 'Fire Heart',
    filename: 'fire_heart.svg',
    emoji: '🔥',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50,85 C50,85 15,60 15,35 C15,20 28,12 40,20 C46,24 50,30 50,30 C50,30 54,24 60,20 C72,12 85,20 85,35 C85,60 50,85 50,85 Z" fill="#ff1744"/>
      <path d="M50,80 C50,80 25,60 25,40 C25,28 35,22 43,28 C47,31 50,35 50,35 C50,35 53,31 57,28 C65,22 75,28 75,40 C75,60 50,80 50,80 Z" fill="#ff9100"/>
      <path d="M50,75 C50,75 35,60 35,45 C35,35 42,32 46,36 C48,38 50,42 50,42 C50,42 52,38 54,36 C58,32 65,35 65,45 C65,60 50,75 50,75 Z" fill="#ffea00"/>
    </svg>`
  },
  {
    name: 'Cool Doge',
    filename: 'cool_doge.svg',
    emoji: '😎',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="42" fill="#ffd54f"/>
      <polygon points="20,30 10,5 35,20" fill="#ffca28"/>
      <polygon points="80,30 90,5 65,20" fill="#ffca28"/>
      <rect x="20" y="38" width="60" height="16" rx="6" fill="#212121"/>
      <path d="M20,44 L80,44" stroke="#424242" stroke-width="2"/>
      <circle cx="50" cy="60" r="5" fill="#222"/>
      <path d="M44,66 Q50,72 56,66" stroke="#222" stroke-width="3" fill="none"/>
    </svg>`
  },
  {
    name: 'GG Trophy',
    filename: 'gg_trophy.svg',
    emoji: '🏆',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M30,20 L70,20 L65,55 C65,65 55,70 50,70 C45,70 35,65 35,55 Z" fill="#ffc107"/>
      <rect x="44" y="70" width="12" height="15" fill="#ffa000"/>
      <rect x="30" y="85" width="40" height="8" rx="2" fill="#6d4c41"/>
      <path d="M30,28 L20,28 C15,28 15,45 25,45 L32,45" stroke="#ffc107" stroke-width="5" fill="none"/>
      <path d="M70,28 L80,28 C85,28 85,45 75,45 L68,45" stroke="#ffc107" stroke-width="5" fill="none"/>
      <text x="50" y="45" font-size="14" font-weight="bold" text-anchor="middle" fill="#d84315">GG</text>
    </svg>`
  },
  {
    name: 'Crying Laugh',
    filename: 'crying_laugh.svg',
    emoji: '😂',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="44" fill="#ffca28"/>
      <path d="M25,38 Q35,32 42,38" stroke="#5d4037" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M58,38 Q65,32 75,38" stroke="#5d4037" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M28,52 Q50,90 72,52 Z" fill="#d32f2f"/>
      <path d="M35,52 Q50,62 65,52 Z" fill="#ffffff"/>
      <path d="M12,46 Q16,36 22,46 Q16,56 12,46 Z" fill="#00b0ff"/>
      <path d="M88,46 Q84,36 78,46 Q84,56 88,46 Z" fill="#00b0ff"/>
    </svg>`
  },
  {
    name: 'Popcorn Chill',
    filename: 'popcorn_chill.svg',
    emoji: '🍿',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="30,45 70,45 64,90 36,90" fill="#e53935"/>
      <polygon points="38,45 44,45 42,90 38,90" fill="#ffffff"/>
      <polygon points="56,45 62,45 60,90 56,90" fill="#ffffff"/>
      <circle cx="40" cy="35" r="10" fill="#fff9c4"/>
      <circle cx="50" cy="30" r="11" fill="#fff59d"/>
      <circle cx="60" cy="35" r="10" fill="#fff9c4"/>
      <circle cx="45" cy="22" r="8" fill="#fffde7"/>
      <circle cx="55" cy="24" r="8" fill="#fffde7"/>
    </svg>`
  },
  {
    name: 'Hype Rocket',
    filename: 'hype_rocket.svg',
    emoji: '🚀',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50,10 C65,25 70,55 70,70 L30,70 C30,55 35,25 50,10 Z" fill="#eceff1"/>
      <circle cx="50" cy="40" r="9" fill="#00e5ff"/>
      <circle cx="50" cy="40" r="7" fill="#01579b"/>
      <polygon points="30,50 15,70 30,70" fill="#f44336"/>
      <polygon points="70,50 85,70 70,70" fill="#f44336"/>
      <polygon points="50,95 40,70 60,70" fill="#ff9100"/>
      <polygon points="50,88 44,70 56,70" fill="#ffea00"/>
    </svg>`
  }
];

builtInStickers.forEach(st => {
  const filePath = path.join(stickersDir, st.filename);
  fs.writeFileSync(filePath, st.svg.trim(), 'utf8');
  const fileUrl = '/uploads/stickers/' + st.filename;

  try {
    const existing = db.getStickers().find(s => s.name === st.name && !s.serverId);
    if (!existing) {
      db.createSticker({
        serverId: null,
        name: st.name,
        description: 'Official Voiceline Sticker',
        tags: st.name.toLowerCase() + ' ' + st.emoji,
        fileUrl: fileUrl,
        fileFormat: 'svg'
      });
      console.log('Seeded sticker:', st.name);
    }
  } catch (err) {
    console.error('Error seeding:', err.message);
  }
});
console.log('Stickers seeded successfully.');
