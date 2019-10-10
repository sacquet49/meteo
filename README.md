# Donne les relevés des moyennes des températures moyennes mensuelles depuis la création des relevés de température 1881.
Source des infomations https://www.meteo.bzh/
 
Villes couvertes par le site www.meteo.bzh :
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

# Usage 

$ node getMeteo.js <numéro_mois> <numéro_ville>

### Exemple pour la ville d'Angers au mois de janvier. 
$ node getMeteo.js 1 1

En sortie un fichier csv est créer avec pour titre "relever_Février_Angers-Beaucouze.csv"
