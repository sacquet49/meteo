var Request = require("request");
var HTMLParser = require('node-html-parser');
const cheerio = require('cheerio');
const fs = require('fs');
var request = require("request");

const BEGGIN = 1881;
const END = 2019;

function getMeteo(annee, mois) {
	return new Promise(function(resolve, reject) {
		var url = "https://www.meteo.bzh/climatologie-mensuelle-Nantes-Atlantique/".concat(annee).concat(mois);
		Request.get(url, (error, response, body) => {
			if (error) {
				return console.dir(error);
			}
			const $ = cheerio.load(body);
			resolve($('#tabStats tr').last().find("td").eq(3).html().split('&')[0].replace('.', ','));
		});
	});
}

async function getTemperature(annee, mois) {
	try {
		const temperature = await getMeteo(annee, mois);
		return temperature;
	} catch (error) {
		console.error('ERROR:');
		console.error(error);
	}
}

var tempMoyenne = new Array(END - BEGGIN);
for (let i = BEGGIN; i < END; i++) {
	tempMoyenne[BEGGIN + i] =  new Array(12);
	for (let j = 1; j < 13; j++) {
		var jp = j;
		if(j < 10) {
			jp = "0" + j.toString();
		}
		/*tempMoyenne[i][parseInt(jp) - 1] =*/ getTemperature(i, jp);
	}
	setTimeout(function(){
		//do what you need here
	}, 1000);
}

/*fs.unlink("C:\\Users\\duclo\\Desktop\\meteo\\relever.csv", (err) => {
	if (err) {
		console.error(err);
		return;
	}
});*/

/*Request.get(url, (error, response, body) => {
	if (error) {
		return console.dir(error);
	}
	var mois = parseInt(response.client._httpMessage.path.substring(response.client._httpMessage.path.length - 2, response.client._httpMessage.path.length));
	var annee = response.client._httpMessage.path.substring(response.client._httpMessage.path.length - 6, response.client._httpMessage.path.length - 2);
	const $ = cheerio.load(body);
	tempMoyenne[annee][mois] = $('#tabStats tr').last().find("td").eq(3).html().split('&')[0].replace('.', ',') + ";";
});
fs.appendFile("C:\\Users\\duclo\\Desktop\\meteo\\relever.csv", i + "; " + tempMoyenne + '\r\n', function (err) {
    if (err) {
        return console.log(err);
    }
    console.log("Température de l'année : " + i + " sauvegarder");
});*/
