document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quick-search-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("quick-search");
      const query = input.value.trim();
      if (query) {
        // Redirection vers la page de recherche avec le paramètre dans l'URL
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
      }
    });
  }

  // Si on est sur search.html, lancer la recherche automatique
  if (window.location.pathname.includes("search.html")) {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    if (query) {
      doSearch(query);
    }
  }
});

async function doSearch(query) {
  const resultDiv = document.getElementById("results");
  resultDiv.innerHTML = "<p>Recherche en cours...</p>";

  try {
    const playerRes = await fetch("/auth/login-nick", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname: query })
    });
    if (playerRes.ok) {
      const data = await playerRes.json();
      const user = data.user;
      const stats = user.stats;
      resultDiv.innerHTML = `
        <h3>👤 Joueur trouvé : ${user.nickname}</h3>
        <p><strong>Batailles :</strong> ${stats.battles}</p>
        <p><strong>Victoires :</strong> ${stats.wins}</p>
        <p><strong>Dégâts moyen :</strong> ${stats.damage_dealt}</p>
        <p><strong>XP moyen :</strong> ${stats.xp}</p>
      `;
      return;
    }
  } catch {}

  try {
    const tankRes = await fetch(`/api/tanks/search?name=${encodeURIComponent(query)}`);
    if (tankRes.ok) {
      const data = await tankRes.json();
      const tank = data.tank;
      resultDiv.innerHTML = `
        <h3> Char trouvé : ${tank.name}</h3>
        <p><strong>Nation :</strong> ${tank.nation}</p>
        <p><strong>Niveau :</strong> ${tank.tier}</p>
        <p><strong>Type :</strong> ${tank.type}</p>
      `;
      return;
    }
  } catch {}

  resultDiv.innerHTML = `<p style="color:red;">❌ Aucun joueur ou char trouvé.</p>`;
}
