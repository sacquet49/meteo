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
const moisDeAnnee = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
fs.unlink(`.\\relever_${moisDeAnnee[parseInt(mois) - 1]}.csv`, (err) => {
	if (err) {
		console.error(err);
		return;
	}
});

function getMoisSaisie() {
	const month = process.argv.slice(2);
	if (month < 10) {
		return "0" + month.toString();
	}
	return month;
}

function getAllTemperaturesAnnuelMoyenneByMonth(annee) {
  return new Promise(function (resolve, reject) {
		setTimeout( function() {}, 1000);
    var url = "https://www.meteo.bzh/climatologie-mensuelle-Nantes-Atlantique/".concat(annee).concat(mois);
    Request.get(url, (error, response, body) => {
      if (error) {
        return console.dir(error);
      }
      const $ = cheerio.load(body);
      var temperatureMoyenne = $('#tabStats tr').last().find("td").eq(3).html().split('&')[0].replace('.', ',');
      var pluviometrie = $('#tabStats tr').last().find("td").eq(4).html().split('m')[0].replace('.', ',');
			var anneeUrl = parseInt(response.client._httpMessage.path.substring(response.client._httpMessage.path.length - 6, response.client._httpMessage.path.length - 2));
			tempMoyenne[END - anneeUrl] = temperatureMoyenne;
			pluviometries[END - anneeUrl] = pluviometrie;
			resolve(temperatureMoyenne);
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
	fs.appendFile(`.\\relever_${moisDeAnnee[parseInt(mois) - 1]}.csv`, printTemperature, function (err) {
		if (err) {
			return console.log(err);
		}
		console.log(`Relevé du mois : ${moisDeAnnee[parseInt(mois) - 1]} sauvegarder`);
	});
});
