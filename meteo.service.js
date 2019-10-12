var Request = require("request");
var HTMLParser = require('node-html-parser');
const cheerio = require('cheerio');
const fs = require('fs');
var request = require("request");
import {MOISANNEE, EMPLACEMENTS} from "./Meteo";

export class MeteoService {

    constructor(mois, emplacement) {
        this.mois = mois;
        this.emplacement = emplacement;
        this.promisesOfPagesCanHaveTemperature = [];
        this.BEGGIN = 1881;
        this.END = 2019;
        this.tempMoyenne = new Array(this.END - this.BEGGIN);
        this.pluviometries = new Array(this.END - this.BEGGIN);
        fs.unlink(`.\\relever_${MOISANNEE[parseInt(mois) - 1]}_${EMPLACEMENTS[parseInt(this.emplacement) - 1]}.csv`, (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
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
            var anneeUrl = parseInt(response.client._httpMessage.path.substring(response.client._httpMessage.path.length - 6, response.client._httpMessage.path.length - 2));
            if ($('#tabStats tr').last().find("td").eq(3).html()) {
                var temperatureMoyenne = $('#tabStats tr').last().find("td").eq(3).html().split('&')[0].replace('.', ',');
                this.tempMoyenne[this.END - anneeUrl] = temperatureMoyenne;
                this.pluviometries[this.END - anneeUrl] = $('#tabStats tr').last().find("td").eq(4).html().split('m')[0].replace('.', ',');
                ;
                resolve(temperatureMoyenne);
            } else {
                const joursDuMois = parseInt($('#tabStats tr').length) - 2;
                var moyenne = 0;
                $('#tabStats tr').each(function () {
                    if (!isNaN(parseFloat($(this).find('td').eq(3).html()))) {
                        moyenne = moyenne + parseFloat($(this).find('td').eq(3).html());
                    }
                });
                this.tempMoyenne[this.END - anneeUrl] = Number.parseFloat(moyenne / joursDuMois).toFixed(2).toString().replace('.', ',');
                this.pluviometries[this.END - anneeUrl] = $('#tabStats tr').last().find("td").eq(4).html() ?
                    $('#tabStats tr').last().find("td").eq(4).html().split('m')[0].replace('.', ',') : 0;
                resolve(0);
            }
        });
    }

    getTemperaturesAnnuelMoyenneByMonth() {
        for (let i = this.BEGGIN; i < this.END; i++) {
            this.promisesOfPagesCanHaveTemperature.push(this.getTemperaturesAnnuelMoyenne(i));
        }
        Promise.all(this.promisesOfPagesCanHaveTemperature).then(response => this.exportMeteoToCsv());
    }

    exportMeteoToCsv() {
        var printTemperature = `Annee ; Temperature moyenne ${MOISANNEE[parseInt(this.mois) - 1]} ; Pluviometrie ${MOISANNEE[parseInt(this.mois) - 1]} \r\n`;
        var message = `Relevé du mois ${MOISANNEE[parseInt(this.mois) - 1]} sauvegarder pour la ville de ${EMPLACEMENTS[parseInt(this.emplacement) - 1]}`;

        for (let i = this.BEGGIN; i < this.END; i++) {
            printTemperature = `${printTemperature} ${i} ; ${this.tempMoyenne[this.END - i]} ; ${this.pluviometries[this.END - i]} \r\n`;
        }
        fs.appendFile(`.\\relever_${MOISANNEE[parseInt(this.mois) - 1]}_${EMPLACEMENTS[parseInt(this.emplacement) - 1]}.csv`, printTemperature, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log(message);
        });
    }
}
