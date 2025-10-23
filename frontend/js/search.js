document.addEventListener("DOMContentLoaded", () => {
  async function fetchResults() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    if (!query) return;

    const resultsDiv = document.getElementById("results");

    try {
      // Rechercher les joueurs
      const playerResponse = await fetch(`/api/search-player?q=${query}`);
      const playerData = await playerResponse.json();

      // Rechercher les chars
      const tankResponse = await fetch('/api/tanks-list');
      const tankData = await tankResponse.json();

      let html = "";

      // Afficher les résultats des joueurs
      if (playerData.status === "ok" && playerData.data && playerData.data.length > 0) {
        playerData.data.forEach(player => {
          html += `
            <div>
              <h3>👤 Joueur trouvé: ${player.nickname}</h3>
              <p><strong>ID:</strong> ${player.account_id}</p>
            </div>
            <hr/>
          `;
        });
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

      if (!html.trim()) html = "<p>Aucun résultat trouvé.</p>";
      resultsDiv.innerHTML = html;
    } catch (error) {
      console.error("Erreur:", error);
      resultsDiv.innerHTML = "<p style='color:red;'>Erreur lors de la recherche.</p>";
    }
  }

  fetchResults();
});
