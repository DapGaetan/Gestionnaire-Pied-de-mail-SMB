const handlebars = require('handlebars');
const fs = require('fs');

let templateContent;
try {
    templateContent = fs.readFileSync('template.hbs', 'utf8');
} catch (err) {
    console.error("Erreur lors de la lecture du fichier template.hbs:", err);
    process.exit(1);
}

const template = handlebars.compile(templateContent);

const defaultData = {
    nom: "Ambassadores",
    prenom: "Paul",
    adresse: "paul.ambassadores@cc-osartis.com",
    poste: "Ambassadeur",
    service: "1",
    endroit: "CC OSARTIS-MARQUION - rue Jean Monnet 62490 - Vitry-en-Artois",
    tel: "03.91.20.70.93",
    logo: "https://i.imgur.com/q7HOxJU.png&export=download",
    height: "55px",
    cheminPc: "pc-com2"
};

const html = template(defaultData);

document.getElementById('displaySign').innerHTML = html;
