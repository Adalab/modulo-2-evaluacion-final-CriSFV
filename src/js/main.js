'use strict';
const form = document.querySelector('.js_form');
const userSearch = document.querySelector('.js_userText');
const searchButton = document.querySelector('.js_searchButton');
const filmList = document.querySelector('.js_filmList');
const favoriteList = document.querySelector('.js_favoriteList');
const listTitle = document.querySelector('.js_listTitle');
const listFavoriteTitle = document.querySelector('.js_listFavoriteTitle');
const listContainer = document.querySelector('.js_favoriteListContainer');

let dataFilms = [];
let favorites = [];

function submitDefault(event) {
  event.preventDefault();
}
form.addEventListener('submit', submitDefault);

function hadleRemoveFavFilm(ev) {
  const divTitle = ev.target.parentNode;
  const filmSelectedID = parseInt(divTitle.parentNode.id);
  const numberInFavorites = favorites.findIndex((fav) => {
    return fav.show.id === filmSelectedID;
  });
  favorites.splice(numberInFavorites, 1);
  setInLocalStorage();
  paintFavorites();
  paintFilms();
}
function hadleRemoveAllFavFilm() {
  favorites.splice(0, favorites.length);
  paintFavorites();
  paintFilms();
  setInLocalStorage();
}
function selectRemoveFavlistener() {
  const removeButtons = document.querySelectorAll('.js_removeFavButton');
  for (const eachButton of removeButtons) {
    eachButton.addEventListener('click', hadleRemoveFavFilm);
  }
  const removeAllButton = document.querySelector('.js_removeAllFav');
  if (removeAllButton !== null) {
    removeAllButton.addEventListener('click', hadleRemoveAllFavFilm);
  }
}

function paintFavorites() {
  favoriteList.innerHTML = '';
  for (const fav of favorites) {
    if (fav.show.image === null) {
      favoriteList.innerHTML += `<li class="filmfav" id="${fav.show.id}"><img class="filmfav__img" src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" alt="Caratula"><div class="filmfav__title"><h3> ${fav.show.name} </h3><button class="filmfav__button js_removeFavButton">X</button></div></li>`;
    } else {
      favoriteList.innerHTML += `<li class="filmfav" id="${fav.show.id}"><img class="filmfav__img" src="${fav.show.image.medium}" alt="Caratula"><div class="filmfav__title"><h3>${fav.show.name}</h3><button class="filmfav__button js_removeFavButton">X</button></div></li>`;
    }
  }
  if (favoriteList.innerHTML === '') {
    listFavoriteTitle.innerHTML = '';
    const deleteAllButton = document.querySelector('.js_removeAllFav');
    if (deleteAllButton !== null) {
      deleteAllButton.remove();
    }
  } else {
    listFavoriteTitle.innerHTML = 'Series favoritas';
    if (document.querySelector('.js_removeAllFav') === null) {
      const deleteAllButton = document.createElement('button');
      const deleteButtonText = document.createTextNode('Borrar favoritos');
      deleteAllButton.appendChild(deleteButtonText);
      deleteAllButton.classList.add('list__fav__button', 'js_removeAllFav');
      listContainer.appendChild(deleteAllButton);
    }
  }
  selectRemoveFavlistener();
}

function handleFilmSelected(ev) {
  const filmSelectedId = parseInt(ev.currentTarget.id);
  const filmClicked = dataFilms.find((film) => film.show.id === filmSelectedId);
  const numberInFavorites = favorites.findIndex((fav) => {
    return fav.show.id === filmSelectedId;
  });

  if (numberInFavorites === -1) {
    favorites.push(filmClicked);
  } else {
    favorites.splice(numberInFavorites, 1);
  }
  paintFavorites(ev);
  paintFilms();
  setInLocalStorage();
}

function selectedFilmListener() {
  const filmSearched = document.querySelectorAll('.js_film');
  for (const eachfilm of filmSearched) {
    eachfilm.addEventListener('click', handleFilmSelected);
  }
}
function isInFavorite(eachdata) {
  const favorite = favorites.find((fav) => {
    return fav.show.id === eachdata.show.id;
  });
  if (favorite === undefined) {
    return false;
  } else {
    return true;
  }
}
function paintFilms() {
  filmList.innerHTML = '';
  let selectedClass = '';

  for (const eachdata of dataFilms) {
    const isFav = isInFavorite(eachdata);
    if (isFav) {
      selectedClass = 'film__selected';
    } else {
      selectedClass = '';
    }
    if (eachdata.show.image === null) {
      filmList.innerHTML += `<li class="film js_film ${selectedClass}" id="${eachdata.show.id}"><img class="film__img" src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" alt="Caratula"><p>${eachdata.show.status}</p><h3 class="film__title">${eachdata.show.name}</h3></li>`;
    } else {
      filmList.innerHTML += `<li class="film js_film ${selectedClass}" id="${eachdata.show.id}"><img class="film__img" src="${eachdata.show.image.medium}" alt="Caratula"><p>${eachdata.show.status}</p><h3 class="film__title">${eachdata.show.name}</h3></li>`;
    }
    listTitle.innerHTML = 'Series';
    selectedFilmListener();
  }
}
function setInLocalStorage() {
  const stringFavoriteFilms = JSON.stringify(favorites);
  localStorage.setItem('favoritesFilms', stringFavoriteFilms);
}
function getApi() {
  const userSearchValue = userSearch.value;
  fetch(`//api.tvmaze.com/search/shows?q=${userSearchValue}`)
    .then((response) => response.json())
    .then((data) => {
      dataFilms = data;
      paintFilms();
    });
}
function getLocalStorage() {
  const localStorageFavorites = localStorage.getItem('favoritesFilms');
  if (localStorageFavorites === null) {
    getApi();
  } else {
    const arrayFavorites = JSON.parse(localStorageFavorites);

    favorites = arrayFavorites;

    paintFavorites();
  }
}
function handleClickButton() {
  getApi();
}
searchButton.addEventListener('click', handleClickButton);

getLocalStorage();
