document.addEventListener("DOMContentLoaded", () => {
  // Login/logout toggle
  fetch("/auth/status")
    .then((res) => res.json())
    .then((data) => {
      const loginLogout = document.getElementById("login-logout");
      if (data.loggedIn) {
        loginLogout.textContent = "Se déconnecter";
        loginLogout.href = "/auth/logout";
      } else {
        loginLogout.textContent = "Se connecter";
        loginLogout.href = "login.html";
      }
    });

  // Donateurs
  fetch("/donate/donors")
    .then((res) => res.json())
    .then((donors) => {
      const container = document.getElementById("donors-list");
      if (container && donors.length) {
        container.innerHTML = "Merci à nos donateurs : " + donors.join(", ");
      }
    })
    .catch((err) => console.error("Erreur donateurs:", err));
});
