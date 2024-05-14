const { ipcRenderer } = require('electron');
const ipc = ipcRenderer;

const reduceBtn = document.getElementById("reduceBtn");
const sizeBtn = document.getElementById("sizeBtn");
const closeBtn = document.getElementById("closeBtn");

reduceBtn.addEventListener("click", () =>{
    ipc.send("reduceApp")
})
sizeBtn.addEventListener("click", () =>{
    ipc.send("sizeApp")
})
closeBtn.addEventListener("click", () =>{
    ipc.send("closeApp")
})

    // Gestion ajout ligne dans registre + Prépa BDD
    const btnAddLigne = document.getElementById("btnSaveLigne");
    if (btnAddLigne != null) {
        btnAddLigne.addEventListener('click', () => {
            // Les inputs du formulaire ajout d'une ligne
            const nomVal = document.getElementById("nomLigne").value;
            const prenomVal = document.getElementById("prenomLigne").value;
            const posteVal = document.getElementById("posteLigne").value;
            const serviceVal = document.getElementById("serviceLigne").value;
            const endroitVal = document.getElementById("endroitLigne").value;
            const telVal = document.getElementById("telLigne").value;
            var brand = "https://i.imgur.com/KwWwZA0.png&export=download";
            var heightVal = "55px";

            if (serviceVal === "16"){
                // Logo Aquatis
                brand = "https://i.imgur.com/HfNXmf8.png&export=download";
                
                // heightVal = "55px";
            }

            const logoVal = brand;

            // Fonction pour retirer les accents d'une chaîne de caractères
            function removeAccents(str) {
                return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            }
            
            // Convertir le nom et le prénom en minuscules, en retirant les accents, tout en conservant la première lettre en majuscule
            const nomSansAccents = removeAccents(nomVal).charAt(0).toLowerCase() + removeAccents(nomVal).slice(1).toLowerCase();
            const prenomSansAccents = removeAccents(prenomVal).charAt(0).toLowerCase() + removeAccents(prenomVal).slice(1).toLowerCase();
            
            // Générer l'adresse au format souhaité
            const adresseVal = prenomSansAccents + "." + nomSansAccents + "@cc-osartis.com";
            
            // Partie statique du chemin (à ajuster selon votre cas)
            const cheminPcVal = document.getElementById("cheminPc").value;

            // Concaténer les parties du chemin
            const cheminVal = '\\' + '\\' + cheminPcVal + '\\c$\\Users\\' + prenomSansAccents + '.' + nomSansAccents + '\\AppData\\Roaming\\Microsoft\\Signatures';

            // Préparer l'objet pour l'insert BDD
            var _myrec = {
                nom: nomVal,
                prenom: prenomVal,
                adresse: adresseVal,
                poste: posteVal,
                service: serviceVal,
                endroit: endroitVal,
                tel: telVal,
                chemin: cheminVal,
                logo: logoVal,
                height: heightVal,
                cheminPc: cheminPcVal // Utiliser la variable cheminPcVal ici
            };

            ipc.send("addLigneToDb", _myrec);
        })
    }

    // Gestion de la mise à jour d'une ligne dans le registre
    const btnUpLigne = document.getElementById("btnUpLigne");
    if (btnUpLigne != null) {
        btnUpLigne.addEventListener('click', () => {

        // Identifiez la ligne que vous souhaitez mettre à jour, par exemple en utilisant un identifiant unique
        const ligneId = document.getElementById("idUpLigne").value;
        
        // Les nouvelles valeurs des champs que vous souhaitez mettre à jour
        const nomVal = document.getElementById("nomUpLigne").value;
        const prenomVal = document.getElementById("prenomUpLigne").value;
        const posteVal = document.getElementById("posteUpLigne").value;
        const serviceVal = document.getElementById("serviceUpLigne").value;
        const endroitVal = document.getElementById("endroitUpLigne").value;
        const telVal = document.getElementById("telUpLigne").value;
        var brand = "https://i.imgur.com/KwWwZA0.png&export=download";
        var heightVal = "55px";

        if (serviceVal === "16"){
            // Logo Aquatis
            brand = "https://i.imgur.com/HfNXmf8.png&export=download";
            
            // heightVal = "85px";
        }

        const logoVal = brand;

        // Fonction pour retirer les accents d'une chaîne de caractères
        function removeAccents(str) {
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }
        
        // Convertir le nom et le prénom en minuscules, en retirant les accents, tout en conservant la première lettre en majuscule
        const nomSansAccents = removeAccents(nomVal).charAt(0).toLowerCase() + removeAccents(nomVal).slice(1).toLowerCase();
        const prenomSansAccents = removeAccents(prenomVal).charAt(0).toLowerCase() + removeAccents(prenomVal).slice(1).toLowerCase();
        
        // Générer l'adresse au format souhaité
        const adresseVal = prenomSansAccents + "." + nomSansAccents + "@cc-osartis.com";
        
        // Partie statique du chemin (à ajuster selon votre cas)
        const cheminPcVal = document.getElementById("cheminUpPc").value;

        // Concaténer les parties du chemin
        const cheminVal = '\\' + '\\' + cheminPcVal + '\\c$\\Users\\' + prenomSansAccents + '.' + nomSansAccents + '\\AppData\\Roaming\\Microsoft\\Signatures';

            // Préparer l'objet pour la mise à jour BDD
            var updatedData = {
                nom: nomVal,
                prenom: prenomVal,
                adresse: adresseVal,
                poste: posteVal,
                service: serviceVal,
                endroit: endroitVal,
                tel: telVal,
                chemin: cheminVal,
                logo: logoVal,
                height: heightVal,
                cheminPc: cheminPcVal // Utiliser la variable cheminPcVal ici
            };
            console.log("l'objet contient : " + JSON.stringify(updatedData, null, 2));
            // Utilisez une fonction ou une requête pour mettre à jour la ligne dans la base de données
            ipcRenderer.send("updateLigneInDb", { ligneId, updatedData});
        })
    }