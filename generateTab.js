const handlebars = require('handlebars');
const fs = require('fs');
const htmlToRtf = require('html-to-rtf');
const Datastore = require('nedb');
const path = require('path');

// Fonction pour mettre à jour l'état des cases à cocher
function updateCheckboxesState() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const isChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
    const sendButton = document.getElementById("sendIfCheck");
    sendButton.classList.toggle("hide", !isChecked);
}

// Mapping des services
const serviceMapping = [
    "Général",
    "Service Informatique",
    "Service Comptabilité",
    "Service Voirie",
    "Service Bâtiment",
    "Service Jeunesse",
    "Service Petite Enfance",
    "Service Érim",
    "Service Projet Culturel",
    "Service Administration Générale",
    "Service SPASAD",
    "Service Cours D'Eau",
    "Service Développement Rural",
    "Service Aménagement Du Territoire",
    "Service Direction",
    "Service Déchet",
    "Service Aquatis",
    "Service RH",
];

// Récupérer la valeur du trieur
function getSelectValue() {
    updateCheckboxesState();
    const selectedValue = document.getElementById('list').value;
    return selectedValue;
}

// Nommer le tableau en fonction du service sélectionné
function nameTab() {
    const selectedService = serviceMapping[getSelectValue()] || "Service Général";
    const titleTable = document.getElementById("titleTable");
    titleTable.innerHTML = `Tableau ${selectedService}`;
}

