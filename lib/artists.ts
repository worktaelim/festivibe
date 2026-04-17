export type Day = "fri" | "sat" | "sun";

export interface Artist {
  id: string;
  name: string;
  day: Day;
  stage?: string;
  startTime?: string; // 24h, e.g. "16:00"; past midnight uses 24+ e.g. "25:00"
  endTime?: string;
}

export const STAGES = [
  "Coachella Stage",
  "Outdoor Theater",
  "Sahara",
  "Gobi",
  "Mojave",
  "Sonora",
  "Yuma",
  "Quasar",
] as const;

export const ARTISTS: Artist[] = [
  // ── Friday Apr 10 ────────────────────────────────────────────
  // Coachella Stage
  { id: "record-safari", name: "Record Safari", day: "fri", stage: "Coachella Stage", startTime: "16:15", endTime: "17:20" },
  { id: "teddy-swims", name: "Teddy Swims", day: "fri", stage: "Coachella Stage", startTime: "17:30", endTime: "18:20" },
  { id: "the-xx", name: "the xx", day: "fri", stage: "Coachella Stage", startTime: "19:00", endTime: "19:55" },
  { id: "sabrina-carpenter", name: "Sabrina Carpenter", day: "fri", stage: "Coachella Stage", startTime: "21:05", endTime: "22:35" },
  { id: "anyma", name: "Anyma", day: "fri", stage: "Coachella Stage", startTime: "24:00" },

  // Outdoor Theater
  { id: "tiffany-tyson", name: "Tiffany Tyson", day: "fri", stage: "Outdoor Theater", startTime: "14:50", endTime: "15:50" },
  { id: "dabeull", name: "Dabeull", day: "fri", stage: "Outdoor Theater", startTime: "16:00", endTime: "16:50" },
  { id: "lykke-li", name: "Lykke Li", day: "fri", stage: "Outdoor Theater", startTime: "17:20", endTime: "18:10" },
  { id: "dijon", name: "Dijon", day: "fri", stage: "Outdoor Theater", startTime: "18:40", endTime: "19:30" },
  { id: "turnstile", name: "Turnstile", day: "fri", stage: "Outdoor Theater", startTime: "20:05", endTime: "21:00" },
  { id: "disclosure", name: "Disclosure", day: "fri", stage: "Outdoor Theater", startTime: "22:35", endTime: "23:50" },

  // Sonora
  { id: "doom-dave", name: "Doom Dave", day: "fri", stage: "Sonora", startTime: "13:00", endTime: "13:40" },
  { id: "febuary", name: "Febuary", day: "fri", stage: "Sonora", startTime: "13:40", endTime: "14:10" },
  { id: "carolina-durante", name: "Carolina Durante", day: "fri", stage: "Sonora", startTime: "14:35", endTime: "15:15" },
  { id: "wednesday", name: "Wednesday", day: "fri", stage: "Sonora", startTime: "15:40", endTime: "16:20" },
  { id: "fleshwater", name: "Fleshwater", day: "fri", stage: "Sonora", startTime: "16:50", endTime: "17:30" },
  { id: "the-two-lips", name: "The Two Lips", day: "fri", stage: "Sonora", startTime: "18:00", endTime: "18:40" },
  { id: "ninajirachi", name: "Ninajirachi", day: "fri", stage: "Sonora", startTime: "19:10", endTime: "20:00" },
  { id: "cachirula-loojan", name: "Cachirula & Loojan", day: "fri", stage: "Sonora", startTime: "20:25", endTime: "21:05" },
  { id: "hot-mulligan", name: "Hot Mulligan", day: "fri", stage: "Sonora", startTime: "22:00", endTime: "22:45" },
  { id: "not-for-radio", name: "Not For Radio", day: "fri", stage: "Sonora", startTime: "23:50", endTime: "24:50" },

  // Gobi
  { id: "cahuilla-bird-singers-and-dancers", name: "Cahuilla Bird Singers and Dancers", day: "fri", stage: "Gobi", startTime: "14:15", endTime: "14:45" },
  { id: "bob-baker-marionettes", name: "Bob Baker Marionettes", day: "fri", stage: "Gobi", startTime: "14:55", endTime: "15:35" },
  { id: "newdad", name: "NewDad", day: "fri", stage: "Gobi", startTime: "16:00", endTime: "16:40" },
  { id: "joyce-manor", name: "Joyce Manor", day: "fri", stage: "Gobi", startTime: "17:10", endTime: "17:50" },
  { id: "cmat", name: "CMAT", day: "fri", stage: "Gobi", startTime: "18:15", endTime: "18:55" },
  { id: "fakemink", name: "fakemink", day: "fri", stage: "Gobi", startTime: "19:20", endTime: "20:00" },
  { id: "holly-humberstone", name: "Holly Humberstone", day: "fri", stage: "Gobi", startTime: "20:25", endTime: "21:10" },
  { id: "joost", name: "Joost", day: "fri", stage: "Gobi", startTime: "21:50", endTime: "22:35" },
  { id: "creepy-nuts", name: "Creepy Nuts", day: "fri", stage: "Gobi", startTime: "23:05", endTime: "23:55" },

  // Mojave
  { id: "novasoul", name: "Novasoul", day: "fri", stage: "Mojave", startTime: "14:00", endTime: "14:50" },
  { id: "slayyyter", name: "Slayyyter", day: "fri", stage: "Mojave", startTime: "15:00", endTime: "15:45" },
  { id: "bini", name: "BINI", day: "fri", stage: "Mojave", startTime: "16:15", endTime: "17:00" },
  { id: "central-cee", name: "Central Cee", day: "fri", stage: "Mojave", startTime: "17:30", endTime: "18:15" },
  { id: "devo", name: "Devo", day: "fri", stage: "Mojave", startTime: "18:45", endTime: "19:40" },
  { id: "moby", name: "Moby", day: "fri", stage: "Mojave", startTime: "20:10", endTime: "21:00" },
  { id: "ethel-cain", name: "Ethel Cain", day: "fri", stage: "Mojave", startTime: "22:35", endTime: "23:25" },
  { id: "blood-orange", name: "Blood Orange", day: "fri", stage: "Mojave", startTime: "23:55", endTime: "24:45" },

  // Sahara
  { id: "massio", name: "MASSIO", day: "fri", stage: "Sahara", startTime: "14:30", endTime: "15:35" },
  { id: "youna", name: "Youna", day: "fri", stage: "Sahara", startTime: "15:45", endTime: "16:35" },
  { id: "hugel", name: "HUGEL", day: "fri", stage: "Sahara", startTime: "16:50", endTime: "17:50" },
  { id: "marlon-hoffstadt", name: "Marlon Hoffstadt", day: "fri", stage: "Sahara", startTime: "18:15", endTime: "19:15" },
  { id: "katseye", name: "KATSEYE", day: "fri", stage: "Sahara", startTime: "20:00", endTime: "20:45" },
  { id: "levity", name: "Levity", day: "fri", stage: "Sahara", startTime: "21:15", endTime: "22:20" },
  { id: "swae-lee", name: "Swae Lee", day: "fri", stage: "Sahara", startTime: "22:50", endTime: "23:40" },
  { id: "sexyy-red", name: "Sexyy Red", day: "fri", stage: "Sahara", startTime: "24:05", endTime: "24:55" },

  // Yuma
  { id: "sahar-z", name: "Sahar Z", day: "fri", stage: "Yuma", startTime: "13:00", endTime: "13:45" },
  { id: "jessica-brankka", name: "Jessica Brankka", day: "fri", stage: "Yuma", startTime: "13:45", endTime: "14:45" },
  { id: "arodes", name: "Arodes", day: "fri", stage: "Yuma", startTime: "14:45", endTime: "15:45" },
  { id: "groove-armada", name: "Groove Armada", day: "fri", stage: "Yuma", startTime: "15:45", endTime: "16:45" },
  { id: "rossi-x-chloe-caillet", name: "Rossi. x Chloé Caillet", day: "fri", stage: "Yuma", startTime: "16:45", endTime: "18:00" },
  { id: "kettama", name: "Kettama", day: "fri", stage: "Yuma", startTime: "18:00", endTime: "19:15" },
  { id: "prospa", name: "Prospa", day: "fri", stage: "Yuma", startTime: "19:15", endTime: "20:30" },
  { id: "max-dean-x-luke-dean", name: "Max Dean x Luke Dean", day: "fri", stage: "Yuma", startTime: "20:30", endTime: "21:45" },
  { id: "max-styler", name: "Max Styler", day: "fri", stage: "Yuma", startTime: "21:45", endTime: "23:15" },
  { id: "gordo", name: "Gordo", day: "fri", stage: "Yuma", startTime: "23:15", endTime: "24:55" },

  // Quasar
  { id: "tiga", name: "Tiga", day: "fri", stage: "Quasar", startTime: "17:00", endTime: "19:00" },
  { id: "deep-dish", name: "Deep Dish", day: "fri", stage: "Quasar", startTime: "19:00", endTime: "21:00" },
  { id: "pawsa", name: "PAWSA", day: "fri", stage: "Quasar", startTime: "21:00", endTime: "23:00" },

  // ── Saturday Apr 11 ──────────────────────────────────────────
  // Coachella Stage
  { id: "jaqck-glam", name: "Jaqck Glam", day: "sat", stage: "Coachella Stage", startTime: "16:15", endTime: "17:20" },
  { id: "addison-rae", name: "Addison Rae", day: "sat", stage: "Coachella Stage", startTime: "17:30", endTime: "18:20" },
  { id: "giveon", name: "GIVĒON", day: "sat", stage: "Coachella Stage", startTime: "19:00", endTime: "19:50" },
  { id: "the-strokes", name: "The Strokes", day: "sat", stage: "Coachella Stage", startTime: "21:00", endTime: "22:10" },
  { id: "justin-bieber", name: "Justin Bieber", day: "sat", stage: "Coachella Stage", startTime: "23:25" },

  // Outdoor Theater
  { id: "blondshell", name: "Blondshell", day: "sat", stage: "Outdoor Theater", startTime: "14:40", endTime: "15:25" },
  { id: "los-hermanos-flores", name: "Los Hermanos Flores", day: "sat", stage: "Outdoor Theater", startTime: "15:55", endTime: "16:45" },
  { id: "alex-g", name: "Alex G", day: "sat", stage: "Outdoor Theater", startTime: "17:10", endTime: "18:00" },
  { id: "sombr", name: "SOMBR", day: "sat", stage: "Outdoor Theater", startTime: "19:05", endTime: "19:55" },
  { id: "labrinth", name: "Labrinth", day: "sat", stage: "Outdoor Theater", startTime: "20:30", endTime: "21:25" },
  { id: "david-byrne", name: "David Byrne", day: "sat", stage: "Outdoor Theater", startTime: "22:20", endTime: "23:20" },

  // Sonora
  { id: "triste-juventud", name: "Triste Juventud", day: "sat", stage: "Sonora", startTime: "13:00", endTime: "14:00" },
  { id: "die-spitz", name: "Die Spitz", day: "sat", stage: "Sonora", startTime: "14:00", endTime: "14:40" },
  { id: "freak-slug", name: "Freak Slug", day: "sat", stage: "Sonora", startTime: "15:10", endTime: "15:50" },
  { id: "ecca-vandal", name: "Ecca Vandal", day: "sat", stage: "Sonora", startTime: "16:20", endTime: "17:00" },
  { id: "ceremony", name: "Ceremony", day: "sat", stage: "Sonora", startTime: "17:30", endTime: "18:10" },
  { id: "rusowsky", name: "rusowsky", day: "sat", stage: "Sonora", startTime: "18:40", endTime: "19:20" },
  { id: "54-ultra", name: "54 Ultra", day: "sat", stage: "Sonora", startTime: "19:50", endTime: "20:30" },
  { id: "mind-enterprises", name: "Mind Enterprises", day: "sat", stage: "Sonora", startTime: "21:45", endTime: "22:35" },

  // Gobi
  { id: "noga-erez", name: "Noga Erez", day: "sat", stage: "Gobi", startTime: "14:05", endTime: "14:50" },
  { id: "whatmore", name: "WHATMORE", day: "sat", stage: "Gobi", startTime: "16:05", endTime: "16:45" },
  { id: "luisa-sonza", name: "Luísa Sonza", day: "sat", stage: "Gobi", startTime: "17:10", endTime: "17:50" },
  { id: "geese", name: "Geese", day: "sat", stage: "Gobi", startTime: "18:15", endTime: "19:00" },
  { id: "davido", name: "Davido", day: "sat", stage: "Gobi", startTime: "19:50", endTime: "20:35" },
  { id: "bia", name: "BIA", day: "sat", stage: "Gobi", startTime: "21:00", endTime: "21:45" },
  { id: "morat", name: "Morat", day: "sat", stage: "Gobi", startTime: "22:10", endTime: "23:00" },

  // Mojave
  { id: "jack-white", name: "Jack White", day: "sat", stage: "Mojave", startTime: "15:00", endTime: "15:45" },
  { id: "fujii-kaze", name: "Fujii Kaze", day: "sat", stage: "Mojave", startTime: "16:30", endTime: "17:20" },
  { id: "royel-otis", name: "Royel Otis", day: "sat", stage: "Mojave", startTime: "17:50", endTime: "18:35" },
  { id: "taemin", name: "Taemin", day: "sat", stage: "Mojave", startTime: "19:30", endTime: "20:20" },
  { id: "pinkpantheress", name: "PinkPantheress", day: "sat", stage: "Mojave", startTime: "20:55", endTime: "21:45" },
  { id: "interpol", name: "Interpol", day: "sat", stage: "Mojave", startTime: "22:15", endTime: "23:15" },

  // Sahara
  { id: "seek-one", name: "Seek-One", day: "sat", stage: "Sahara", startTime: "14:00", endTime: "14:45" },
  { id: "teed", name: "TEED", day: "sat", stage: "Sahara", startTime: "14:50", endTime: "15:50" },
  { id: "zulan", name: "ZULAN", day: "sat", stage: "Sahara", startTime: "16:00", endTime: "16:50" },
  { id: "hamdi", name: "Hamdi", day: "sat", stage: "Sahara", startTime: "17:00", endTime: "17:55" },
  { id: "yousuke-yukimatsu", name: "¥ØUSUK€ ¥UK1MATSU", day: "sat", stage: "Sahara", startTime: "18:15", endTime: "19:10" },
  { id: "nine-inch-noize", name: "Nine Inch Noize", day: "sat", stage: "Sahara", startTime: "20:00", endTime: "20:45" },
  { id: "rezz", name: "REZZ", day: "sat", stage: "Sahara", startTime: "21:10", endTime: "22:05" },
  { id: "adriatique", name: "Adriatique", day: "sat", stage: "Sahara", startTime: "22:30", endTime: "23:25" },
  { id: "worship", name: "Worship", day: "sat", stage: "Sahara", startTime: "23:55", endTime: "24:55" },

  // Yuma
  { id: "yamagucci", name: "Yamagucci", day: "sat", stage: "Yuma", startTime: "13:00", endTime: "14:00" },
  { id: "genesi", name: "GENESI", day: "sat", stage: "Yuma", startTime: "14:00", endTime: "15:00" },
  { id: "riordan", name: "Riordan", day: "sat", stage: "Yuma", startTime: "15:00", endTime: "16:15" },
  { id: "mahmut-orhan", name: "Mahmut Orhan", day: "sat", stage: "Yuma", startTime: "16:15", endTime: "17:30" },
  { id: "ben-sterling", name: "Ben Sterling", day: "sat", stage: "Yuma", startTime: "17:30", endTime: "18:45" },
  { id: "sosa", name: "SOSA", day: "sat", stage: "Yuma", startTime: "18:45", endTime: "20:15" },
  { id: "bedouin", name: "Bedouin", day: "sat", stage: "Yuma", startTime: "20:15", endTime: "21:45" },
  { id: "boys-noize", name: "Boys Noize", day: "sat", stage: "Yuma", startTime: "21:45", endTime: "23:00" },
  { id: "armin-van-buuren-x-adam-beyer", name: "Armin van Buuren x Adam Beyer", day: "sat", stage: "Yuma", startTime: "23:00", endTime: "24:55" },

  // Quasar
  { id: "joezi", name: "Joezi", day: "sat", stage: "Quasar", startTime: "17:00", endTime: "19:00" },
  { id: "afrojack-x-shimza", name: "Afrojack x Shimza", day: "sat", stage: "Quasar", startTime: "19:00", endTime: "21:00" },
  { id: "david-guetta", name: "David Guetta", day: "sat", stage: "Quasar", startTime: "21:00", endTime: "23:00" },

  // ── Sunday Apr 12 ─────────────────────────────────────────────
  // Coachella Stage
  { id: "gabe-real", name: "Gabe Real", day: "sun", stage: "Coachella Stage", startTime: "14:45", endTime: "15:30" },
  { id: "tijuana-panthers", name: "Tijuana Panthers", day: "sun", stage: "Coachella Stage", startTime: "15:40", endTime: "16:15" },
  { id: "wet-leg", name: "Wet Leg", day: "sun", stage: "Coachella Stage", startTime: "16:45", endTime: "17:30" },
  { id: "major-lazer", name: "Major Lazer", day: "sun", stage: "Coachella Stage", startTime: "18:10", endTime: "19:10" },
  { id: "young-thug", name: "Young Thug", day: "sun", stage: "Coachella Stage", startTime: "19:50", endTime: "20:40" },
  { id: "karol-g", name: "KAROL G", day: "sun", stage: "Coachella Stage", startTime: "21:55" },

  // Outdoor Theater
  { id: "juicewon", name: "Juicewon", day: "sun", stage: "Outdoor Theater", startTime: "15:00", endTime: "15:50" },
  { id: "gigi-perez", name: "Gigi Perez", day: "sun", stage: "Outdoor Theater", startTime: "16:00", endTime: "16:45" },
  { id: "clipse", name: "CLIPSE", day: "sun", stage: "Outdoor Theater", startTime: "17:15", endTime: "18:10" },
  { id: "foster-the-people", name: "Foster the People", day: "sun", stage: "Outdoor Theater", startTime: "18:45", endTime: "19:40" },
  { id: "laufey", name: "Laufey", day: "sun", stage: "Outdoor Theater", startTime: "20:40", endTime: "21:40" },
  { id: "bigbang", name: "BIGBANG", day: "sun", stage: "Outdoor Theater", startTime: "22:30", endTime: "23:30" },

  // Sonora
  { id: "panda-and-chok", name: "Panda & Chok", day: "sun", stage: "Sonora", startTime: "13:00", endTime: "14:00" },
  { id: "glitterer", name: "Glitterer", day: "sun", stage: "Sonora", startTime: "14:00", endTime: "14:40" },
  { id: "model-actriz", name: "Model/Actriz", day: "sun", stage: "Sonora", startTime: "15:10", endTime: "15:50" },
  { id: "jane-remover", name: "Jane Remover", day: "sun", stage: "Sonora", startTime: "16:20", endTime: "17:00" },
  { id: "los-retros", name: "Los Retros", day: "sun", stage: "Sonora", startTime: "17:30", endTime: "18:10" },
  { id: "roz", name: "RØZ", day: "sun", stage: "Sonora", startTime: "18:40", endTime: "19:30" },
  { id: "drain", name: "DRAIN", day: "sun", stage: "Sonora", startTime: "20:00", endTime: "20:40" },
  { id: "french-police", name: "French Police", day: "sun", stage: "Sonora", startTime: "21:10", endTime: "22:00" },

  // Gobi
  { id: "flowerovlove", name: "flowerovlove", day: "sun", stage: "Gobi", startTime: "14:05", endTime: "14:35" },
  { id: "the-chats", name: "The Chats", day: "sun", stage: "Gobi", startTime: "15:00", endTime: "15:40" },
  { id: "cobrah", name: "COBRAH", day: "sun", stage: "Gobi", startTime: "16:05", endTime: "16:50" },
  { id: "oklou", name: "Oklou", day: "sun", stage: "Gobi", startTime: "17:15", endTime: "18:00" },
  { id: "black-flag", name: "Black Flag", day: "sun", stage: "Gobi", startTime: "18:30", endTime: "19:05" },
  { id: "tomora", name: "TOMORA", day: "sun", stage: "Gobi", startTime: "19:45", endTime: "20:35" },
  { id: "the-rapture", name: "The Rapture", day: "sun", stage: "Gobi", startTime: "21:05", endTime: "21:55" },

  // Mojave
  { id: "wyldeflower", name: "wyldeflower", day: "sun", stage: "Mojave", startTime: "14:30", endTime: "15:10" },
  { id: "samia", name: "Samia", day: "sun", stage: "Mojave", startTime: "15:15", endTime: "15:55" },
  { id: "little-simz", name: "Little Simz", day: "sun", stage: "Mojave", startTime: "16:25", endTime: "17:10" },
  { id: "suicidal-tendencies", name: "Suicidal Tendencies", day: "sun", stage: "Mojave", startTime: "17:35", endTime: "18:25" },
  { id: "iggy-pop", name: "Iggy Pop", day: "sun", stage: "Mojave", startTime: "19:10", endTime: "20:10" },
  { id: "fka-twigs", name: "FKA twigs", day: "sun", stage: "Mojave", startTime: "20:45", endTime: "22:00" },

  // Sahara
  { id: "loboman", name: "LOBOMAN", day: "sun", stage: "Sahara", startTime: "14:30", endTime: "15:30" },
  { id: "girl-math", name: "Girl Math (VNSSA x NALA)", day: "sun", stage: "Sahara", startTime: "15:35", endTime: "16:35" },
  { id: "bunt", name: "BUNT.", day: "sun", stage: "Sahara", startTime: "16:45", endTime: "17:45" },
  { id: "duke-dumont", name: "Duke Dumont", day: "sun", stage: "Sahara", startTime: "18:10", endTime: "19:10" },
  { id: "mochakk", name: "Mochakk", day: "sun", stage: "Sahara", startTime: "19:25", endTime: "20:25" },
  { id: "subtronics", name: "Subtronics", day: "sun", stage: "Sahara", startTime: "21:05", endTime: "22:05" },
  { id: "kaskade", name: "Kaskade", day: "sun", stage: "Sahara", startTime: "22:45", endTime: "23:55" },

  // Yuma
  { id: "leyora", name: "LE YORA", day: "sun", stage: "Yuma", startTime: "13:00", endTime: "14:00" },
  { id: "azzecca", name: "AZZECCA", day: "sun", stage: "Yuma", startTime: "14:00", endTime: "15:00" },
  { id: "and-friends", name: "&friends", day: "sun", stage: "Yuma", startTime: "15:00", endTime: "16:15" },
  { id: "mestiza", name: "MĚSTIZA", day: "sun", stage: "Yuma", startTime: "16:15", endTime: "17:30" },
  { id: "carlita-x-josh-baker", name: "Carlita x Josh Baker", day: "sun", stage: "Yuma", startTime: "17:30", endTime: "19:00" },
  { id: "royksopp", name: "Röyksopp", day: "sun", stage: "Yuma", startTime: "19:00", endTime: "20:30" },
  { id: "whomadewho", name: "WhoMadeWho", day: "sun", stage: "Yuma", startTime: "20:30", endTime: "22:00" },
  { id: "green-velvet-x-ayybo", name: "Green Velvet x AYYBO", day: "sun", stage: "Yuma", startTime: "22:00", endTime: "23:55" },

  // Quasar
  { id: "jazzy", name: "Jazzy", day: "sun", stage: "Quasar", startTime: "16:00", endTime: "18:00" },
  { id: "joy-anonymous", name: "JOY (Anonymous)", day: "sun", stage: "Quasar", startTime: "18:00", endTime: "20:00" },
  { id: "fatboy-slim", name: "Fatboy Slim", day: "sun", stage: "Quasar", startTime: "20:00", endTime: "22:00" },
];

