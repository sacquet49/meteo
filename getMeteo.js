var Request = require("request");
var HTMLParser = require('node-html-parser');
const cheerio = require('cheerio');
const fs = require('fs');
var request = require("request");

const BEGGIN = 1881;
const END = 2019;
const promises = [];
var tempMoyenne = new Array(END - BEGGIN);
var pluviometries = new Array(END - BEGGIN);
var mois = getMoisSaisie();
var emplacement = process.argv.slice(2).toString().split(',')[1];
const moisDeAnnee = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const emplacements = ["Angers-Beaucouze",
    "Belle-Ile-Le-Talut",
    "Brest-Guipavas",
    "Brignogan",
    "Camaret-sur-Mer-Pointe-du-Toulinguet",
    "Guernesey",
    "Ile-dYeu-Saint-Sauveur",
    "Ile-de-Batz",
    "Ile-de-Brehat",
    "Ile-de-Groix-Beg-Melen",
    "Jersey",
    "La-Roche-sur-Yon-Les-Ajoncs",
    "Landivisiau",
    "Lannion-Servel",
    "Lanveoc-Poulmic",
    "Laval",
    "Lorient-Lann-Bihoue",
    "Nantes-Atlantique",
    "Ouessant-Stiff",
    "Pleurtuit-St-Malo",
    "Ploumanach-Perros",
    "Pointe-St-Mathieu-Plougonvelin",
    "Pointe-de-Penmarch",
    "Pointe-du-Raz",
    "Quimper-Pluguffan",
    "Rennes-St-Jacques",
    "Saint-Nazaire-Montoir",
    "Saint-Nazaire-Pointe-de-Chemoulin",
    "Tremuson-St-Brieuc-Armor",
    "Vannes-Meucon",
    "Vannes-Sene"];
fs.unlink(`.\\relever_${moisDeAnnee[parseInt(mois) - 1]}_${emplacements[parseInt(emplacement) - 1]}.csv`, (err) => {
    if (err) {
        console.error(err);
        return;
    }
});

function getMoisSaisie() {
    const month = process.argv.slice(2).toString().split(',')[0];
    if (month < 10) {
        return "0" + month.toString();
    }
    return month;
}

function getAllTemperaturesAnnuelMoyenneByMonth(annee) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
        }, 1000);
        var url = `https://www.meteo.bzh/climatologie-mensuelle-${emplacements[parseInt(emplacement) - 1]}/`.concat(annee).concat(mois);
        Request.get(url, (error, response, body) => {
            if (error) {
                return console.dir(error);
            }
            const $ = cheerio.load(body);
            var anneeUrl = parseInt(response.client._httpMessage.path.substring(response.client._httpMessage.path.length - 6, response.client._httpMessage.path.length - 2));
            if ($('#tabStats tr').last().find("td").eq(3).html()) {
                var temperatureMoyenne = $('#tabStats tr').last().find("td").eq(3).html().split('&')[0].replace('.', ',');
                var pluviometrie = $('#tabStats tr').last().find("td").eq(4).html().split('m')[0].replace('.', ',');
                tempMoyenne[END - anneeUrl] = temperatureMoyenne;
                pluviometries[END - anneeUrl] = pluviometrie;
                resolve(temperatureMoyenne);
            } else {
                const joursDuMois = parseInt($('#tabStats tr').length) - 2;
                var moyenne = 0;
                $('#tabStats tr').each(function() {
                    if(!isNaN(parseFloat($(this).find('td').eq(3).html()))) {
                        moyenne = moyenne + parseFloat($(this).find('td').eq(3).html());
                    }
                });
                tempMoyenne[END - anneeUrl] = Number.parseFloat(moyenne / joursDuMois).toFixed(2).toString().replace('.', ',');
                pluviometries[END - anneeUrl] = $('#tabStats tr').last().find("td").eq(4).html() ?
                    $('#tabStats tr').last().find("td").eq(4).html().split('m')[0].replace('.', ',') : 0;
                resolve(0);
            }
        });
    });
}

for (let i = BEGGIN; i < END; i++) {
    promises.push(getAllTemperaturesAnnuelMoyenneByMonth(i));
}

Promise.all(promises).then(response => {
    var printTemperature = `Annee ; Temperature moyenne ${moisDeAnnee[parseInt(mois) - 1]} ; Pluviometrie ${moisDeAnnee[parseInt(mois) - 1]} \r\n`;
    for (let i = BEGGIN; i < END; i++) {
        printTemperature = `${printTemperature} ${i} ; ${tempMoyenne[END - i]} ; ${pluviometries[END - i]} \r\n`;
    }
    fs.appendFile(`.\\relever_${moisDeAnnee[parseInt(mois) - 1]}_${emplacements[parseInt(emplacement) - 1]}.csv`, printTemperature, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log(`Relevé du mois ${moisDeAnnee[parseInt(mois) - 1]} sauvegarder pour la ville de ${emplacements[parseInt(emplacement) - 1]}`);
    });
});
