export const categories = [
  'Action',
  'Battle Royale',
  'Racing',
  'Horror',
  'Open World',
  'Sports',
  'Multiplayer',
  'RPG',
  'Adventure',
  'Survival',
  'FPS',
  'Offline Games',
  'Online Games'
];

export const games = [
  {
    id: 'nova-reign',
    title: 'Nova Reign',
    cover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    screenshotUrls: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Nova Reign is a neon open world action game with advanced combat systems, stunning cyber architecture and high-speed conquest zones.',
    features: [
      'Futuristic open world combat',
      'Dynamic weather & day/night cycle',
      'Competitive crafting and leveling',
      'Rich storyline with multiple endings'
    ],
    installationGuide: [
      'Download the installer from the official link.',
      'Run the setup file and accept the license agreement.',
      'Choose installation directory and complete setup.',
      'Launch the game and sign in using the provided key.'
    ],
    notices: 'Make sure your GPU drivers are updated before installation to avoid compatibility issues.',
    requirements: {
      minimum: ['Intel Core i5', '8 GB RAM', 'GTX 1060 / RX 580', '50 GB free storage'],
      recommended: ['Intel Core i7', '16 GB RAM', 'RTX 2060 / RX 6600', '50 GB free storage']
    },
    downloadLinks: {
      primary: 'https://example.com/download/nova-reign',
      mirror: 'https://example.com/mirror/nova-reign'
    },
    fileSize: '49 GB',
    platform: 'PC',
    genres: ['Action', 'Open World', 'Multiplayer'],
    releaseDate: 'May 2026',
    version: '1.02',
    developer: 'Lunar Forge Studio',
    trailerUrl: 'https://www.youtube.com/embed/1tIz9yNQ7-o',
    rating: 4.9,
    downloads: 298453,
    isTrending: true,
    isNew: true,
    recommended: true
  },
  {
    id: 'ghost-circuit',
    title: 'Ghost Circuit',
    cover: 'https://images.unsplash.com/photo-1519817650390-64a93db5116d?auto=format&fit=crop&w=1200&q=80',
    screenshotUrls: [
      'https://images.unsplash.com/photo-1519817650390-64a93db5116d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1511512303458-d7e3c4d0f1b7?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1510832842230-3f8e4d8b6817?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Ghost Circuit is a high-octane futuristic racing experience with neon streets, augmented vehicles and realtime multiplayer tournaments.',
    features: [
      'Hyper-realistic racing physics',
      'Custom vehicle upgrades',
      'Cross-platform multiplayer',
      'Night city tracks with adaptive hazards'
    ],
    installationGuide: [
      'Click the primary download link to grab the installer.',
      'Run the setup file and select custom install settings.',
      'Launch the game and sync your profile with the cloud.',
      'Adjust graphics settings for best performance.'
    ],
    notices: 'This game requires an active internet connection for online tournaments.',
    requirements: {
      minimum: ['Intel Core i5', '8 GB RAM', 'GTX 970 / RX 570', '32 GB free storage'],
      recommended: ['Intel Core i7', '16 GB RAM', 'RTX 2070 / RX 6700', '32 GB free storage']
    },
    downloadLinks: {
      primary: 'https://example.com/download/ghost-circuit',
      mirror: 'https://example.com/mirror/ghost-circuit'
    },
    fileSize: '31 GB',
    platform: 'PC',
    genres: ['Racing', 'Multiplayer', 'Online Games'],
    releaseDate: 'March 2026',
    version: '2.4',
    developer: 'Pulse Drive Labs',
    trailerUrl: 'https://www.youtube.com/embed/8X4kH6uMPX0',
    rating: 4.7,
    downloads: 184122,
    isTrending: true,
    isNew: false,
    recommended: true
  },
  {
    id: 'skyfall-shadow',
    title: 'Skyfall Shadow',
    cover: 'https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?auto=format&fit=crop&w=1200&q=80',
    screenshotUrls: [
      'https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Skyfall Shadow is a mobile RPG adventure with breathtaking aerial combat, skill trees and a cinematic story set across floating continents.',
    features: [
      'Infinite progression skill tree',
      'Mobile-optimized combat',
      'Immersive soundtrack and story',
      'Co-op raids and side quests'
    ],
    installationGuide: [
      'Open the Android installer link from the download button.',
      'Allow installation from unknown sources if prompted.',
      'Complete installation and launch the app.',
      'Accept permissions and sign in to start the prologue.'
    ],
    notices: 'Best played on Android 11+ devices with 4GB RAM or more.',
    requirements: {
      minimum: ['Android 9.0', '4 GB RAM', '2.5 GB free storage'],
      recommended: ['Android 12', '6 GB RAM', '3.5 GB free storage']
    },
    downloadLinks: {
      primary: 'https://example.com/download/skyfall-shadow',
      mirror: 'https://example.com/mirror/skyfall-shadow'
    },
    fileSize: '2.8 GB',
    platform: 'Android',
    genres: ['RPG', 'Adventure', 'Mobile'],
    releaseDate: 'April 2026',
    version: '1.8.1',
    developer: 'Aetherborne Games',
    trailerUrl: 'https://www.youtube.com/embed/TbG2yOhlv2s',
    rating: 4.8,
    downloads: 720214,
    isTrending: false,
    isNew: true,
    recommended: true
  },
  {
    id: 'titan-pulse',
    title: 'Titan Pulse',
    cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    screenshotUrls: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Titan Pulse is a competitive battle royale FPS with a futuristic arena, powerful loadouts, and constant content drops.',
    features: [
      '90-player battle royale mode',
      'Adaptive weapon mod system',
      'Seasonal battle passes',
      'Ranked leaderboards and teams'
    ],
    installationGuide: [
      'Download the PC installer through the main download link.',
      'Run the installer and follow the on-screen prompts.',
      'Launch and apply the latest patch.',
      'Join a server and test your squad loadout.'
    ],
    notices: 'The game uses online matchmaking; low-latency networks are recommended.',
    requirements: {
      minimum: ['Intel Core i5', '12 GB RAM', 'GTX 1070 / RX 580', '45 GB free storage'],
      recommended: ['Intel Core i7', '16 GB RAM', 'RTX 2070 / RX 6700 XT', '45 GB free storage']
    },
    downloadLinks: {
      primary: 'https://example.com/download/titan-pulse',
      mirror: 'https://example.com/mirror/titan-pulse'
    },
    fileSize: '45 GB',
    platform: 'PC',
    genres: ['Battle Royale', 'FPS', 'Online Games'],
    releaseDate: 'January 2026',
    version: '3.1',
    developer: 'Zenith Core',
    trailerUrl: 'https://www.youtube.com/embed/2x6T1OZ7xuw',
    rating: 4.6,
    downloads: 412890,
    isTrending: true,
    isNew: false,
    recommended: false
  },
  {
    id: 'neon-drift',
    title: 'Neon Drift',
    cover: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=1200&q=80',
    screenshotUrls: [
      'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1520021314005-10de86019eb5?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Neon Drift delivers fast-paced mobile racing with glowing retro circuits, drift mastery, and competitive leaderboards.',
    features: [
      'Touch-optimized controls',
      'Retro cyberpunk tracks',
      'Ranked drift challenges',
      'Offline time attack mode'
    ],
    installationGuide: [
      'Open the Android download link and save the APK file.',
      'Allow installation from unknown sources in your device settings.',
      'Install the APK and open Neon Drift.',
      'Complete the tutorial to unlock your first car.'
    ],
    notices: 'Requires Android 10 or higher for the most fluid performance.',
    requirements: {
      minimum: ['Android 9.0', '3 GB RAM', '1.7 GB free storage'],
      recommended: ['Android 11', '4 GB RAM', '2.2 GB free storage']
    },
    downloadLinks: {
      primary: 'https://example.com/download/neon-drift',
      mirror: 'https://example.com/mirror/neon-drift'
    },
    fileSize: '1.9 GB',
    platform: 'Android',
    genres: ['Racing', 'Offline Games', 'Mobile'],
    releaseDate: 'February 2026',
    version: '2.0',
    developer: 'Neon Pulse Studio',
    trailerUrl: 'https://www.youtube.com/embed/7fB2OQ8PQsI',
    rating: 4.5,
    downloads: 540871,
    isTrending: false,
    isNew: false,
    recommended: true
  },
  {
    id: 'abyss-hunt',
    title: 'Abyss Hunt',
    cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    screenshotUrls: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1508830524289-0adcbe822b40?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Abyss Hunt is a horror-survival PC title set in a flooded dystopian city where stealth and resource management are essential for survival.',
    features: [
      'Atmospheric survival horror',
      'Stealth and resource systems',
      'Psychological narrative',
      'Adaptive enemy AI'
    ],
    installationGuide: [
      'Download the installer and unzip the package.',
      'Run the setup executable and follow the prompts.',
      'Launch Abyss Hunt and configure your audio and controls.',
      'Start the campaign in Night Mode for the full experience.'
    ],
    notices: 'Recommended to use headphones for the best exploration experience.',
    requirements: {
      minimum: ['Intel Core i5', '8 GB RAM', 'GTX 1050 Ti / RX 560', '28 GB free storage'],
      recommended: ['Intel Core i7', '16 GB RAM', 'RTX 2060 / RX 5700', '28 GB free storage']
    },
    downloadLinks: {
      primary: 'https://example.com/download/abyss-hunt',
      mirror: 'https://example.com/mirror/abyss-hunt'
    },
    fileSize: '28 GB',
    platform: 'PC',
    genres: ['Horror', 'Survival', 'Offline Games'],
    releaseDate: 'December 2025',
    version: '1.5',
    developer: 'Obsidian Depths',
    trailerUrl: 'https://www.youtube.com/embed/UYWpBay0L2s',
    rating: 4.3,
    downloads: 210398,
    isTrending: false,
    isNew: false,
    recommended: false
  },
  {
    id: 'cosmos-arena',
    title: 'Cosmos Arena',
    cover: 'https://images.unsplash.com/photo-1524946271429-6e0da1d61d5d?auto=format&fit=crop&w=1200&q=80',
    screenshotUrls: [
      'https://images.unsplash.com/photo-1524946271429-6e0da1d61d5d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1523885089169-a9581f07f4e2?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Cosmos Arena is a mobile sports simulation with intergalactic stadiums, team management and fast offline tournaments.',
    features: [
      'Galaxy-class sports arenas',
      'Offline campaign mode',
      'Team customization',
      'Arcade-style controls'
    ],
    installationGuide: [
      'Download and open the iOS installation profile.',
      'Follow the device prompts to install the game.',
      'Open Cosmos Arena from the home screen.',
      'Complete the first match training module.'
    ],
    notices: 'Requires iOS 14 or newer for optimal performance.',
    requirements: {
      minimum: ['iOS 14', '4 GB RAM', '2 GB free storage'],
      recommended: ['iOS 15', '6 GB RAM', '3 GB free storage']
    },
    downloadLinks: {
      primary: 'https://example.com/download/cosmos-arena',
      mirror: 'https://example.com/mirror/cosmos-arena'
    },
    fileSize: '3.1 GB',
    platform: 'iOS',
    genres: ['Sports', 'Multiplayer', 'Mobile'],
    releaseDate: 'November 2025',
    version: '1.3',
    developer: 'Arcade Galaxy',
    trailerUrl: 'https://www.youtube.com/embed/H4j_5R2R1Mk',
    rating: 4.4,
    downloads: 180481,
    isTrending: false,
    isNew: false,
    recommended: true
  }
];
