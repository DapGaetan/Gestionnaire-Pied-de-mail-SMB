const handlebars = require('handlebars');
const fs = require('fs');
const htmlToRtf = require('html-to-rtf');
const Datastore = require('nedb');
const path = require('path');

function updateCheckboxesState() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const isChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
    const sendButton = document.getElementById("sendIfCheck");
    sendButton.classList.toggle("hide", !isChecked);
}

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

function getSelectValue() {
    updateCheckboxesState();
    const selectedValue = document.getElementById('list').value;
    return selectedValue;
}

function nameTab() {
    const selectedService = serviceMapping[getSelectValue()] || "Service Général";
    const titleTable = document.getElementById("titleTable");
    titleTable.innerHTML = `Tableau ${selectedService}`;
}

function displayTabTrie() {
    console.log("La valeur du trieur est égale à " + getSelectValue());
    nameTab();

    const db = new Datastore({
        filename: "data.db",
        autoload: true,
    });

    const trie = getSelectValue();

    const searchOptions = trie !== "0" ? { service: trie } : {};

    db.find(searchOptions, function (err, docs) {
        if (err) {
            console.error("Erreur lors de la recherche :", err);
            return;
        }

        console.log("*** docs = ", docs);

        const tableRegistre = document.getElementById("tableRegistre");
        const tableRows = tableRegistre.querySelectorAll("thead > tr");

        tableRows.forEach((el, i) => {
            if (i > 0) el.parentNode.removeChild(el);
        });

        docs.forEach(el => {
            const row = tableRegistre.insertRow(1);
            const cell1 = row.insertCell(0);
            cell1.innerHTML = '<input type="checkbox" name="personne" id="' + el._id + '" class="visible">';
            
            const cell2 = row.insertCell(1);
            cell2.textContent = el.nom;
            cell2.style.cursor = "pointer";

            const cell3 = row.insertCell(2);
            cell3.textContent = el.prenom;
            cell3.style.cursor = "pointer"; 
            
            const cell4 = row.insertCell(3);
            cell4.textContent = el.adresse;
            cell4.style.cursor = "pointer"; 
            
            const cell5 = row.insertCell(4);
            cell5.textContent = el.poste;
            cell5.style.cursor = "pointer"; 
            
            const cell6 = row.insertCell(5);
            cell6.textContent = el.endroit;
            cell6.style.cursor = "pointer"; 
            
            const cell7 = row.insertCell(6);
            cell7.textContent = el.tel;
            cell7.style.cursor = "pointer"; 
            
            const cell8 = row.insertCell(7);
            cell8.textContent = el.chemin;
            cell8.style.cursor = "pointer"; 
            
            const cell9 = row.insertCell(8);
            cell9.innerHTML = '<button id="' + el.adresse + '" class="btn-edit"><i class="fas fa-edit"></i></button>';
            
            const cell10 = row.insertCell(9);
            cell10.innerHTML = '<button id="' + el.service + '" class="btn-trash"><i class="fa-solid fa-trash"></i></button>';

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
                
                function copyCellText(cell) {
                    var textToCopy = cell.textContent;
                    navigator.clipboard.writeText(textToCopy).then(function () {
                    console.log('Texte copié dans le presse-papiers :', textToCopy);
                    }).catch(function (err) {
                    console.error('Erreur lors de la copie du texte :', err);
                    });
                }

                var btn = document.getElementById(el.service);
                btn.addEventListener('click', (event) => {

                    const db = new Datastore({
                        filename: "data.db",
                        autoload: true,
                    });
                    
                    db.loadDatabase((err) => {
                        if (err) {
                            console.error("Erreur lors du chargement de la base de données :", err);
                        } else {
                            console.log("Base de données chargée avec succès.");
                            document.addEventListener('DOMContentLoaded', displayTabTrie);
                        }
                    });
                    
                    event.stopPropagation();
                    if (confirm("Êtes-vous sûr de vouloir supprimer définitivement " + el.nom + " " + el.prenom + " de la base de données ?") == true) {
                        console.log("*** Demande de suppression de ", el._id);
                        db.remove({ nom: el.nom }, function (err, nbRemoved) {
                            if (err != null) {
                                console.log("*** err = ", err);
                            }
                            console.log(nbRemoved + " lignes supprimées !");

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

                      if (formEdit.classList.contains("hide")) {
                        formEdit.classList.remove("hide");
                      } else {
                        formEdit.classList.add("hide");
                      }

                    var Nom = el.nom;
                    var Prenom = el.prenom

                    const titleName   = document.getElementById('titleN');
                    const titleSurname = document.getElementById('titleS');

                    titleName.textContent = Nom;
                    titleSurname.textContent = Prenom;

                    var ligneId = el._id

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
                
                    console.log('ID de la ligne sélectionnée :', ligneId);

                    ipc.send("updateLigneInDb", { ligneId }, displayTabTrie());
                });
            });

            var usersChecked = [];

            var checkboxes = document.querySelectorAll('input[type="checkbox"]');

            checkboxes.forEach(function (checkbox) {
                checkbox.addEventListener('change', function () {
                    if (this.checked) {
                        usersChecked.push(this.id);

                        document.getElementById("sendIfCheck").classList.remove("hide");

                    } else {
                        var index = usersChecked.indexOf(this.id);
                        if (index !== -1) {
                            usersChecked.splice(index, 1);
                        }

                        if (usersChecked.length === 0) {
                            document.getElementById("sendIfCheck").classList.add("hide");

                            console.log('le tableau est vide');
                        }
                    }
                    console.log(usersChecked);
                });
            });

            var send = document.getElementById("sendIfCheck");
            var task = false;
            let db;
            let taskPromise = null;
            
            send.addEventListener('click', () => {
                taskPromise = new Promise(function (resolve, reject) {
                    if (!task) {
                        console.log("Action effectuée !");
                        task = true;
            
                        const template = handlebars.compile(fs.readFileSync('template.hbs', 'utf8'));
            
                        db = new Datastore({
                            filename: "data.db",
                            autoload: true,
                        });
            
                        var processedCount = 0;
                        var totalRecords = usersChecked.length;
                        var recipientsReceived = [];
                        var recipientsNotReceived = [];
            
                        usersChecked.forEach(function (user) {
                            db.findOne({ _id: user }, (err, record) => {
                                if (err) {
                                    console.error(err);
                                } else {
                                    const htm = template(record);
                                    const directorys = `${record.chemin}/${record.nom}-${record.prenom} (${record.adresse}).htm`;
                                    const directorystxt = `${record.chemin}/${record.nom}-${record.prenom} (${record.adresse}).txt`;
            
                                    fs.writeFileSync(directorys, htm);
                                    fs.writeFileSync(directorystxt, htm);
            
                                    htmlToRtf.saveRtfInFile(`${record.chemin}/${record.nom}-${record.prenom} (${record.adresse}).rtf`, htmlToRtf.convertHtmlToRtf(htm));
            
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
                    taskPromise = null;
                    task = false;
                    displayTabTrie()
                });
            });
        });
}
document.addEventListener('DOMContentLoaded', displayTabTrie);

module.exports = {
    displayTabTrie,
};