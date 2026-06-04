/**
 * GeoConnections — Category Bank + Daily Puzzle Generator
 *
 * HOW IT WORKS
 * ─────────────
 * Instead of a fixed list of pre-built puzzles, every day a fresh puzzle is
 * assembled by picking ONE category from each difficulty bucket (yellow /
 * green / blue / purple) using a date-seeded shuffle. The same date always
 * produces the same puzzle for every player.
 *
 * The seeded Fisher-Yates shuffle ensures that within each bucket no category
 * repeats until all categories in that bucket have been used once (then it
 * re-shuffles with the next "epoch" seed). With 20+ categories per bucket
 * you get 20+ unique days before any single category is reused.
 *
 * A tile-conflict check runs at selection time: if the chosen category shares
 * a tile with one already selected, the algorithm skips to the next candidate
 * in that bucket's shuffled order, so the 16 tiles are always unique.
 *
 * TO ADD MORE CATEGORIES
 * ──────────────────────
 * Just push more objects into `categoryBank`. The rotation extends
 * automatically — no other code needs to change.
 */


// ─── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────
function mulberry32(seed) {
  return function next() {
    // eslint-disable-next-line no-param-reassign
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ─── Seeded Fisher-Yates shuffle ──────────────────────────────────────────────
function seededShuffle(arr, seed) {
  const result = [...arr]
  const rng = mulberry32(seed)
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// ─── Category Bank ────────────────────────────────────────────────────────────
// Each entry: { color, label, tiles[4] }
// Difficulty: yellow (easiest) → green → blue → purple (hardest)

export const categoryBank = [

  // ══════════════════════════════════════════════════════════════════════════════
  //  YELLOW — Easiest (20 categories)
  // ══════════════════════════════════════════════════════════════════════════════

  {
    color: 'yellow',
    label: "World's Longest Rivers",
    tiles: ['Nile', 'Amazon', 'Yangtze', 'Mississippi'],
  },
  {
    color: 'yellow',
    label: 'Capital Cities of South America',
    tiles: ['Brasília', 'Buenos Aires', 'Lima', 'Bogotá'],
  },
  {
    color: 'yellow',
    label: 'Famous Deserts of the World',
    tiles: ['Sahara', 'Gobi', 'Atacama', 'Kalahari'],
  },
  {
    color: 'yellow',
    label: 'Countries in the Nordic Region',
    tiles: ['Norway', 'Sweden', 'Denmark', 'Finland'],
  },
  {
    color: 'yellow',
    label: 'Countries on the Arabian Peninsula',
    tiles: ['Oman', 'Qatar', 'Kuwait', 'Bahrain'],
  },
  {
    color: 'yellow',
    label: 'Countries in Central America',
    tiles: ['Guatemala', 'Honduras', 'Nicaragua', 'Costa Rica'],
  },
  {
    color: 'yellow',
    label: 'Cities on the Nile',
    tiles: ['Cairo', 'Luxor', 'Khartoum', 'Aswan'],
  },
  {
    color: 'yellow',
    // UK, Belgium, Netherlands, Bulgaria — all have a lion on their national emblem
    label: "Cities Whose Country's National Animal Is the Lion",
    tiles: ['London', 'Brussels', 'Amsterdam', 'Sofia'],
  },
  {
    color: 'yellow',
    // Colosseum 48 m · Arc de Triomphe 50 m · Pisa 56 m · Big Ben 96 m
    label: 'Famous Landmarks Under 100 Metres Tall',
    tiles: ['Colosseum', 'Arc de Triomphe', 'Leaning Tower of Pisa', 'Big Ben'],
  },
  {
    color: 'yellow',
    label: 'US States on the Gulf of Mexico',
    tiles: ['Texas', 'Louisiana', 'Mississippi', 'Alabama'],
  },
  {
    color: 'yellow',
    // Oslo 4 · Doha 4 · Lima 4 · Baku 4
    label: 'World Capitals With Exactly 4 Letters',
    tiles: ['Oslo', 'Doha', 'Lima', 'Baku'],
  },
  {
    color: 'yellow',
    // All continuously inhabited for 3 000+ years
    label: "Among the World's Oldest Continuously Inhabited Cities",
    tiles: ['Athens', 'Jerusalem', 'Rome', 'Damascus'],
  },
  {
    color: 'yellow',
    label: 'Countries in East Africa',
    tiles: ['Kenya', 'Tanzania', 'Uganda', 'Rwanda'],
  },
  {
    color: 'yellow',
    label: 'Countries in the Caribbean',
    tiles: ['Cuba', 'Jamaica', 'Haiti', 'Dominican Republic'],
  },
  {
    color: 'yellow',
    label: 'Countries of the Indian Subcontinent',
    tiles: ['India', 'Pakistan', 'Bangladesh', 'Sri Lanka'],
  },
  {
    color: 'yellow',
    label: 'US States in New England',
    tiles: ['Maine', 'Vermont', 'Connecticut', 'Rhode Island'],
  },
  {
    color: 'yellow',
    label: 'Countries in Southeast Asia',
    // Thailand, Cambodia, Laos, Myanmar — avoids tiles used elsewhere
    tiles: ['Thailand', 'Cambodia', 'Laos', 'Myanmar'],
  },
  {
    color: 'yellow',
    label: 'African Countries on the Mediterranean Coast',
    tiles: ['Morocco', 'Algeria', 'Tunisia', 'Libya'],
  },
  {
    color: 'yellow',
    label: 'Countries in the Balkans',
    tiles: ['Serbia', 'Croatia', 'Slovenia', 'Bosnia'],
  },
  {
    color: 'yellow',
    // The four largest Mediterranean islands
    label: 'Major Islands of the Mediterranean',
    tiles: ['Sicily', 'Sardinia', 'Corsica', 'Crete'],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  //  GREEN — Medium (20 categories)
  // ══════════════════════════════════════════════════════════════════════════════

  {
    color: 'green',
    label: 'Countries That Border France',
    tiles: ['Spain', 'Germany', 'Italy', 'Switzerland'],
  },
  {
    color: 'green',
    label: 'Landlocked Countries in Africa',
    tiles: ['Chad', 'Mali', 'Niger', 'Zambia'],
  },
  {
    color: 'green',
    label: 'Countries That Border China',
    tiles: ['Mongolia', 'Vietnam', 'Nepal', 'Kazakhstan'],
  },
  {
    color: 'green',
    label: 'Famous Volcanoes',
    tiles: ['Vesuvius', 'Krakatoa', 'Etna', 'Fuji'],
  },
  {
    color: 'green',
    label: 'Capital Cities of East Asia',
    tiles: ['Tokyo', 'Seoul', 'Beijing', 'Pyongyang'],
  },
  {
    color: 'green',
    label: 'Major Seas of the World',
    tiles: ['Coral Sea', 'Arabian Sea', 'Tasman Sea', 'Bering Sea'],
  },
  {
    color: 'green',
    label: 'Cities on the Rhine',
    tiles: ['Cologne', 'Düsseldorf', 'Bonn', 'Basel'],
  },
  {
    color: 'green',
    // India, Bangladesh, Malaysia, South Korea — national animal is a tiger species
    label: "Cities Whose Country's National Animal Is the Tiger",
    tiles: ['New Delhi', 'Dhaka', 'Kuala Lumpur', 'Seoul'],
  },
  {
    color: 'green',
    // Washington Monument 169 m · Sagrada Família 172 m · Chrysler 319 m · Eiffel 330 m
    label: 'Famous Landmarks Between 100–400 Metres Tall',
    tiles: ['Washington Monument', 'Sagrada Família', 'Chrysler Building', 'Eiffel Tower'],
  },
  {
    color: 'green',
    label: 'US States on the Pacific Ocean',
    tiles: ['California', 'Oregon', 'Washington', 'Alaska'],
  },
  {
    color: 'green',
    // Paris 5 · Accra 5 · Kabul 5 · Minsk 5  (avoids Tokyo/Seoul used elsewhere)
    label: 'World Capitals With Exactly 5 Letters',
    tiles: ['Paris', 'Accra', 'Kabul', 'Minsk'],
  },
  {
    color: 'green',
    // Quito 1534 · Lima 1535 · Asunción 1537 · Bogotá 1538
    label: 'Cities Founded by Spanish Conquistadors in the 1530s',
    tiles: ['Quito', 'Lima', 'Asunción', 'Bogotá'],
  },
  {
    color: 'green',
    label: 'Cities on the Ganges River',
    tiles: ['Varanasi', 'Patna', 'Prayagraj', 'Haridwar'],
  },
  {
    color: 'green',
    label: 'Countries That Share a Land Border With India',
    // Land borders: Pakistan, China, Nepal, Bhutan, Bangladesh, Myanmar
    tiles: ['Pakistan', 'China', 'Nepal', 'Bangladesh'],
  },
  {
    color: 'green',
    // All directly border Russia on its western side
    label: "Countries on Russia's Western Border",
    tiles: ['Finland', 'Estonia', 'Latvia', 'Lithuania'],
  },
  {
    color: 'green',
    label: 'Countries in the Caucasus Region',
    tiles: ['Georgia', 'Armenia', 'Azerbaijan', 'Turkey'],
  },
  {
    color: 'green',
    label: 'US States in the Rocky Mountain Region',
    tiles: ['Colorado', 'Utah', 'Idaho', 'Montana'],
  },
  {
    color: 'green',
    label: 'Countries in Southern Africa',
    tiles: ['South Africa', 'Botswana', 'Namibia', 'Zimbabwe'],
  },
  {
    color: 'green',
    label: 'Cities on the Danube River',
    tiles: ['Vienna', 'Budapest', 'Belgrade', 'Bratislava'],
  },
  {
    color: 'green',
    label: 'Great Rivers of North America',
    // river names — Colorado and Missouri are rivers (not the state/city)
    tiles: ['Missouri', 'Colorado', 'Rio Grande', 'Yukon'],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  //  BLUE — Hard (20 categories)
  // ══════════════════════════════════════════════════════════════════════════════

  {
    color: 'blue',
    label: 'Island Nations in the Pacific',
    tiles: ['Fiji', 'Tonga', 'Samoa', 'Vanuatu'],
  },
  {
    color: 'blue',
    label: 'Major Mountain Ranges of the World',
    tiles: ['Andes', 'Himalayas', 'Rockies', 'Alps'],
  },
  {
    color: 'blue',
    label: 'Capital Cities of Sub-Saharan Africa',
    tiles: ['Nairobi', 'Accra', 'Addis Ababa', 'Kinshasa'],
  },
  {
    color: 'blue',
    label: 'Countries That Share a Land Border With Brazil',
    tiles: ['Argentina', 'Uruguay', 'Paraguay', 'Colombia'],
  },
  {
    color: 'blue',
    // Japan, Thailand (buffer state), Ethiopia (Adwa 1896), Nepal
    label: 'Countries That Were Never Colonized by a European Power',
    tiles: ['Japan', 'Ethiopia', 'Bhutan', 'Liberia'],
  },
  {
    color: 'blue',
    label: 'Countries That Officially Use the US Dollar as Currency',
    tiles: ['Ecuador', 'El Salvador', 'Panama', 'Zimbabwe'],
  },
  {
    color: 'blue',
    label: 'Cities on the Mississippi River',
    tiles: ['New Orleans', 'Memphis', 'St. Louis', 'Minneapolis'],
  },
  {
    color: 'blue',
    // Germany, Poland, Mexico, Egypt — all have an eagle on their national emblem
    label: "Cities Whose Country's National Animal Is the Eagle",
    tiles: ['Berlin', 'Warsaw', 'Mexico City', 'Cairo'],
  },
  {
    color: 'blue',
    // Empire State 443 m · Petronas 452 m · Willis 527 m · One WTC 541 m
    label: 'Famous Landmarks Between 400–550 Metres Tall',
    tiles: ['Empire State Building', 'Petronas Towers', 'Willis Tower', 'One World Trade Center'],
  },
  {
    color: 'blue',
    label: 'Cities on the Mediterranean Sea',
    tiles: ['Barcelona', 'Naples', 'Beirut', 'Algiers'],
  },
  {
    color: 'blue',
    // Berlin 6 · Dublin 6 · Warsaw 6 · Sydney 6
    label: 'World Capitals With Exactly 6 Letters',
    tiles: ['Berlin', 'Dublin', 'Warsaw', 'Sydney'],
  },
  {
    color: 'blue',
    // Chicago 1833 · Melbourne 1835 · Houston 1836 · Singapore 1819
    label: 'Cities Founded in the 1800s',
    tiles: ['Chicago', 'Melbourne', 'Houston', 'Singapore'],
  },
  {
    color: 'blue',
    // Athens 2004 · Beijing 2008 · London 2012 · Rio de Janeiro 2016
    label: 'Cities That Hosted the Summer Olympics Between 2004 and 2016',
    tiles: ['Athens', 'Beijing', 'London', 'Rio de Janeiro'],
  },
  {
    color: 'blue',
    label: 'Countries in Southern Europe',
    tiles: ['Portugal', 'Spain', 'Italy', 'Greece'],
  },
  {
    color: 'blue',
    label: 'Famous Bays and Gulfs of the World',
    tiles: ['Hudson Bay', 'Guanabara Bay', 'Bay of Bengal', 'Chesapeake Bay'],
  },
  {
    color: 'blue',
    // Four of the Seven Ancient Wonders
    label: 'Ancient Wonders of the World',
    tiles: ['Great Pyramid of Giza', 'Colossus of Rhodes', 'Temple of Artemis', 'Hanging Gardens of Babylon'],
  },
  {
    color: 'blue',
    label: 'Island Nations in the Indian Ocean',
    tiles: ['Maldives', 'Seychelles', 'Mauritius', 'Madagascar'],
  },
  {
    color: 'blue',
    // The four US states that border Mexico
    label: 'US States That Border Mexico',
    tiles: ['California', 'Arizona', 'New Mexico', 'Texas'],
  },
  {
    color: 'blue',
    // Brazil 5 · Germany 4 · Italy 4 · Argentina 3
    label: 'Countries With 3 or More FIFA World Cup Wins',
    tiles: ['Brazil', 'Germany', 'Italy', 'Argentina'],
  },
  {
    color: 'blue',
    label: 'Cities on the Amazon River',
    tiles: ['Manaus', 'Iquitos', 'Santarém', 'Belém'],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  //  PURPLE — Hardest (20 categories)
  // ══════════════════════════════════════════════════════════════════════════════

  {
    color: 'purple',
    // Portugal→Spain, Canada→USA, South Korea→North Korea, PNG→Indonesia
    label: 'Countries With Exactly One Land Neighbor',
    tiles: ['Portugal', 'Canada', 'South Korea', 'Papua New Guinea'],
  },
  {
    color: 'purple',
    // Bolivia→Bolívar, Colombia→Columbus, Philippines→King Philip II, Saudi Arabia→Ibn Saud
    label: 'Countries Named After a Person',
    tiles: ['Bolivia', 'Colombia', 'Philippines', 'Saudi Arabia'],
  },
  {
    color: 'purple',
    label: 'Countries With a Cardinal Direction in Their Name',
    tiles: ['South Sudan', 'South Africa', 'North Macedonia', 'East Timor'],
  },
  {
    color: 'purple',
    // Turkey=bird, China=porcelain, Panama=hat, Morocco=leather
    label: 'Countries That Are Also Common English Nouns',
    tiles: ['Turkey', 'China', 'Panama', 'Morocco'],
  },
  {
    color: 'purple',
    // Swaziland→Eswatini (2018), FYROM→North Macedonia (2019),
    // Cape Verde→Cabo Verde (2013), Turkey→Türkiye (2022)
    label: 'Countries That Officially Renamed Themselves This Century',
    tiles: ['Eswatini', 'North Macedonia', 'Cabo Verde', 'Türkiye'],
  },
  {
    color: 'purple',
    // Nigeria→NIGER, Somalia→MALI, Romania→OMAN, Equatorial Guinea→GUINEA
    label: "Countries That Contain Another Country's Name Within Them",
    tiles: ['Nigeria', 'Somalia', 'Romania', 'Equatorial Guinea'],
  },
  {
    color: 'purple',
    label: 'Cities on the Yangtze River',
    tiles: ['Shanghai', 'Nanjing', 'Wuhan', 'Chongqing'],
  },
  {
    color: 'purple',
    // Cape Town (Boulders Beach), Ushuaia (Martillo Island),
    // Christchurch (Banks Peninsula), Stanley (Falklands)
    label: 'Cities Near Famous Wild Penguin Colonies',
    tiles: ['Cape Town', 'Ushuaia', 'Christchurch', 'Stanley'],
  },
  {
    color: 'purple',
    // CN Tower 553 m · Tokyo Skytree 634 m · Shanghai Tower 632 m · Burj Khalifa 828 m
    label: 'Famous Structures Over 550 Metres Tall',
    tiles: ['CN Tower', 'Tokyo Skytree', 'Shanghai Tower', 'Burj Khalifa'],
  },
  {
    color: 'purple',
    // The Caspian is technically the world's largest lake — a fun twist
    label: 'Cities on the Caspian Sea',
    tiles: ['Baku', 'Astrakhan', 'Aktau', 'Bandar Anzali'],
  },
  {
    color: 'purple',
    // Bangkok 7 · Caracas 7 · Baghdad 7 · Nairobi 7 (Bangkok trips people up)
    label: 'World Capitals With Exactly 7 Letters',
    tiles: ['Bangkok', 'Caracas', 'Baghdad', 'Nairobi'],
  },
  {
    color: 'purple',
    // Entire cities designed and built from scratch to serve as new capitals
    label: 'Purpose-Built Capital Cities (Built From Scratch)',
    tiles: ['Canberra', 'Brasília', 'Islamabad', 'Naypyidaw'],
  },
  {
    color: 'purple',
    // None of these countries have any perennial (year-round) rivers
    label: 'Countries With No Permanent Rivers',
    tiles: ['Malta', 'Bahrain', 'Maldives', 'Saudi Arabia'],
  },
  {
    color: 'purple',
    // Australia→Canberra/Sydney, Canada→Ottawa/Toronto,
    // Nigeria→Abuja/Lagos, Brazil→Brasília/São Paulo
    label: "Countries Whose Capital Is Not Their Largest City",
    tiles: ['Australia', 'Canada', 'Nigeria', 'Brazil'],
  },
  {
    color: 'purple',
    // Switzerland 4 · Singapore 4 · South Africa 11 · Bolivia 37
    label: 'Countries With Four or More Official Languages',
    tiles: ['Switzerland', 'Singapore', 'South Africa', 'Bolivia'],
  },
  {
    color: 'purple',
    // Texas (Republic of Texas 1836–1845), Hawaii (Kingdom of Hawaii until 1898),
    // Vermont (Vermont Republic 1777–1791), California (Bear Flag Republic 1846)
    label: 'US States That Were Once Independent Nations or Republics',
    tiles: ['Texas', 'Hawaii', 'Vermont', 'California'],
  },
  {
    color: 'purple',
    // Vatican City & San Marino (inside Italy), Lesotho & Eswatini (southern Africa)
    label: 'Countries Completely Surrounded by Other Countries',
    tiles: ['Vatican City', 'San Marino', 'Lesotho', 'Eswatini'],
  },
  {
    color: 'purple',
    // The only place on Earth where four US states share a single point
    label: 'US States That Meet at the Four Corners Monument',
    tiles: ['Colorado', 'Utah', 'Arizona', 'New Mexico'],
  },
  {
    color: 'purple',
    // Karachi (Pakistan until 1966), Kolkata (British India until 1911),
    // Rio de Janeiro (Brazil until 1960), Melbourne (Australia until 1927)
    label: "Cities That Were Once Their Country's Capital but No Longer Are",
    tiles: ['Karachi', 'Kolkata', 'Rio de Janeiro', 'Melbourne'],
  },
  {
    color: 'purple',
    // All declared or restored independence between 1991–1993
    label: 'Countries That Became Independent in the 1990s',
    tiles: ['Estonia', 'Slovenia', 'Croatia', 'Eritrea'],
  },
]

// ─── Daily Puzzle Generator ───────────────────────────────────────────────────

/**
 * Returns today's puzzle by:
 *  1. Splitting the bank into 4 color buckets.
 *  2. For each color, shuffling the bucket with a date+color seed so the
 *     order changes every day (and resets with a new shuffle each epoch).
 *  3. Walking the shuffled bucket and picking the first category whose tiles
 *     don't conflict with any already-selected category.
 *
 * The result is always deterministic for a given UTC calendar date.
 */
export function getDailyPuzzle(extraCategories = []) {
  const now = new Date()
  const dayIndex = Math.floor(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000
  )

  // Merge static bank with AI-generated extras from Firestore
  const fullBank = [...categoryBank, ...extraCategories]

  const COLORS = ['yellow', 'green', 'blue', 'purple']
  // Large prime offsets keep each color's seed well-separated from the others
  const COLOR_OFFSETS = [0, 100003, 200017, 300041]

  const selected = []
  const usedTiles = new Set()

  COLORS.forEach((color, ci) => {
    const pool = fullBank.filter(c => c.color === color)
    const n = pool.length

    // Within each "epoch" (n days) every category appears exactly once,
    // then a new shuffle begins. The epoch seed changes each cycle.
    const epoch = Math.floor(dayIndex / n)
    const posWithinEpoch = dayIndex % n

    // Shuffle with epoch seed for the broad ordering, then rotate by day
    // so consecutive days pull successive entries from the shuffled list.
    const shuffled = seededShuffle(pool, epoch * 999983 + COLOR_OFFSETS[ci])
    // Rotate so today starts at posWithinEpoch, then wraps around
    const ordered = [
      ...shuffled.slice(posWithinEpoch),
      ...shuffled.slice(0, posWithinEpoch),
    ]

    for (const cat of ordered) {
      if (!cat.tiles.some(t => usedTiles.has(t))) {
        selected.push(cat)
        cat.tiles.forEach(t => usedTiles.add(t))
        break
      }
    }
  })

  return {
    id: dayIndex,
    title: `Puzzle #${dayIndex}`,
    categories: selected,
  }
}
