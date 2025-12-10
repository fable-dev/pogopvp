// Central PvP data store for the site.
// In later phases this can be moved to JSON or split by league.

const POKEMON_PVP_DATA = {
  azumarill: {
    id: "azumarill",
    name: "Azumarill",
    types: ["Water", "Fairy"],
    moves: {
      fast: ["Bubble"],
      charge: ["Play Rough", "Ice Beam", "Hydro Pump"],
    },
    leagues: {
      great: {
        idealCpRange: [1450, 1500],
        summary:
          "Bulky Water/Fairy that walls Fighters and many Darks. One of the classic Great League cores.",
        role: "Bulky generalist",
        difficulty: "Easy",
        keyWins: ["Medicham", "Sableye", "Lanturn"],
        keyLosses: ["Trevenant", "Registeel", "Lanturn (Electric)"],
      },
      ultra: {
        idealCpRange: [2200, 2500],
        summary:
          "Can function in some off-meta teams but generally overshadowed by other bulky Waters.",
        role: "Off-meta specialist",
        difficulty: "Medium",
        keyWins: ["Giratina (Altered)", "Cobalion (sometimes)"],
        keyLosses: ["Trevenant", "Tapu Fini", "Cobalion"],
      },
      master: null,
    },
  },

  medicham: {
    id: "medicham",
    name: "Medicham",
    types: ["Fighting", "Psychic"],
    moves: {
      fast: ["Counter"],
      charge: ["Ice Punch", "Psychic", "Power-Up Punch"],
    },
    leagues: {
      great: {
        idealCpRange: [1400, 1500],
        summary:
          "Top-tier Fighter with excellent bulk and coverage, especially with XL investment.",
        role: "Fighting corebreaker",
        difficulty: "Medium",
        keyWins: ["Registeel", "Galarian Stunfisk", "Lickitung"],
        keyLosses: ["Azumarill", "Noctowl", "Trevenant"],
      },
      ultra: null,
      master: null,
    },
  },

  lanturn: {
    id: "lanturn",
    name: "Lanturn",
    types: ["Water", "Electric"],
    moves: {
      fast: ["Spark", "Water Gun"],
      charge: ["Surf", "Thunderbolt"],
    },
    leagues: {
      great: {
        idealCpRange: [1400, 1500],
        summary:
          "Bulky Electric/Water that dominates Flyers and pressures many neutrals.",
        role: "Anti-flyer tank",
        difficulty: "Easy",
        keyWins: ["Noctowl", "Pelipper", "Walrein"],
        keyLosses: ["Trevenant", "Altaria", "Medicham"],
      },
      ultra: {
        idealCpRange: [2200, 2500],
        summary:
          "Niche but usable as a bulky Electric/Water in certain Ultra teams.",
        role: "Niche pick",
        difficulty: "Medium",
        keyWins: ["Empoleon", "Talonflame"],
        keyLosses: ["Grass types", "Giratina"],
      },
      master: null,
    },
  },

  // A few extra popular Great League picks as examples
  noctowl: {
    id: "noctowl",
    name: "Noctowl",
    types: ["Normal", "Flying"],
    moves: {
      fast: ["Wing Attack"],
      charge: ["Sky Attack", "Shadow Ball"],
    },
    leagues: {
      great: {
        idealCpRange: [1450, 1500],
        summary:
          "Bulky flyer that farms Fighters and Grasses, with Shadow Ball for neutral coverage.",
        role: "Safe swap / bulky flyer",
        difficulty: "Easy",
        keyWins: ["Medicham", "Trevenant (shields down)", "Venusaur"],
        keyLosses: ["Lanturn", "Bastiodon"],
      },
      ultra: null,
      master: null,
    },
  },

  sableye: {
    id: "sableye",
    name: "Sableye",
    types: ["Dark", "Ghost"],
    moves: {
      fast: ["Shadow Claw"],
      charge: ["Foul Play", "Return"],
    },
    leagues: {
      great: {
        idealCpRange: [1470, 1500],
        summary:
          "XL Sableye is a premier safe swap with incredible neutral coverage.",
        role: "Safe swap",
        difficulty: "Medium",
        keyWins: ["Trevenant", "Lickitung", "Defense Deoxys"],
        keyLosses: ["Azumarill", "Galarian Stunfisk", "Fairies"],
      },
      ultra: null,
      master: null,
    },
  },
};
