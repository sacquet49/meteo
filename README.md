# Donne les relevés des moyennes mensuelles depuis la création des relevés de températures en 1881.
Source des infomations https://www.meteo.bzh/

# Techno
- Docker
- NodeJs
- ElasticSearch
- Kibana  

# Demarage

- Installer docker et docker-compose sur votre machine.
- Rendez-vous dans le répertoire docker pour instancier un service elasticSearch et kibana.
$ docker-compose up --build

## Usage 

$ babel-node getMeteo.js <numéro_mois> <numéro_ville>

### Exemple pour la ville d'Angers au mois de janvier. 
$ babel-node getMeteo.js 1 1

Ensuite ouvrez un navigateur et rendez vous sur l'adresse 
 http://localhost:9200/janvier_angers-beaucouze/_doc/_search?pretty  

Vous devez avoir les résultats des température dans la base de données.  
A partir de kibana (http://localhost:5601) vous allez pouvoir exploiter ces résultats.
 
### Villes couvertes par le site www.meteo.bzh :
- 1 : "Angers-Beaucouze"
- 2 :  "Belle-Ile-Le-Talut"
- 3 : "Brest-Guipavas"
- 4 : "Brignogan"
- 5 : "Camaret-sur-Mer-Pointe-du-Toulinguet"
- 6 : "Guernesey"
- 7 : "Ile-dYeu-Saint-Sauveur"
- 8 : "Ile-de-Batz"
- 9 : "Ile-de-Brehat"
- 10 : "Ile-de-Groix-Beg-Melen"
- 11 : "Jersey"
- 12 : "La-Roche-sur-Yon-Les-Ajoncs"
- 13 : "Landivisiau"
- 14 : "Lannion-Servel"
- 15 : "Lanveoc-Poulmic"
- 16 : "Laval"
- 17 : "Lorient-Lann-Bihoue"
- 18 : "Nantes-Atlantique"
- 19 : "Ouessant-Stiff"
- 20 : "Pleurtuit-St-Malo"
- 21 : "Ploumanach-Perros"
- 22 : "Pointe-St-Mathieu-Plougonvelin"
- 23 : "Pointe-de-Penmarch"
- 24 : "Pointe-du-Raz"
- 25 : "Quimper-Pluguffan"
- 26 : "Rennes-St-Jacques"
- 27 : "Saint-Nazaire-Montoir"
- 28 : "Saint-Nazaire-Pointe-de-Chemoulin"
- 29 : "Tremuson-St-Brieuc-Armor"
- 30 : "Vannes-Meucon"
- 31 : "Vannes-Sene"

