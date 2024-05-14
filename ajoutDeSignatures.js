const fs = require('fs');

const fileInput = document.getElementById('fileInput');
const submitButton = document.getElementById('submitButton');

submitButton.addEventListener('click', (event) => {
  event.preventDefault(); // empêche le rechargement de la page
  const file = fileInput.files[0]; // récupère le premier fichier sélectionné

  const destination = "C:/Users/gaetan.dapvril/Desktop/Resource projet dev/signature versions/Signature v20"; // chemin de la racine de l'application
  fs.copyFile(file.path, `${destination}/template.hbs`, (error) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Fichier copié avec succès dans la racine de l\'application');
      alert("Votre fichier template.hbs a bien été ajouté");
    }
  });
});
