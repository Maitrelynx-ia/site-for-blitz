document.addEventListener("DOMContentLoaded", () => {
  fetch("/profile")
    .then((res) => res.json())
    .then((user) => {
      const stats = user.stats || {};
      const statsList = document.getElementById("stats-list");
      Object.entries(stats).forEach(([key, value]) => {
        const li = document.createElement("li");
        li.textContent = `${key.replace(/([A-Z])/g, ' $1')}: ${value}`;
        statsList.appendChild(li);
      });

      const replays = user.replays || [];
      const replayList = document.getElementById("replay-list");
      replays.forEach((r) => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${r.filePath}" download>${r.title}</a>`;
        replayList.appendChild(li);
      });

      const tips = user.tips || [];
      const tipList = document.getElementById("tip-list");
      tips.forEach((t) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${t.title}</strong><p>${t.content}</p>`;
        tipList.appendChild(li);
      });
    })
    .catch((err) => console.error("Erreur profil:", err));
});
