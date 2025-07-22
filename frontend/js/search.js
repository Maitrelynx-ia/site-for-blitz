document.addEventListener("DOMContentLoaded", function () {
  const quickSearchForm = document.getElementById("quick-search-form");
  if (!quickSearchForm) return;

  quickSearchForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const query = document.getElementById("quick-search").value.trim();

    if (!query) return;

    try {
      const playerRes = await fetch("/auth/login-nick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: query })
      });
      if (playerRes.ok) {
        const data = await playerRes.json();
        alert(`👤 Joueur trouvé : ${data.user.nickname} (${data.user.stats.battles} batailles)`);
        return;
      }
    } catch {}

    try {
      const tankRes = await fetch(`/api/tanks/search?name=${encodeURIComponent(query)}`);
      if (tankRes.ok) {
        const data = await tankRes.json();
        alert(`🚗 Char trouvé : ${data.tank.name} (Nation : ${data.tank.nation}, Tier : ${data.tank.tier})`);
        return;
      }
    } catch {}

    alert("❌ Aucun joueur ou char trouvé.");
  });
});
