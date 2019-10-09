var Request = require("request");
var HTMLParser = require('node-html-parser');
const cheerio = require('cheerio');
const fs = require('fs');

const BEGGIN = 1881;
const END = 2019;

fs.unlink("C:\\Users\\duclo\\Desktop\\meteo\\relever.csv", (err) => {
	if (err) {
		console.error(err);
		return;
	}
});

for (let i = BEGGIN; i < END; i++) {
	var tempMoyenne = "";
	for (let j = 1; j < 13; i++) {
		var jp = j;
		if(j < 10) {
			jp = '0' + j;
		}
		Request.get("https://www.meteo.bzh/climatologie-mensuelle-Nantes-Atlantique/" + i + jp, (error, response, body) => {
			if (error) {
				return console.dir(error);
			}
			const $ = cheerio.load(body);
			tempMoyenne = $('#tabStats tr').last().find("td").eq(3).html().split('&')[0].replace('.', ',') + ";";
		});
		fs.appendFile("C:\\Users\\duclo\\Desktop\\meteo\\relever.csv", i + "; " + tempMoyenne + '\r\n', function (err) {
			if (err) {
				return console.log(err);
			}
			console.log("Température de l'année : " + i + " sauvegarder");
		});
	}
}
