const pokemonsContainer = document.getElementById("pokemonsContainer")
const loadMoreButton = document.getElementById("loadMoreButton");
const API_URL = 'https://pokeapi.co/api/v2/pokemon/';

// Constant with the css classes for the background of the card by the pokemon type
const typeClasses = {
  cardBackground: {
    grass: 'type-grass',
    fire: 'type-fire',
    water: 'type-water',
    electric: 'type-electric',
    normal: 'type-normal',
    flying: 'type-flying',
    fighting: 'type-fighting',
    poison: 'type-poison',
    ground: 'type-ground',
    rock: 'type-rock',
    psychic: 'type-psychic',
    ice: 'type-ice',
    bug: 'type-bug',
    ghost: 'type-ghost',
    steel: 'type-steel',
    dragon: 'type-dragon',
    dark: 'type-dark',
    fairy: 'type-fairy'
  },
  badgeBackground: {
    grass: 'badge-grass',
    fire: 'badge-fire',
    water: 'badge-water',
    electric: 'badge-electric',
    normal: 'badge-normal',
    flying: 'badge-flying',
    fighting: 'badge-fighting',
    poison: 'badge-poison',
    ground: 'badge-ground',
    rock: 'badge-rock',
    psychic: 'badge-psychic',
    ice: 'badge-ice',
    bug: 'badge-bug',
    ghost: 'badge-ghost',
    steel: 'badge-steel',
    dragon: 'badge-dragon',
    dark: 'badge-dark',
    fairy: 'badge-fairy'
  }
};

// This function creates a new element in the DOM fetching the pokemon data
function createPokemonCard (pokemon) {
  // Declaring the variables by the pokemon data
  const firstPokemonType = pokemon.types[0].type.name;
  const secondPokemonType = pokemon.types.length > 1 ? pokemon.types[1].type.name : null;
  const pokemonId = pokemon.id;
  const pokemonSprite = pokemon.sprites.other.home.front_default;
  const pokemonName = pokemon.name;
  let pokemonTypeBadge1 = '';
  const pokemonContainer = document.createElement('button');

  if (typeClasses.cardBackground[firstPokemonType]) {
    pokemonContainer.classList.add(typeClasses.cardBackground[firstPokemonType]);
    pokemonTypeBadge1 = typeClasses.badgeBackground[firstPokemonType];
  } else {
    // Do something in case.. object typeClasses
  }
  pokemonContainer.classList.add('pokemon-container')
  pokemonContainer.innerHTML = 
  `
    <img class='pokemon-img' src='${pokemonSprite}'>
    <div class='pokemon-info'>
      <p class='pokemon-id'>#${pokemonId.toString().padStart(3, 0)}</p>
      <h3>${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</h3>
      <div class='badges'>
        <div class='pokemon-badge ${pokemonTypeBadge1}'>
          ${firstPokemonType}
        </div>
        ${secondPokemonType ? `<div class='pokemon-badge ${typeClasses.badgeBackground[secondPokemonType]}'>${secondPokemonType}</div>` : ''}
      </div>
    </div>
  `;

  return pokemonContainer // Returns the card with the data
} // Fin de la funcion createPokemonCard

// Function that show 15 by 15 pokemons 
let offset = 0; // Init the offset by 0
function initPokemons() {
  offset = 0; // Change the value of the offset on each call
  pokemonsContainer.style.display = 'grid';
  pokemonsContainer.style.gap = '80px 30px';
  pokemonsContainer.innerHTML = '<h2 class="section-title">All</h2>' // A title for the interface

  loadMorePokemons(); // Calls the function that load a list of pokemons
  // Calls the function loadMorePokemons by clicking the button
  loadMoreButton.addEventListener('click', loadMorePokemons);
}

initPokemons(); // Calling the function to show by default 15 pokemons

// Function that loads pokemon by the offset
function loadMorePokemons() {
  // HTTP request for fetch more pokemons
  fetch(API_URL + `?limit=18&offset=${offset}`) // Passing the offset to load more
    .then(response => response.json())
    .then(data => {
      const pokemons = data.results;
      // Maps each pokemon by the list and creates an array of promises to get the pokemons data
      const pokemonPromises = pokemons.map(pokemon => {
        return fetch(pokemon.url) // Fetching the data in the pokemon url
          .then(response => response.json()); // Gets the server response
      });
      return Promise.all(pokemonPromises); // Waits all the promises resolution and return a array with the data
    })
    .then(pokemonDetails => { // By the data of previous then, creates a new card for each pokemon
      pokemonDetails.forEach(pokemon => {
        // Appends a new card in the container
        pokemonsContainer.appendChild(createPokemonCard(pokemon))
        // Appends the button to load more pokemons
        pokemonsContainer.appendChild(loadMoreButton)
      });

      offset += 18; // Increments the offset for the next call to the API
    })
    .catch(error => {
      console.log(error);
    });
}

// Function that fetch the searched pokemon by id or name
function searchPokemon (pokemon) {
  loadMoreButton.remove() // Removes the load more button from the view
  pokemonsContainer.style.display = 'flex'; // Change the display of the container
  pokemonsContainer.style.flexDirection = 'column';
  pokemonsContainer.style.gap = '40px';

  fetch(API_URL + `${pokemon}`) // Fetching the searched pokemon
    .then(response => response.json()) // Response of the server
    .then(data => {
      const pokemonType = data.types[0].type.name;
      console.log(data)
      const firstPokemonType = data.types[0].type.name;
      const secondPokemonType = data.types.length > 1 ? data.types[1].type.name : null;
      let pokemonTypeBadge1 = '';
      const pokemonContainer = document.createElement('div');
    
      if (typeClasses.cardBackground[firstPokemonType]) {
        pokemonContainer.classList.add(typeClasses.cardBackground[firstPokemonType]);
        pokemonTypeBadge1 = typeClasses.badgeBackground[firstPokemonType];
      } else {
        // Do something in case.. object typeClasses
      }
      profileContainer = document.createElement('div')
      // Title for the UI
      pokemonsContainer.innerHTML = `<h2 class="section-title">Results of '${data.name}'</h2>`
      
  
      profileContainer.innerHTML = 
      `
        <div class="profile-header ${typeClasses.cardBackground[pokemonType]}">
          <img src='${data.sprites.other.home.front_default}'> 
          <div class="profile-pokemon-data">
            <p class="pokemon-id">${data.id.toString().padStart(3, 0)}</p>
            <h3>${data.name}</h3>
            <div class='badges'>
            <div class='pokemon-badge ${pokemonTypeBadge1}'>
              ${firstPokemonType}
            </div>
            ${secondPokemonType ? `<div class='pokemon-badge ${typeClasses.badgeBackground[secondPokemonType]}'>${secondPokemonType}</div>` : ''}
          </div>     
          </div>
        </div>
        <div class="profile-info">
          <p>Stats</p>
        </div>
      `;
      const pokemonCard = createPokemonCard(data)
      // Adding the card to the container
      pokemonsContainer.appendChild(profileContainer)
    })
    .catch(error => {
      // Show the error in the interface
      pokemonsContainer.innerHTML = 
        ` 
        <div class='toast error'>Error: Wrong Pokemon id or name</div>
        `;
    })
}

// Event that run the searchPokemon function
const searchButton = document.querySelector('.btn-search').addEventListener('click', (e) => {
  e.preventDefault() // Prevents the web reloading by the HTML form
  let inputValue = document.getElementById('pokemonName')
  searchPokemon(inputValue.value) // Calling the function to search a Pokemon by the value of the input
  inputValue.value = ''; // Resets the input value
})
