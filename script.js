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

function formatTypes(types) {
  if (!types || !types.length) return "Unknown typing";
  return types.join(" · ");
}

function formatMoves(moves) {
  if (!moves) return "No move data yet.";
  const fast = moves.fast && moves.fast.length ? moves.fast.join(", ") : "N/A";
  const charge =
    moves.charge && moves.charge.length ? moves.charge.join(", ") : "N/A";
  return { fast, charge };
}

function createResultsHtml({ pokemonKey, leagueKey, cp }) {
  const mon = POKEMON_PVP_DATA[pokemonKey];
  const leagueData = mon.leagues[leagueKey];

  const leagueName =
    leagueKey === "great"
      ? "Great League"
      : leagueKey === "ultra"
      ? "Ultra League"
      : "Master League";

  const cap = leagueCaps[leagueKey];
  const withinCap = cp <= cap;
  const idealRange = leagueData?.idealCpRange || null;

  // Status badge based on CP vs ideal range
  let statusBadgeClass = "badge--warn";
  let statusText = "Rough Check";

  if (!withinCap && leagueKey !== "master") {
    statusBadgeClass = "badge--danger";
    statusText = "Above League Cap";
  } else if (idealRange && cp >= idealRange[0] && cp <= idealRange[1]) {
    statusBadgeClass = "badge--good";
    statusText = "Close to Ideal CP";
  }

  const idealText = idealRange
    ? `${idealRange[0]}–${idealRange[1]} CP is a rough sweet spot for this Pokémon in ${leagueName}.`
    : "This Pokémon is not commonly used in this league or data is not yet available.";

  const cpComment =
    leagueKey === "master"
      ? "Master League has no CP cap; focus on level, IVs, and moves instead of CP only."
      : withinCap
      ? `Your entered CP (${cp}) is within the ${leagueName} cap of ${cap}.`
      : `Your entered CP (${cp}) is above the ${leagueName} cap of ${cap}. It cannot be used in this league at this CP.`;

  const typesText = formatTypes(mon.types);
  const moveInfo = formatMoves(mon.moves);

  return `
    <div class="results-header">
      <div>
        <div class="results-title">
          ${mon.name} – ${leagueName}
        </div>
        <div class="results-meta">
          <span class="badge ${statusBadgeClass}">${statusText}</span>
          <span class="badge">CP: ${cp}</span>
          <span class="badge">${typesText}</span>
        </div>
      </div>
    </div>

    <div class="results-grid">
      <div class="results-highlight">
        <div class="results-block-title">Summary</div>
        <div class="results-block-body">
          ${
            leagueData
              ? leagueData.summary
              : "We do not yet have PvP info for this combination."
          }
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
        <div class="results-block-title">Typing & Moves</div>
        <div class="results-block-body">
          <strong>Typing:</strong> ${typesText}<br/>
          <strong>Fast Move(s):</strong> ${moveInfo.fast}<br/>
          <strong>Charge Move(s):</strong> ${moveInfo.charge}
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
          ${
            leagueData
              ? formatList(leagueData.keyWins)
              : "No matchup data yet."
          }
        </div>
      </div>

      <div class="results-highlight">
        <div class="results-block-title">Key Losses</div>
        <div class="results-block-body">
          ${
            leagueData
              ? formatList(leagueData.keyLosses)
              : "No matchup data yet."
          }
        </div>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("pvp-form");
  const resultsCard = document.getElementById("results-card");
  const resultsContent = document.getElementById("results-content");
  const pokemonSelect = document.getElementById("pokemon-select");

  // 1) Populate Pokémon dropdown from POKEMON_PVP_DATA
  if (pokemonSelect && typeof POKEMON_PVP_DATA === "object") {
    const entries = Object.entries(POKEMON_PVP_DATA);
    entries
      .sort((a, b) => a[1].name.localeCompare(b[1].name))
      .forEach(([key, mon]) => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = mon.name;
        pokemonSelect.appendChild(option);
      });
  }

  // 2) Handle form submission
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const pokemonKey = pokemonSelect.value;
    const cpRaw = document.getElementById("cp-input").value;
    const leagueKey = document.getElementById("league-select").value;
    const cp = Number(cpRaw);

    if (!pokemonKey || !leagueKey || !cp || cp <= 0) {
      alert("Please select a Pokémon, choose a league, and enter a valid CP.");
      return;
    }

    const mon = POKEMON_PVP_DATA[pokemonKey];
    if (!mon) {
      resultsContent.innerHTML =
        "<p>We don't have data for that Pokémon yet. Please try another.</p>";
      resultsCard.classList.remove("hidden");
      return;
    }

    const leagueData = mon.leagues[leagueKey];
    if (!leagueData) {
      resultsContent.innerHTML = `
        <p>
          ${mon.name} is not commonly used in this league, or we don't have data yet.
          You can still use it, but performance may be limited.
        </p>
      `;
      resultsCard.classList.remove("hidden");
      return;
    }

    const html = createResultsHtml({ pokemonKey, leagueKey, cp });
    resultsContent.innerHTML = html;
    resultsCard.classList.remove("hidden");
    resultsCard.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
