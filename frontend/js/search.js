document.getElementById("global-search-form").addEventListener("submit", function (e) {
      e.preventDefault();
      const value = document.getElementById("global-search-input").value.trim();
      if (value) window.location.href = `search.html?q=${encodeURIComponent(value)}`;
    });

    async function fetchResults() {
      const params = new URLSearchParams(window.location.search);
      const query = params.get("q");
      if (!query) return;

      const resultsDiv = document.getElementById("results");

      try {
        const [playerRes, tankRes] = await Promise.all([
          fetch("/api/players/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nickname: query }),
          }),
          fetch(`/api/tanks/search?name=${encodeURIComponent(query)}`),
        ]);

        let html = "";

        // Player result
        if (playerRes.ok) {
          const playerData = await playerRes.json();
          html += `
            <h3>👤 Joueur trouvé: ${playerData.user.nickname}</h3>
            <p><strong>Batailles:</strong> ${playerData.user.stats.battles}</p>
            <p><strong>Victoires:</strong> ${playerData.user.stats.wins}</p>
            <p><strong>Dégâts moyens:</strong> ${playerData.user.stats.avg_damage}</p>
            <p><strong>XP moyen:</strong> ${playerData.user.stats.avg_xp}</p>
            <hr/>
          `;
        }

        // Tank result
        if (tankRes.ok) {
          const tankData = await tankRes.json();
          html += `
            <h3>🚗 Char trouvé: ${tankData.tank.name}</h3>
            <p><strong>Nation:</strong> ${tankData.tank.nation}</p>
            <p><strong>Niveau:</strong> ${tankData.tank.tier}</p>
            <p><strong>Type:</strong> ${tankData.tank.type}</p>
          `;
        }

        if (!html) html = "<p>Aucun résultat trouvé.</p>";
        resultsDiv.innerHTML = html;
      } catch (error) {
        resultsDiv.innerHTML = "<p style='color:red;'>Erreur lors de la recherche.</p>";
      }
    }

    fetchResults();