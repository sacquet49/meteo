import { MeteoService } from './meteo.service.js';

var emplacement = process.argv.slice(2).toString().split(',')[1];
const mois = function getMoisSaisie() {
    const month = process.argv.slice(2).toString().split(',')[0];
    if (month < 10) {
        return "0" + month.toString();
    }
    return month;
};
if(mois() && emplacement) {
    var meteoService = new MeteoService(mois(), emplacement);
    meteoService.getTemperaturesAnnuelMoyenneByMonth();
} else {
    console.log("Usage : babel-node getMeteo.js <numéro_mois> <numéro_ville>");
}


