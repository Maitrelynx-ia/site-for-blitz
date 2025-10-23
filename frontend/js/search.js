import { searchPlayer, getTanksList } from './api.js';

document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("search-button");
  const searchInput = document.getElementById("global-search-input");

  searchButton.addEventListener("click", () => {
    const value = searchInput.value.trim();
    if (value) {
      window.location.href = `search.html?q=${encodeURIComponent(value)}`;
    }
  });

  async function fetchResults() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    if (!query) return;

    const resultsDiv = document.getElementById("results");

    try {
      // Rechercher les joueurs
      const playerData = await searchPlayer(query);
      // Rechercher les chars
      const tankData = await getTanksList(null, null); // Filtre optionnel par nation ou tier

      let html = "";

      // Afficher les résultats des joueurs
      if (playerData.status === "ok" && playerData.data.length > 0) {
        const player = playerData.data[0];
        html += `
          <h3>👤 Joueur trouvé: ${player.nickname}</h3>
          <p><strong>ID:</strong> ${player.account_id}</p>
          <hr/>
        `;
      } else {
        html += "<p>Aucun joueur trouvé.</p>";
      }

      // Afficher les résultats des chars
      if (tankData.status === "ok" && tankData.data) {
        const tanks = Object.values(tankData.data);
        const filteredTanks = tanks.filter(tank =>
          tank.name.toLowerCase().includes(query.toLowerCase())
        );

        if (filteredTanks.length > 0) {
          html += "<h3>🚗 Chars trouvés:</h3>";
          filteredTanks.forEach(tank => {
            html += `
              <p><strong>${tank.name}</strong> (Niveau: ${tank.tier}, Nation: ${tank.nation}, Type: ${tank.type})</p>
            `;
          });
        } else {
          html += "<p>Aucun char trouvé.</p>";
        }
      }

      if (!html) html = "<p>Aucun résultat trouvé.</p>";
      resultsDiv.innerHTML = html;
    } catch (error) {
      resultsDiv.innerHTML = "<p style='color:red;'>Erreur lors de la recherche.</p>";
    }
  }

  fetchResults();
});
