const listCities = document.getElementById('city_choice')
const from = document.getElementById("from");
const to = document.getElementById("to");
const limit = 7
const depTitle = 'Choisissez une gare de départ'
const arrTitle = 'Choisissez une gare d\'arrivée'
let state = 'from'
let typingTimer;       
let inputLag = 1000;  

// Reset l'ensemble des enfants de la div city_choice
function clearCities() {
  listCities.innerHTML = '';
}

// Renseigne le champ de la gare choisie si la gare existe
function selectCity(e) {
  let myChoice = document.getElementById(state)
  if (e.target.id != 'no_city') {
    myChoice.value = e.target.text
  }
}

// Chargement des apis suivant l'argument ou non fourni à la fonction.
// Ce n'est pas optimal puisque nous chargeons plusieurs fois une API sans effectuer de traitement sur le JSON.
function loadCities(data = null) {
  var request = new XMLHttpRequest()
  if (data === null || data === '' ) {
    request.open('GET', 'https://api.tictactrip.eu/cities/popular/5', true)
  }
  else {
    request.open('GET', 'https://api.tictactrip.eu/cities/autocomplete/?q=' + data, true)
  }
  request.onload = function() {
    var data = JSON.parse(this.response)
    if (request.status >= 200 && request.status < 400) {
      // Si le JSON est vide
      if (data.length == 0) {
        const c = document.createElement('a')
        c.textContent = 'Aucune gare n\'a été trouvée.'
        c.id = 'no_city'
        listCities.appendChild(c)
      } 
      else {
        // Si le JSON dépasse la limite d'affichage 
        if (data.length > limit ) {
          let dataLimited = []  
          for (let i = 0; i < limit; i++) {dataLimited[i] = data[i];}
          data = dataLimited
        }
        
        // Création des balises <a></a> correspondant aux villes 
        data.forEach(city => {
          const c = document.createElement('a')
          c.textContent = city.unique_name
          c.id = 'city_' + city.city_id
          listCities.appendChild(c)
        })
      }
    }
    else {
      console.log('L\'API n\'est pas disponible ou une erreur s\'est produite coté serveur')
    }
  }
  // Refresh de la liste
  clearCities()
  // MAJ de l'affichage
  request.send()
}

// MAJ de l'état et permutation de style et de titre entre départ et arrivée
function chooseStation(id) {
  let title = document.getElementById("title_station")
  let triangle = document.getElementById("triangle")
 
  if (id == 'from') {
     title.textContent = depTitle
     triangle.style.top = "65px"
  } else {
     title.textContent = arrTitle
     triangle.style.top = "100px"
  }
  state = id
}

// Chargement des villes lorsque la page est chargée
window.addEventListener("DOMContentLoaded", (event) => {
  loadCities();
});

listCities.addEventListener('click', selectCity)

// Les inputLag nous permettent d'attendre la fin de la saisie avant de charger les villes
from.addEventListener("click", function(){chooseStation("from")}, false)
from.addEventListener('keyup', function(){
  clearTimeout(typingTimer);
  typingTimer = setTimeout(loadCities(from.value), inputLag);
})

to.addEventListener("click", function(){chooseStation("to")}, false)
to.addEventListener('keyup', function(){
  clearTimeout(typingTimer);
  typingTimer = setTimeout(loadCities(to.value), inputLag);
})

 
