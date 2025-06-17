document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("search-container");
  if (!container) return;

  fetch("search-bar.html")
    .then(res => res.text())
    .then(html => {
      container.innerHTML = html;

      const searchForm = document.getElementById("search-form");
      const tankForm = document.getElementById("tank-form");

      searchForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const nickname = document.getElementById("search-nick").value;
        const resultDiv = document.getElementById("search-result");
        try {
          const res = await fetch("/auth/login-nick", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nickname })
          });
          const data = await res.json();
          if (res.ok) {
            const stats = data.user.stats;
            resultDiv.innerHTML = `
              <h3>${data.user.nickname}</h3>
              <p>Batailles : ${stats.battles}</p>
              <p>Victoires : ${stats.wins}</p>
              <p>Dégâts moyen : ${stats.damage_dealt}</p>
              <p>XP moyen : ${stats.xp}</p>
            `;
          } else {
            resultDiv.innerHTML = `<p style="color:red;">${data.message}</p>`;
          }
        } catch {
          resultDiv.innerHTML = `<p style="color:red;">Erreur lors de la recherche</p>`;
        }
      });

      tankForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const tankName = document.getElementById("search-tank").value;
        const tankResult = document.getElementById("tank-result");
        try {
          const res = await fetch(`/api/tanks/search?name=${encodeURIComponent(tankName)}`);
          const data = await res.json();
          if (res.ok && data.tank) {
            const tank = data.tank;
            tankResult.innerHTML = `
              <h3>${tank.name}</h3>
              <p>Nation: ${tank.nation}</p>
              <p>Niveau: ${tank.tier}</p>
              <p>Type: ${tank.type}</p>
            `;
          } else {
            tankResult.innerHTML = `<p style="color:red;">Aucun char trouvé.</p>`;
          }
        } catch {
          tankResult.innerHTML = `<p style="color:red;">Erreur lors de la recherche</p>`;
        }
      });
    });
});
