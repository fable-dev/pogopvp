// Simple mock PvP "knowledge base" for a few sample Pokémon.
// We will replace/expand this with real data later.
const pokemonPvPData = {
  azumarill: {
    name: "Azumarill",
    leagues: {
      great: {
        idealCpRange: [1450, 1500],
        summary:
          "Bulky Fairy/Water that walls Fighters and Darks. Core pick in Great League.",
        role: "Bulky generalist",
        difficulty: "Easy to use",
        keyWins: ["Medicham", "Sableye", "Lanturn"],
        keyLosses: ["Trevanant", "Venusaur", "Registeel"],
      },
      ultra: {
        idealCpRange: [2200, 2500],
        summary:
          "Playable but less common in Ultra; often outclassed by other bulky Waters.",
        role: "Off-meta specialist",
        difficulty: "Medium",
        keyWins: ["Giratina (Altered)", "Cobalion (sometimes)"],
        keyLosses: ["Trevenant", "Tapu Fini"],
      },
      master: null,
    },
  },
  medicham: {
    name: "Medicham",
    leagues: {
      great: {
        idealCpRange: [1400, 1500],
        summary:
          "Top-tier Fighter with incredible coverage and bulk after XL investment.",
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
    name: "Lanturn",
    leagues: {
      great: {
        idealCpRange: [1400, 1500],
        summary:
          "Bulky Electric/Water that farms Flyers and chunks most neutrals.",
        role: "Anti-flyer tank",
        difficulty: "Easy",
        keyWins: ["Noctowl", "Pelipper", "Walrein"],
        keyLosses: ["Trevenant", "Altaria", "Medicham"],
      },
      ultra: {
        idealCpRange: [2200, 2500],
        summary:
          "Can function as a bulky Electric in Ultra, but is more niche.",
        role: "Niche pick",
        difficulty: "Medium",
        keyWins: ["Empoleon", "Talonflame"],
        keyLosses: ["Grass types", "Giratina"],
      },
      master: null,
    },
  },
};

// League caps for basic validation
const leagueCaps = {
  great: 1500,
  ultra: 2500,
  master: Infinity,
};

function formatList(list) {
  if (!list || !list.length) return "No data yet.";
  return list.join(", ");
}

function createResultsHtml({ pokemon, leagueKey, cp }) {
  const leagueData = pokemonPvPData[pokemon].leagues[leagueKey];
  const leagueName =
    leagueKey === "great"
      ? "Great League"
      : leagueKey === "ultra"
      ? "Ultra League"
      : "Master League";

  const cap = leagueCaps[leagueKey];
  const withinCap = cp <= cap;
  const idealRange = leagueData?.idealCpRange || null;

  let statusBadgeClass = "badge--warn";
  let statusText = "Rough Check";

  if (!withinCap && leagueKey !== "master") {
    statusBadgeClass = "badge--danger";
    statusText = "Above League Cap";
  } else if (idealRange && cp >= idealRange[0] && cp <= idealRange[1]) {
    statusBadgeClass = "badge--good";
    statusText = "Close to Ideal Range";
  }

  const idealText = idealRange
    ? `${idealRange[0]}–${idealRange[1]} CP is a rough 'sweet spot' for this league.`
    : "This Pokémon is not commonly used in this league or data is not yet available.";

  const cpComment =
    leagueKey === "master"
      ? "Master League has no CP cap; focus on level, IVs, and moves."
      : withinCap
      ? `Your entered CP (${cp}) is within the ${leagueName} limit of ${cap}.`
      : `Your entered CP (${cp}) is above the ${leagueName} limit of ${cap}. It cannot be used in this league at this CP.`;

  return `
    <div class="results-header">
      <div>
        <div class="results-title">
          ${pokemonPvPData[pokemon].name} – ${leagueName}
        </div>
        <div class="results-meta">
          <span class="badge ${statusBadgeClass}">${statusText}</span>
          <span class="badge">CP: ${cp}</span>
        </div>
      </div>
    </div>

    <div class="results-grid">
      <div class="results-highlight">
        <div class="results-block-title">Summary</div>
        <div class="results-block-body">
          ${leagueData ? leagueData.summary : "We do not yet have PvP info for this combination."}
        </div>
      </div>

      <div class="results-highlight">
        <div class="results-block-title">Role & Difficulty</div>
        <div class="results-block-body">
          <strong>Role:</strong> ${leagueData?.role || "Unknown"}<br/>
          <strong>Difficulty:</strong> ${leagueData?.difficulty || "Unknown"}
        </div>
      </div>

      <div class="results-highlight">
        <div class="results-block-title">CP Evaluation</div>
        <div class="results-block-body">
          ${cpComment}<br/>
          ${idealText}
        </div>
      </div>

      <div class="results-highlight">
        <div class="results-block-title">Key Wins</div>
        <div class="results-block-body">
          ${leagueData ? formatList(leagueData.keyWins) : "No data yet."}
        </div>
      </div>

      <div class="results-highlight">
        <div class="results-block-title">Key Losses</div>
        <div class="results-block-body">
          ${leagueData ? formatList(leagueData.keyLosses) : "No data yet."}
        </div>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("pvp-form");
  const resultsCard = document.getElementById("results-card");
  const resultsContent = document.getElementById("results-content");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const pokemon = document.getElementById("pokemon-select").value;
    const cpRaw = document.getElementById("cp-input").value;
    const leagueKey = document.getElementById("league-select").value;

    const cp = Number(cpRaw);

    if (!pokemon || !leagueKey || !cp || cp <= 0) {
      alert("Please select a Pokémon, league, and enter a valid CP.");
      return;
    }

    const pokemonData = pokemonPvPData[pokemon];
    if (!pokemonData) {
      resultsContent.innerHTML =
        "<p>We don't have data for that Pokémon yet. Please try another.</p>";
      resultsCard.classList.remove("hidden");
      return;
    }

    const leagueData = pokemonData.leagues[leagueKey];
    if (!leagueData) {
      resultsContent.innerHTML = `
        <p>
          ${pokemonData.name} is not commonly used in this league, or we don't have data yet.
          You can still use it, but performance may be limited.
        </p>
      `;
      resultsCard.classList.remove("hidden");
      return;
    }

    const html = createResultsHtml({ pokemon, leagueKey, cp });
    resultsContent.innerHTML = html;
    resultsCard.classList.remove("hidden");
    resultsCard.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
