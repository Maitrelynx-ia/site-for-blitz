// frontend/js/scripts.js

async function getAccounts() {
  try {
    const response = await fetch('/auth/accounts');
    const data = await response.json();
    console.log(data);  // Affiche la réponse dans la console
  } catch (error) {
    console.error("Erreur lors de la récupération des comptes:", error);
  }
}

getAccounts();  // Appelle la fonction pour récupérer la liste des comptes