// Génération des tableaux triés par services et leurs fonctionnalités
function displayTabTrie() {
    console.log("La valeur du trieur est égale à " + getSelectValue());
    nameTab();

    // Charger la BDD
    const db = new Datastore({
        filename: "data.db",
        autoload: true,
    });

    const trie = getSelectValue();

    // Définir les options de recherche en fonction de la valeur du trieur
    const searchOptions = trie !== "0" ? { service: trie } : {};

    // Récupérer le contenu de la base de données en fonction des options de recherche
    db.find(searchOptions, function (err, docs) {
        if (err) {
            console.error("Erreur lors de la recherche :", err);
            return;
        }

        console.log("*** docs = ", docs);

        const tableRegistre = document.getElementById("tableRegistre");
        const tableRows = tableRegistre.querySelectorAll("thead > tr");

        // Supprimer le contenu du tableau
        tableRows.forEach((el, i) => {
            if (i > 0) el.parentNode.removeChild(el);
        });

        // Construire le contenu du tableau
        docs.forEach(el => {
            // Création d'une ligne
            const row = tableRegistre.insertRow(1);
            
            // Création des cellules et injection du contenu
            const cell1 = row.insertCell(0);
            cell1.innerHTML = '<input type="checkbox" name="personne" id="' + el._id + '" class="visible">';
            
            const cell2 = row.insertCell(1);
            cell2.textContent = el.nom;
            cell2.style.cursor = "pointer"; // Ajouter un style de curseur pour indiquer que la cellule est copiable
            
            const cell3 = row.insertCell(2);
            cell3.textContent = el.prenom;
            cell3.style.cursor = "pointer"; // Ajouter un style de curseur
            
            const cell4 = row.insertCell(3);
            cell4.textContent = el.adresse;
            cell4.style.cursor = "pointer"; // Ajouter un style de curseur
            
            const cell5 = row.insertCell(4);
            cell5.textContent = el.poste;
            cell5.style.cursor = "pointer"; // Ajouter un style de curseur
            
            const cell6 = row.insertCell(5);
            cell6.textContent = el.endroit;
            cell6.style.cursor = "pointer"; // Ajouter un style de curseur
            
            const cell7 = row.insertCell(6);
            cell7.textContent = el.tel;
            cell7.style.cursor = "pointer"; // Ajouter un style de curseur
            
            const cell8 = row.insertCell(7);
            cell8.textContent = el.chemin;
            cell8.style.cursor = "pointer"; // Ajouter un style de curseur
            
            const cell9 = row.insertCell(8);
            cell9.innerHTML = '<button id="' + el.adresse + '" class="btn-edit"><i class="fas fa-edit"></i></button>';
            
            const cell10 = row.insertCell(9);
            cell10.innerHTML = '<button id="' + el.service + '" class="btn-trash"><i class="fa-solid fa-trash"></i></button>';

            // Ajoutez un gestionnaire d'événements 'click' aux cellules
            [cell2, cell3, cell4, cell5, cell6, cell7, cell8].forEach((cell) => {
                cell.addEventListener('click', () => {
                    const textToCopy = cell.textContent;
                    navigator.clipboard.writeText(textToCopy)
                        .then(() => {
                            console.log('Texte copié dans le presse-papiers:', textToCopy);
                        })
                        .catch((err) => {
                            console.error('Erreur lors de la copie du texte :', err);
                        });
                });
            });
                
                // Fonction pour copier le texte de la cellule au presse-papiers
                function copyCellText(cell) {
                    var textToCopy = cell.textContent;
                    navigator.clipboard.writeText(textToCopy).then(function () {
                    console.log('Texte copié dans le presse-papiers :', textToCopy);
                    }).catch(function (err) {
                    console.error('Erreur lors de la copie du texte :', err);
                    });
                }

                // Supprimer une ligne de la bdd et du tableau en appuyant sur le bouton rouge trash
                var btn = document.getElementById(el.service);
                btn.addEventListener('click', (event) => {

                    const db = new Datastore({
                        filename: "data.db",
                        autoload: true,
                    });
                    
                    // Vérifier si la base de données est chargée avant de l'utiliser
                    db.loadDatabase((err) => {
                        if (err) {
                            console.error("Erreur lors du chargement de la base de données :", err);
                        } else {
                            console.log("Base de données chargée avec succès.");
                            // Appeler la fonction displayTab au chargement de la page pour afficher le tableau initial
                            document.addEventListener('DOMContentLoaded', displayTabTrie);
                        }
                    });
                    
                    event.stopPropagation(); // Empêcher la propagation de l'événement
                    if (confirm("Êtes-vous sûr de vouloir supprimer définitivement " + el.nom + " " + el.prenom + " de la base de données ?") == true) {
                        console.log("*** Demande de suppression de ", el._id);
                        db.remove({ nom: el.nom }, function (err, nbRemoved) {
                            if (err != null) {
                                console.log("*** err = ", err);
                            }
                            console.log(nbRemoved + " lignes supprimées !");

                            // Après la suppression, réexécuter la fonction pour afficher le tableau mis à jour
                            displayTabTrie();
                        });
                        alert(el.nom + " " + el.prenom + " ne fait plus partie de la base de données et la suppression est irrévocable !");
                    } else {
                        alert("Aucun agent n'a été supprimé de la base de données.");
                    }
                });

                var btnEdit = document.getElementById(el.adresse);
                btnEdit.addEventListener('click', (event) => {

                    const formEdit = document.getElementById("form-edit");

                    // Ajouter un gestionnaire d'événement au clic sur le bouton
                      // Vérifier si la classe "hide" est actuellement présente
                      if (formEdit.classList.contains("hide")) {
                        // Si c'est le cas, la supprimer pour afficher l'élément
                        formEdit.classList.remove("hide");
                      } else {
                        // Sinon, l'ajouter pour masquer l'élément
                        formEdit.classList.add("hide");
                      }

                    var Nom = el.nom;
                    var Prenom = el.prenom

                    const titleName   = document.getElementById('titleN');
                    const titleSurname = document.getElementById('titleS');

                    titleName.textContent = Nom;
                    titleSurname.textContent = Prenom;

                    // Récupérez l'ID de la ligne à partir de l'attribut "id" du bouton
                    var ligneId = el._id

                    // inscrire automatiquement les informations remplis précédement dans le formulaire de modification :
                    // nom, prenom, poste, service, ect...
                    document.getElementById('idUpLigne').setAttribute('value', ligneId);

                    var nomUpLigne = el.nom;
                    document.getElementById('nomUpLigne').setAttribute('value', nomUpLigne);

                    var prenomUpLigne = el.prenom;
                    document.getElementById('prenomUpLigne').setAttribute('value', prenomUpLigne);

                    var posteUpLigne = el.poste;
                    document.getElementById('posteUpLigne').setAttribute('value', posteUpLigne);

                    var serviceUpLigne = el.service;
                    document.getElementById('serviceUpLigne').setAttribute('value', serviceUpLigne);

                    var endroitUpLigne = el.endroit;
                    document.getElementById('endroitUpLigne').setAttribute('value', endroitUpLigne);

                    var telUpLigne = el.tel;
                    document.getElementById('telUpLigne').setAttribute('value', telUpLigne);

                    var cheminUpPc = el.cheminPc;
                    document.getElementById('cheminUpPc').setAttribute('value', cheminUpPc);
                
                    // Maintenant, vous pouvez utiliser cette ligneId pour la mise à jour ou d'autres opérations
                    console.log('ID de la ligne sélectionnée :', ligneId);

                    // Émettez un événement IPC pour transmettre l'ID de la ligne au processus principal
                    ipc.send("updateLigneInDb", { ligneId }, displayTabTrie());
                });
            });

            // Créer un tableau vide pour stocker les ID des utilisateurs cochés
            var usersChecked = [];

            // Sélectionner toutes les cases à cocher dans le tableau
            var checkboxes = document.querySelectorAll('input[type="checkbox"]');

            // Ajouter un écouteur d'événements "change" à chaque case à cocher
            checkboxes.forEach(function (checkbox) {
                checkbox.addEventListener('change', function () {
                    if (this.checked) {
                        // Si la case est cochée, ajouter l'ID de l'utilisateur au tableau
                        usersChecked.push(this.id);

                        document.getElementById("sendIfCheck").classList.remove("hide");

                    } else {
                        // Si la case est décochée, supprimer l'ID de l'utilisateur du tableau
                        var index = usersChecked.indexOf(this.id);
                        if (index !== -1) {
                            usersChecked.splice(index, 1);
                        }

                        // Vérifier si le tableau est vide et masquer le bouton
                        if (usersChecked.length === 0) {
                            document.getElementById("sendIfCheck").classList.add("hide");

                            console.log('le tableau est vide');
                        }
                    }
                    // Afficher le tableau des utilisateurs cochés dans la console pour vérification
                    console.log(usersChecked);
                });
            });

            var send = document.getElementById("sendIfCheck");
            var task = false; // Initialisation en dehors de la promesse
            let db;
            let taskPromise = null; // Déclaration en dehors de la portée de l'événement
            
            send.addEventListener('click', () => {
                taskPromise = new Promise(function (resolve, reject) {
                    if (!task) {
                        console.log("Action effectuée !");
                        task = true;
            
                        // Charger le template à remplir (template.hbs)
                        const template = handlebars.compile(fs.readFileSync('template.hbs', 'utf8'));
            
                        // Connection à la BDD NeDB
                        db = new Datastore({
                            filename: "data.db",
                            autoload: true,
                        });
            
                        var processedCount = 0;
                        var totalRecords = usersChecked.length;
                        var recipientsReceived = []; // Stockez les destinataires qui ont reçu les fichiers
                        var recipientsNotReceived = []; // Stockez les destinataires qui n'ont pas reçu les fichiers
            
                        usersChecked.forEach(function (user) {
                            // Rechercher les données de l'utilisateur dans la BDD NeDB
                            db.findOne({ _id: user }, (err, record) => {
                                if (err) {
                                    console.error(err);
                                } else {
                                    // Remplir les champs du record avec les données de la BDD 
                                    const htm = template(record);
            
                                    // Appeler le chemin présent dans la BDD et ajouter le nom du fichier
                                    const directorys = `${record.chemin}/${record.nom}-${record.prenom} (${record.adresse}).htm`;
                                    const directorystxt = `${record.chemin}/${record.nom}-${record.prenom} (${record.adresse}).txt`;
            
                                    // Enregistrer les fichiers HTML dans leurs chemins respectifs avec leurs contenus respectifs
                                    fs.writeFileSync(directorys, htm);
                                    fs.writeFileSync(directorystxt, htm);
            
                                    // Enregistrer les fichiers RTF dans leurs chemins respectifs avec leurs contenus respectifs
                                    htmlToRtf.saveRtfInFile(`${record.chemin}/${record.nom}-${record.prenom} (${record.adresse}).rtf`, htmlToRtf.convertHtmlToRtf(htm));
            
                                    // Création du dossier et des trois fichiers générés normalement par Outlook
                                    const folderName = `${record.nom}-${record.prenom}_fichiers (${record.adresse})`;
                                    const folderPath = path.join(`${record.chemin}`, folderName);
            
                                    if (fs.existsSync(folderPath)) {
                                        fs.rmdirSync(folderPath, { recursive: true });
                                        console.log('Dossier existant supprimé.');
                                    }
            
                                    fs.mkdirSync(folderPath);
            
                                    const fileContent1 = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<a:clrMap xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>';
                                    const fileContent2 = `<xml xmlns:o="urn:schemas-microsoft-com:office:office">\n\t<o:MainFile HRef="../${record.nom}-${record.prenom} (${record.adresse}).htm"/>\n\t<o:File HRef="themedata.thmx"/>\n\t<o:File HRef="colorschememapping.xml"/>\n\t<o:File HRef="filelist.xml"/>\n</xml>`;
                                    const fileContent3 = '';
            
                                    fs.writeFileSync(path.join(folderPath, 'colorschememapping.xml'), fileContent1);
                                    fs.writeFileSync(path.join(folderPath, 'filelist.xml'), fileContent2);
                                    fs.writeFileSync(path.join(folderPath, 'themedata.thmx'), fileContent3);
            
                                    console.log('Dossier et fichiers créés avec succès.');
            
                                    recipientsReceived.push(`${record.nom} ${record.prenom}`); // Ajoutez à la liste des destinataires qui ont reçu les fichiers
            
                                    processedCount++;
            
                                    // Vérifier si toutes les opérations sont terminées
                                    if (processedCount === totalRecords) {
                                        if (recipientsReceived.length > 0) {
                                            alert("Signatures ont été envoyées à : " + recipientsReceived.join(", "));
                                            
                                        }
                                        if (recipientsNotReceived.length > 0) {
                                            alert("Signatures n'ont pas été envoyées à : " + recipientsNotReceived.join(", "));
                                            
                                        }
                                        resolve();
                                        window.location.reload()
                                    }
                                }
                            });
                        });
                        
                    } else {
                        reject("L'action a déjà été effectuée !");
                    }
                });
            
                taskPromise.then(function () {
                    console.log("La promesse a été résolue avec succès !");
                }).catch(function (erreur) {
                    console.log("La promesse a échoué : " + erreur);
                    alert("Une erreur s'est produite une ou plusieurs personne(s) n'a pas allumer sont ordinateur");
                }).finally(function () {
                    // À la fin de votre code de la tâche, réinitialisez la promesse à null
                    taskPromise = null;
                    task = false; // Réinitialiser la variable task
                    displayTabTrie()
                });
            });
        });
}
// Appeler la fonction displayTab au chargement de la page pour afficher le tableau initial
document.addEventListener('DOMContentLoaded', displayTabTrie);

module.exports = {
    displayTabTrie,
};