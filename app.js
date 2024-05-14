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

    const btnAddLigne = document.getElementById("btnSaveLigne");
    if (btnAddLigne != null) {
        btnAddLigne.addEventListener('click', () => {
            const nomVal = document.getElementById("nomLigne").value;
            const prenomVal = document.getElementById("prenomLigne").value;
            const posteVal = document.getElementById("posteLigne").value;
            const serviceVal = document.getElementById("serviceLigne").value;
            const endroitVal = document.getElementById("endroitLigne").value;
            const telVal = document.getElementById("telLigne").value;
            var brand = "https://i.imgur.com/KwWwZA0.png&export=download";
            var heightVal = "55px";

            if (serviceVal === "16"){
                brand = "https://i.imgur.com/HfNXmf8.png&export=download";
                
            }
            const logoVal = brand;
            function removeAccents(str) {
                return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            }
            const nomSansAccents = removeAccents(nomVal).charAt(0).toLowerCase() + removeAccents(nomVal).slice(1).toLowerCase();
            const prenomSansAccents = removeAccents(prenomVal).charAt(0).toLowerCase() + removeAccents(prenomVal).slice(1).toLowerCase();
            const adresseVal = prenomSansAccents + "." + nomSansAccents + "@cc-osartis.com";
            const cheminPcVal = document.getElementById("cheminPc").value;
            const cheminVal = '\\' + '\\' + cheminPcVal + '\\c$\\Users\\' + prenomSansAccents + '.' + nomSansAccents + '\\AppData\\Roaming\\Microsoft\\Signatures';

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
                cheminPc: cheminPcVal
            };

            ipc.send("addLigneToDb", _myrec);
        })
    }

    const btnUpLigne = document.getElementById("btnUpLigne");
    if (btnUpLigne != null) {
        btnUpLigne.addEventListener('click', () => {

        const ligneId = document.getElementById("idUpLigne").value;
        const nomVal = document.getElementById("nomUpLigne").value;
        const prenomVal = document.getElementById("prenomUpLigne").value;
        const posteVal = document.getElementById("posteUpLigne").value;
        const serviceVal = document.getElementById("serviceUpLigne").value;
        const endroitVal = document.getElementById("endroitUpLigne").value;
        const telVal = document.getElementById("telUpLigne").value;
        var brand = "https://i.imgur.com/KwWwZA0.png&export=download";
        var heightVal = "55px";

        if (serviceVal === "16"){
            brand = "https://i.imgur.com/HfNXmf8.png&export=download";
        }

        const logoVal = brand;
        function removeAccents(str) {
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }
        
        const nomSansAccents = removeAccents(nomVal).charAt(0).toLowerCase() + removeAccents(nomVal).slice(1).toLowerCase();
        const prenomSansAccents = removeAccents(prenomVal).charAt(0).toLowerCase() + removeAccents(prenomVal).slice(1).toLowerCase();
        const adresseVal = prenomSansAccents + "." + nomSansAccents + "@cc-osartis.com";        
        const cheminPcVal = document.getElementById("cheminUpPc").value;
        const cheminVal = '\\' + '\\' + cheminPcVal + '\\c$\\Users\\' + prenomSansAccents + '.' + nomSansAccents + '\\AppData\\Roaming\\Microsoft\\Signatures';

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
                cheminPc: cheminPcVal
            };
            console.log("l'objet contient : " + JSON.stringify(updatedData, null, 2));
            ipcRenderer.send("updateLigneInDb", { ligneId, updatedData});
        })
    }