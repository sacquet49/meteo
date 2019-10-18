var Request = require("request");
var HTMLParser = require('node-html-parser');
const cheerio = require('cheerio');
const fs = require('fs');
var request = require("request");
import {MOISANNEE, EMPLACEMENTS, Meteo} from "./Meteo";

export class MeteoService {

  constructor(mois, emplacement) {
    this.mois = mois;
    this.emplacement = emplacement;
    this.promisesOfPagesCanHaveTemperature = [];
    this.BEGGIN = 1881;
    this.END = new Date().getFullYear() + 1;
    this.meteo = new Array(this.END - this.BEGGIN);
  }

  getTemperaturesAnnuelMoyenne(annee) {
    return new Promise((resolve, reject) => this.requestTemperature(resolve, reject, annee));
  }

  requestTemperature(resolve, reject, annee) {
    setTimeout(function () {
    }, 1000);
    var url = `https://www.meteo.bzh/climatologie-mensuelle-${EMPLACEMENTS[parseInt(this.emplacement) - 1]}/`.concat(annee).concat(this.mois);
    Request.get(url, (error, response, body) => {
      if (error) {
        return console.dir(error);
      }
      const $ = cheerio.load(body);
      var anneeUrl = parseInt(response.client._httpMessage.path.substring(response.client._httpMessage.path.length - 6,
        response.client._httpMessage.path.length - 2));

      var tempMin = $('#tabStats tr').last().find("td").eq(1).html() ?
        $('#tabStats tr').last().find("td").eq(1).html().split('&')[0] : this.calculMoyenne($, anneeUrl, 1);

      var tempMax = $('#tabStats tr').last().find("td").eq(2).html() ?
        $('#tabStats tr').last().find("td").eq(2).html().split('&')[0] : this.calculMoyenne($, anneeUrl, 2);

      var tempMoyenne = $('#tabStats tr').last().find("td").eq(3).html() ?
        $('#tabStats tr').last().find("td").eq(3).html().split('&')[0] : this.calculMoyenne($, anneeUrl, 3);

      var pluviometrie = $('#tabStats tr').last().find("td").eq(4).html() ?
        $('#tabStats tr').last().find("td").eq(4).html().split('m')[0] : 0;

      this.meteo[this.END - anneeUrl] = new Meteo(tempMin, tempMax, tempMoyenne, pluviometrie);

      resolve(tempMoyenne);
    });
  }

  calculMoyenne($, anneeUrl, index) {
    const joursDuMois = parseInt($('#tabStats tr').length) - 2;
    var moyenne = 0;
    $('#tabStats tr').each(function () {
      if (!isNaN(parseFloat($(this).find('td').eq(index).html()))) {
        moyenne = moyenne + parseFloat($(this).find('td').eq(index).html());
      }
    });
    return Number.parseFloat(moyenne / joursDuMois).toFixed(2).toString();
  }

  getTemperaturesAnnuelMoyenneByMonth() {
    for (let i = this.BEGGIN; i < this.END; i++) {
      this.promisesOfPagesCanHaveTemperature.push(this.getTemperaturesAnnuelMoyenne(i));
    }
    Promise.all(this.promisesOfPagesCanHaveTemperature).then(response => {
      this.insertMeteoToElastic();
    });
  }

  insertMeteoToElastic() {
    var message = `Relevé du mois ${MOISANNEE[parseInt(this.mois) - 1]} sauvegarder pour la ville de ${EMPLACEMENTS[parseInt(this.emplacement) - 1]}`;
    var index = `${MOISANNEE[parseInt(this.mois) - 1]}_${EMPLACEMENTS[parseInt(this.emplacement) - 1]}`.toLowerCase();
    var option = {"headers": {'Content-Type': 'application/json'}};

    this.createMappingElastic(index, option);
  }

  addDataToElastic(index, i, option) {
    var url = `http://localhost:9200/${index}/_doc/${i}`;
    var data = JSON.stringify({
      "annee": `${i}-${this.mois}-01T00:00:00Z`,
      "temperature_min": parseFloat(this.meteo[this.END - i].temperatureMin),
      "temperature_max": parseFloat(this.meteo[this.END - i].temperatureMax),
      "temperature_moyenne": parseFloat(this.meteo[this.END - i].temperatureMoyenne),
      "pluviometrie": parseFloat(this.meteo[this.END - i].pluviometrie)
    });
    var req = Request.put(url, option, (error, response, body) => this.retourInsertionElastic(error, response, body));
    req.write(data);
    req.end();
  }

  createMappingElastic(index, option) {
    var urlMapping = `http://localhost:9200/${index}`;
    var dataMapping = JSON.stringify({
      "mappings": {
        "properties": {
          "annee": {"type": "date"},
          "temperature_min": {"type": "double"},
          "temperature_max": {"type": "double"},
          "temperature_moyenne": {"type": "double"},
          "pluviometrie": {"type": "double"}
        }
      }
    });
    var req = Request.put(urlMapping, option, (error, response, body) => {
      this.retourInsertionElastic(error, response, body);
      for (let i = this.BEGGIN; i < this.END; i++) {
        this.addDataToElastic(index, i, option);
      }
    });
    req.write(dataMapping);
    req.end();
  }

  retourInsertionElastic(error, response, body) {
    if (error && response.statusCode != 201) {
      console.log(JSON.stringify(error));
      console.log(JSON.stringify(response));
    }
  }
}