export const ARTISTS_W2: Artist[] = [
  // ── Friday Apr 17 ─────────────────────────────────────────────
  // Coachella Stage
  { id: "jaqck-glam-w2", name: "Jaqck Glam", day: "fri", stage: "Coachella Stage", startTime: "16:10", endTime: "17:10" },
  { id: "teddy-swims-w2", name: "Teddy Swims", day: "fri", stage: "Coachella Stage", startTime: "17:20", endTime: "18:10" },
  { id: "the-xx-w2", name: "the xx", day: "fri", stage: "Coachella Stage", startTime: "19:00", endTime: "19:55" },
  { id: "sabrina-carpenter-w2", name: "Sabrina Carpenter", day: "fri", stage: "Coachella Stage", startTime: "21:00", endTime: "22:40" },
  { id: "anyma-w2", name: "Anyma", day: "fri", stage: "Coachella Stage", startTime: "24:00" },

  // Outdoor Theater
  { id: "jeremiah-red-w2", name: "Jeremiah Red", day: "fri", stage: "Outdoor Theater", startTime: "14:50", endTime: "15:50" },
  { id: "dabeull-w2", name: "Dabeull", day: "fri", stage: "Outdoor Theater", startTime: "16:00", endTime: "16:50" },
  { id: "lykke-li-w2", name: "Lykke Li", day: "fri", stage: "Outdoor Theater", startTime: "17:20", endTime: "18:10" },
  { id: "dijon-w2", name: "Dijon", day: "fri", stage: "Outdoor Theater", startTime: "18:40", endTime: "19:30" },
  { id: "turnstile-w2", name: "Turnstile", day: "fri", stage: "Outdoor Theater", startTime: "20:05", endTime: "21:00" },
  { id: "disclosure-w2", name: "Disclosure", day: "fri", stage: "Outdoor Theater", startTime: "22:40", endTime: "23:55" },

  // Sonora
  { id: "jim-smith-w2", name: "Jim Smith", day: "fri", stage: "Sonora", startTime: "13:00", endTime: "13:40" },
  { id: "febuary-w2", name: "Febuary", day: "fri", stage: "Sonora", startTime: "13:40", endTime: "14:10" },
  { id: "carolina-durante-w2", name: "Carolina Durante", day: "fri", stage: "Sonora", startTime: "14:35", endTime: "15:15" },
  { id: "wednesday-w2", name: "Wednesday", day: "fri", stage: "Sonora", startTime: "15:40", endTime: "16:20" },
  { id: "fleshwater-w2", name: "Fleshwater", day: "fri", stage: "Sonora", startTime: "16:50", endTime: "17:30" },
  { id: "the-two-lips-w2", name: "The Two Lips", day: "fri", stage: "Sonora", startTime: "18:00", endTime: "18:40" },
  { id: "ninajirachi-w2", name: "Ninajirachi", day: "fri", stage: "Sonora", startTime: "19:10", endTime: "20:00" },
  { id: "cachirula-loojan-w2", name: "Cachirula & Loojan", day: "fri", stage: "Sonora", startTime: "20:25", endTime: "21:05" },
  { id: "hot-mulligan-w2", name: "Hot Mulligan", day: "fri", stage: "Sonora", startTime: "22:10", endTime: "22:55" },

  // Gobi
  { id: "cahuilla-bird-singers-and-dancers-w2", name: "Cahuilla Bird Singers and Dancers", day: "fri", stage: "Gobi", startTime: "14:15", endTime: "14:45" },
  { id: "bob-baker-marionettes-w2", name: "Bob Baker Marionettes", day: "fri", stage: "Gobi", startTime: "14:55", endTime: "15:35" },
  { id: "newdad-w2", name: "NewDad", day: "fri", stage: "Gobi", startTime: "16:00", endTime: "16:40" },
  { id: "joyce-manor-w2", name: "Joyce Manor", day: "fri", stage: "Gobi", startTime: "17:10", endTime: "17:50" },
  { id: "cmat-w2", name: "CMAT", day: "fri", stage: "Gobi", startTime: "18:15", endTime: "18:55" },
  { id: "fakemink-w2", name: "fakemink", day: "fri", stage: "Gobi", startTime: "19:20", endTime: "20:00" },
  { id: "holly-humberstone-w2", name: "Holly Humberstone", day: "fri", stage: "Gobi", startTime: "20:25", endTime: "21:10" },
  { id: "joost-w2", name: "Joost", day: "fri", stage: "Gobi", startTime: "21:50", endTime: "22:35" },
  { id: "creepy-nuts-w2", name: "Creepy Nuts", day: "fri", stage: "Gobi", startTime: "23:05", endTime: "23:55" },

  // Mojave
  { id: "el-ethos-w2", name: "El Ethos", day: "fri", stage: "Mojave", startTime: "14:00", endTime: "14:50" },
  { id: "slayyyter-w2", name: "Slayyyter", day: "fri", stage: "Mojave", startTime: "15:00", endTime: "15:45" },
  { id: "bini-w2", name: "BINI", day: "fri", stage: "Mojave", startTime: "16:15", endTime: "17:00" },
  { id: "central-cee-w2", name: "Central Cee", day: "fri", stage: "Mojave", startTime: "17:30", endTime: "18:15" },
  { id: "devo-w2", name: "Devo", day: "fri", stage: "Mojave", startTime: "18:45", endTime: "19:40" },
  { id: "moby-w2", name: "Moby", day: "fri", stage: "Mojave", startTime: "20:10", endTime: "21:00" },
  { id: "ethel-cain-w2", name: "Ethel Cain", day: "fri", stage: "Mojave", startTime: "22:45", endTime: "23:35" },
  { id: "blood-orange-w2", name: "Blood Orange", day: "fri", stage: "Mojave", startTime: "24:00", endTime: "24:55" },

  // Sahara
  { id: "bad-gal-gali-w2", name: "Bad Gal Gali", day: "fri", stage: "Sahara", startTime: "14:30", endTime: "15:35" },
  { id: "youna-w2", name: "Youna", day: "fri", stage: "Sahara", startTime: "15:45", endTime: "16:35" },
  { id: "hugel-w2", name: "HUGEL", day: "fri", stage: "Sahara", startTime: "16:50", endTime: "17:50" },
  { id: "marlon-hoffstadt-w2", name: "Marlon Hoffstadt", day: "fri", stage: "Sahara", startTime: "18:15", endTime: "19:15" },
  { id: "katseye-w2", name: "KATSEYE", day: "fri", stage: "Sahara", startTime: "20:00", endTime: "20:45" },
  { id: "levity-w2", name: "Levity", day: "fri", stage: "Sahara", startTime: "21:15", endTime: "22:20" },
  { id: "swae-lee-w2", name: "Swae Lee", day: "fri", stage: "Sahara", startTime: "22:50", endTime: "23:40" },
  { id: "sexyy-red-w2", name: "Sexyy Red", day: "fri", stage: "Sahara", startTime: "24:05", endTime: "24:55" },

  // Yuma
  { id: "sahar-z-w2", name: "Sahar Z", day: "fri", stage: "Yuma", startTime: "13:00", endTime: "13:45" },
  { id: "jessica-brankka-w2", name: "Jessica Brankka", day: "fri", stage: "Yuma", startTime: "13:45", endTime: "14:45" },
  { id: "arodes-w2", name: "Arodes", day: "fri", stage: "Yuma", startTime: "14:45", endTime: "15:45" },
  { id: "groove-armada-w2", name: "Groove Armada", day: "fri", stage: "Yuma", startTime: "15:45", endTime: "17:00" },
  { id: "rossi-x-chloe-caillet-w2", name: "Rossi. x Chloé Caillet", day: "fri", stage: "Yuma", startTime: "17:00", endTime: "18:15" },
  { id: "kettama-w2", name: "Kettama", day: "fri", stage: "Yuma", startTime: "18:15", endTime: "19:30" },
  { id: "prospa-w2", name: "Prospa", day: "fri", stage: "Yuma", startTime: "19:30", endTime: "20:45" },
  { id: "max-dean-x-luke-dean-w2", name: "Max Dean x Luke Dean", day: "fri", stage: "Yuma", startTime: "20:45", endTime: "22:00" },
  { id: "max-styler-w2", name: "Max Styler", day: "fri", stage: "Yuma", startTime: "22:00", endTime: "23:15" },
  { id: "gordo-w2", name: "Gordo", day: "fri", stage: "Yuma", startTime: "23:15", endTime: "24:55" },

  // Quasar
  { id: "darco-w2", name: "Darco", day: "fri", stage: "Quasar", startTime: "17:00", endTime: "19:00" },
  { id: "franky-rizardo-w2", name: "Franky Rizardo", day: "fri", stage: "Quasar", startTime: "19:00", endTime: "21:00" },
  { id: "armin-van-buuren-x-adam-beyer-w2-fri", name: "Armin van Buuren x Adam Beyer", day: "fri", stage: "Quasar", startTime: "21:00", endTime: "23:00" },

  // ── Saturday Apr 18 ──────────────────────────────────────────
  // Coachella Stage
  { id: "record-safari-w2", name: "Record Safari", day: "sat", stage: "Coachella Stage", startTime: "16:10", endTime: "17:15" },
  { id: "addison-rae-w2", name: "Addison Rae", day: "sat", stage: "Coachella Stage", startTime: "17:25", endTime: "18:20" },
  { id: "giveon-w2", name: "GIVĒON", day: "sat", stage: "Coachella Stage", startTime: "19:00", endTime: "19:50" },
  { id: "the-strokes-w2", name: "The Strokes", day: "sat", stage: "Coachella Stage", startTime: "21:00", endTime: "22:10" },
  { id: "justin-bieber-w2", name: "Justin Bieber", day: "sat", stage: "Coachella Stage", startTime: "23:25" },

  // Outdoor Theater
  { id: "blondshell-w2", name: "Blondshell", day: "sat", stage: "Outdoor Theater", startTime: "14:40", endTime: "15:25" },
  { id: "los-hermanos-flores-w2", name: "Los Hermanos Flores", day: "sat", stage: "Outdoor Theater", startTime: "15:55", endTime: "16:45" },
  { id: "alex-g-w2", name: "Alex G", day: "sat", stage: "Outdoor Theater", startTime: "17:10", endTime: "18:00" },
  { id: "sombr-w2", name: "SOMBR", day: "sat", stage: "Outdoor Theater", startTime: "19:05", endTime: "19:55" },
  { id: "labrinth-w2", name: "Labrinth", day: "sat", stage: "Outdoor Theater", startTime: "20:30", endTime: "21:25" },
  { id: "david-byrne-w2", name: "David Byrne", day: "sat", stage: "Outdoor Theater", startTime: "22:25", endTime: "23:25" },

  // Sonora
  { id: "buster-jarvis-w2", name: "Buster Jarvis", day: "sat", stage: "Sonora", startTime: "13:00", endTime: "14:00" },
  { id: "die-spitz-w2", name: "Die Spitz", day: "sat", stage: "Sonora", startTime: "14:00", endTime: "14:40" },
  { id: "freak-slug-w2", name: "Freak Slug", day: "sat", stage: "Sonora", startTime: "15:10", endTime: "15:50" },
  { id: "ecca-vandal-w2", name: "Ecca Vandal", day: "sat", stage: "Sonora", startTime: "16:20", endTime: "17:00" },
  { id: "ceremony-w2", name: "Ceremony", day: "sat", stage: "Sonora", startTime: "17:30", endTime: "18:10" },
  { id: "rusowsky-w2", name: "rusowsky", day: "sat", stage: "Sonora", startTime: "18:40", endTime: "19:20" },
  { id: "54-ultra-w2", name: "54 Ultra", day: "sat", stage: "Sonora", startTime: "19:50", endTime: "20:30" },
  { id: "mind-enterprises-w2", name: "Mind Enterprises", day: "sat", stage: "Sonora", startTime: "21:45", endTime: "22:35" },

  // Gobi
  { id: "noga-erez-w2", name: "Noga Erez", day: "sat", stage: "Gobi", startTime: "14:05", endTime: "14:50" },
  { id: "whatmore-w2", name: "WHATMORE", day: "sat", stage: "Gobi", startTime: "16:00", endTime: "16:40" },
  { id: "luisa-sonza-w2", name: "Luísa Sonza", day: "sat", stage: "Gobi", startTime: "17:10", endTime: "17:50" },
  { id: "geese-w2", name: "Geese", day: "sat", stage: "Gobi", startTime: "18:15", endTime: "19:00" },
  { id: "davido-w2", name: "Davido", day: "sat", stage: "Gobi", startTime: "19:50", endTime: "20:35" },
  { id: "bia-w2", name: "BIA", day: "sat", stage: "Gobi", startTime: "21:00", endTime: "21:45" },
  { id: "morat-w2", name: "Morat", day: "sat", stage: "Gobi", startTime: "22:10", endTime: "23:00" },

  // Mojave
  { id: "kacey-musgraves-w2", name: "Kacey Musgraves", day: "sat", stage: "Mojave", startTime: "15:00", endTime: "15:50" },
  { id: "fujii-kaze-w2", name: "Fujii Kaze", day: "sat", stage: "Mojave", startTime: "16:30", endTime: "17:20" },
  { id: "royel-otis-w2", name: "Royel Otis", day: "sat", stage: "Mojave", startTime: "17:50", endTime: "18:35" },
  { id: "taemin-w2", name: "Taemin", day: "sat", stage: "Mojave", startTime: "19:30", endTime: "20:20" },
  { id: "pinkpantheress-w2", name: "PinkPantheress", day: "sat", stage: "Mojave", startTime: "20:55", endTime: "21:45" },
  { id: "interpol-w2", name: "Interpol", day: "sat", stage: "Mojave", startTime: "22:15", endTime: "23:15" },

  // Sahara
  { id: "fundido-w2", name: "Fundido", day: "sat", stage: "Sahara", startTime: "14:00", endTime: "14:45" },
  { id: "teed-w2", name: "TEED", day: "sat", stage: "Sahara", startTime: "14:50", endTime: "15:50" },
  { id: "zulan-w2", name: "ZULAN", day: "sat", stage: "Sahara", startTime: "16:00", endTime: "16:50" },
  { id: "hamdi-w2", name: "Hamdi", day: "sat", stage: "Sahara", startTime: "17:00", endTime: "17:55" },
  { id: "yousuke-yukimatsu-w2", name: "¥ØUSUK€ ¥UK1MATSU", day: "sat", stage: "Sahara", startTime: "18:15", endTime: "19:10" },
  { id: "nine-inch-noize-w2", name: "Nine Inch Noize", day: "sat", stage: "Sahara", startTime: "20:00", endTime: "20:45" },
  { id: "adriatique-w2", name: "Adriatique", day: "sat", stage: "Sahara", startTime: "21:15", endTime: "22:10" },
  { id: "worship-w2", name: "Worship", day: "sat", stage: "Sahara", startTime: "22:35", endTime: "23:35" },

  // Yuma
  { id: "yamagucci-w2", name: "Yamagucci", day: "sat", stage: "Yuma", startTime: "13:00", endTime: "14:00" },
  { id: "genesi-w2", name: "GENESI", day: "sat", stage: "Yuma", startTime: "14:00", endTime: "15:00" },
  { id: "riordan-w2", name: "Riordan", day: "sat", stage: "Yuma", startTime: "15:00", endTime: "16:15" },
  { id: "mahmut-orhan-w2", name: "Mahmut Orhan", day: "sat", stage: "Yuma", startTime: "16:15", endTime: "17:30" },
  { id: "ben-sterling-w2", name: "Ben Sterling", day: "sat", stage: "Yuma", startTime: "17:30", endTime: "18:45" },
  { id: "sosa-w2", name: "SOSA", day: "sat", stage: "Yuma", startTime: "18:45", endTime: "20:15" },
  { id: "bedouin-w2", name: "Bedouin", day: "sat", stage: "Yuma", startTime: "20:15", endTime: "21:45" },
  { id: "boys-noize-w2", name: "Boys Noize", day: "sat", stage: "Yuma", startTime: "21:45", endTime: "23:00" },
  { id: "armin-van-buuren-x-adam-beyer-w2-sat", name: "Armin van Buuren x Adam Beyer", day: "sat", stage: "Yuma", startTime: "23:00", endTime: "24:55" },

  // Quasar
  { id: "devault-w2", name: "Devault", day: "sat", stage: "Quasar", startTime: "17:00", endTime: "19:00" },
  { id: "madeon-w2", name: "Madeon", day: "sat", stage: "Quasar", startTime: "19:00", endTime: "20:15" },
  { id: "dj-snake-x-rl-grime-x-flosstradamus-w2", name: "DJ Snake x RL Grime x Flosstradamus", day: "sat", stage: "Quasar", startTime: "20:15", endTime: "21:45" },
  { id: "dj-snake-x-knock2-w2", name: "DJ Snake x Knock2", day: "sat", stage: "Quasar", startTime: "21:45", endTime: "23:00" },

  // ── Sunday Apr 19 ─────────────────────────────────────────────
  // Coachella Stage
  { id: "gabe-real-w2", name: "Gabe Real", day: "sun", stage: "Coachella Stage", startTime: "14:45", endTime: "15:30" },
  { id: "tijuana-panthers-w2", name: "Tijuana Panthers", day: "sun", stage: "Coachella Stage", startTime: "15:40", endTime: "16:15" },
  { id: "wet-leg-w2", name: "Wet Leg", day: "sun", stage: "Coachella Stage", startTime: "16:45", endTime: "17:30" },
  { id: "major-lazer-w2", name: "Major Lazer", day: "sun", stage: "Coachella Stage", startTime: "18:10", endTime: "19:10" },
  { id: "young-thug-w2", name: "Young Thug", day: "sun", stage: "Coachella Stage", startTime: "19:50", endTime: "20:40" },
  { id: "karol-g-w2", name: "KAROL G", day: "sun", stage: "Coachella Stage", startTime: "22:10" },

  // Outdoor Theater
  { id: "juicewon-w2", name: "Juicewon", day: "sun", stage: "Outdoor Theater", startTime: "15:00", endTime: "15:50" },
  { id: "gigi-perez-w2", name: "Gigi Perez", day: "sun", stage: "Outdoor Theater", startTime: "16:00", endTime: "16:45" },
  { id: "clipse-w2", name: "CLIPSE", day: "sun", stage: "Outdoor Theater", startTime: "17:15", endTime: "18:10" },
  { id: "foster-the-people-w2", name: "Foster the People", day: "sun", stage: "Outdoor Theater", startTime: "18:45", endTime: "19:40" },
  { id: "laufey-w2", name: "Laufey", day: "sun", stage: "Outdoor Theater", startTime: "20:45", endTime: "21:45" },
  { id: "bigbang-w2", name: "BIGBANG", day: "sun", stage: "Outdoor Theater", startTime: "22:30", endTime: "23:30" },

  // Sonora
  { id: "bulletballet-w2", name: "Bulletballet", day: "sun", stage: "Sonora", startTime: "13:00", endTime: "14:00" },
  { id: "glitterer-w2", name: "Glitterer", day: "sun", stage: "Sonora", startTime: "14:00", endTime: "14:40" },
  { id: "model-actriz-w2", name: "Model/Actriz", day: "sun", stage: "Sonora", startTime: "15:10", endTime: "15:50" },
  { id: "jane-remover-w2", name: "Jane Remover", day: "sun", stage: "Sonora", startTime: "16:20", endTime: "17:00" },
  { id: "los-retros-w2", name: "Los Retros", day: "sun", stage: "Sonora", startTime: "17:30", endTime: "18:10" },
  { id: "roz-w2", name: "RØZ", day: "sun", stage: "Sonora", startTime: "18:40", endTime: "19:30" },
  { id: "drain-w2", name: "DRAIN", day: "sun", stage: "Sonora", startTime: "20:00", endTime: "20:40" },
  { id: "french-police-w2", name: "French Police", day: "sun", stage: "Sonora", startTime: "21:10", endTime: "22:00" },

  // Gobi
  { id: "flowerovlove-w2", name: "flowerovlove", day: "sun", stage: "Gobi", startTime: "14:05", endTime: "14:35" },
  { id: "the-chats-w2", name: "The Chats", day: "sun", stage: "Gobi", startTime: "15:00", endTime: "15:40" },
  { id: "cobrah-w2", name: "COBRAH", day: "sun", stage: "Gobi", startTime: "16:05", endTime: "16:50" },
  { id: "oklou-w2", name: "Oklou", day: "sun", stage: "Gobi", startTime: "17:15", endTime: "18:00" },
  { id: "black-flag-w2", name: "Black Flag", day: "sun", stage: "Gobi", startTime: "18:30", endTime: "19:05" },
  { id: "tomora-w2", name: "TOMORA", day: "sun", stage: "Gobi", startTime: "19:45", endTime: "20:35" },
  { id: "the-rapture-w2", name: "The Rapture", day: "sun", stage: "Gobi", startTime: "21:05", endTime: "21:55" },

  // Mojave
  { id: "megatone-w2", name: "Megatone", day: "sun", stage: "Mojave", startTime: "14:30", endTime: "15:10" },
  { id: "samia-w2", name: "Samia", day: "sun", stage: "Mojave", startTime: "15:15", endTime: "15:55" },
  { id: "little-simz-w2", name: "Little Simz", day: "sun", stage: "Mojave", startTime: "16:25", endTime: "17:10" },
  { id: "suicidal-tendencies-w2", name: "Suicidal Tendencies", day: "sun", stage: "Mojave", startTime: "17:35", endTime: "18:25" },
  { id: "iggy-pop-w2", name: "Iggy Pop", day: "sun", stage: "Mojave", startTime: "19:10", endTime: "20:10" },
  { id: "fka-twigs-w2", name: "FKA twigs", day: "sun", stage: "Mojave", startTime: "20:45", endTime: "22:00" },

  // Sahara
  { id: "gingee-w2", name: "GINGEE", day: "sun", stage: "Sahara", startTime: "14:30", endTime: "15:30" },
  { id: "girl-math-w2", name: "Girl Math (VNSSA x NALA)", day: "sun", stage: "Sahara", startTime: "15:35", endTime: "16:35" },
  { id: "bunt-w2", name: "BUNT.", day: "sun", stage: "Sahara", startTime: "16:45", endTime: "17:45" },
  { id: "duke-dumont-w2", name: "Duke Dumont", day: "sun", stage: "Sahara", startTime: "18:10", endTime: "19:10" },
  { id: "mochakk-w2", name: "Mochakk", day: "sun", stage: "Sahara", startTime: "19:25", endTime: "20:25" },
  { id: "subtronics-w2", name: "Subtronics", day: "sun", stage: "Sahara", startTime: "21:05", endTime: "22:05" },
  { id: "kaskade-w2", name: "Kaskade", day: "sun", stage: "Sahara", startTime: "22:50", endTime: "23:55" },

  // Yuma
  { id: "leyora-w2", name: "LE YORA", day: "sun", stage: "Yuma", startTime: "13:00", endTime: "14:00" },
  { id: "azzecca-w2", name: "AZZECCA", day: "sun", stage: "Yuma", startTime: "14:00", endTime: "15:00" },
  { id: "and-friends-w2", name: "&friends", day: "sun", stage: "Yuma", startTime: "15:00", endTime: "16:15" },
  { id: "mestiza-w2", name: "MĚSTIZA", day: "sun", stage: "Yuma", startTime: "16:15", endTime: "17:30" },
  { id: "carlita-x-josh-baker-w2", name: "Carlita x Josh Baker", day: "sun", stage: "Yuma", startTime: "17:30", endTime: "19:00" },
  { id: "royksopp-w2", name: "Röyksopp", day: "sun", stage: "Yuma", startTime: "19:00", endTime: "20:30" },
  { id: "whomadewho-w2", name: "WhoMadeWho", day: "sun", stage: "Yuma", startTime: "20:30", endTime: "22:00" },
  { id: "green-velvet-x-ayybo-w2", name: "Green Velvet x AYYBO", day: "sun", stage: "Yuma", startTime: "22:00", endTime: "23:55" },

  // Quasar
  { id: "linska-w2", name: "Linska", day: "sun", stage: "Quasar", startTime: "16:00", endTime: "18:00" },
  { id: "lp-giobbi-w2", name: "LP Giobbi", day: "sun", stage: "Quasar", startTime: "18:00", endTime: "20:00" },
  { id: "sara-landrys-blood-oath-w2", name: "Sara Landry's Blood Oath", day: "sun", stage: "Quasar", startTime: "20:00", endTime: "22:00" },
];

export function getArtistsForWeek(week: 1 | 2): Artist[] {
  return week === 1 ? ARTISTS : ARTISTS_W2;
}

export const DAY_LABELS_W1: Record<Day, string> = {
  fri: "Fri Apr 10",
  sat: "Sat Apr 11",
  sun: "Sun Apr 12",
};

export const DAY_LABELS_W2: Record<Day, string> = {
  fri: "Fri Apr 17",
  sat: "Sat Apr 18",
  sun: "Sun Apr 19",
};

// Keep a default export for legacy use; prefer getDayLabels(week)
export const DAY_LABELS = DAY_LABELS_W2;

export function getDayLabels(week: 1 | 2): Record<Day, string> {
  return week === 1 ? DAY_LABELS_W1 : DAY_LABELS_W2;
}

/** Convert "HH:MM" string (with 24+ for past midnight) to minutes since midnight */
export function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
