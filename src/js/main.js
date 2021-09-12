'use strict';
const form = document.querySelector('.js_form');
const userSearch = document.querySelector('.js_userText');
const searchButton = document.querySelector('.js_searchButton');
const filmList = document.querySelector('.js_filmList');
const favoriteList = document.querySelector('.js_favoriteList');
const listTitle = document.querySelector('.js_listTitle');
const listFavoriteTitle = document.querySelector('.js_listFavoriteTitle');
let dataFilms = [];
let favorites = [];

function submitDefault(event) {
  event.preventDefault();
}
form.addEventListener('submit', submitDefault);

function paintFavorites() {
  favoriteList.innerHTML = '';

  for (const fav of favorites) {
    if (fav.show.image === null) {
      favoriteList.innerHTML += `<li class="film js_film" id="${fav.show.id}"><img src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" alt="Caratula"><div class="film__title"><h3>${fav.show.name}</h3><button class="js_ressetButton">X</button></div></li>`;
    } else {
      favoriteList.innerHTML += `<li class="film js_film" id="${fav.show.id}"><img src="${fav.show.image.medium}" alt="Caratula"><div class="film__title"><h3>${fav.show.name}</h3><button class="js_ressetButton"</button>X</div></li>`;
    }
  }
  listFavoriteTitle.innerHTML = 'Series favoritas';
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
      filmList.innerHTML += `<li class="film js_film ${selectedClass}" id="${eachdata.show.id}"><img src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" alt="Caratula"><h3 class="film__title">${eachdata.show.name}</h3></li>`;
    } else {
      filmList.innerHTML += `<li class="film js_film ${selectedClass}" id="${eachdata.show.id}"><img src="${eachdata.show.image.medium}" alt="Caratula"><h3 class="film__title">${eachdata.show.name}</h3></li>`;
    }
    listTitle.innerHTML = 'Series';
    selectedFilmListener();
  }
}
function setInLocalStorage() {
  const stringFilms = JSON.stringify(dataFilms);
  const stringFavoriteFilms = JSON.stringify(favorites);
  localStorage.setItem('films', stringFilms);
  localStorage.setItem('favoritesFilms', stringFavoriteFilms);
}
function getApi() {
  const userSearchValue = userSearch.value;
  fetch(`//api.tvmaze.com/search/shows?q=${userSearchValue}`)
    .then((response) => response.json())
    .then((data) => {
      dataFilms = data;
      paintFilms();
      setInLocalStorage();
    });
}
function getLocalStorage() {
  const localStorageFilms = localStorage.getItem('films');
  const localStorageFavorites = localStorage.getItem('favoritesFilms');
  if (localStorageFilms === null || localStorageFavorites === null) {
    getApi();
  } else {
    const arrayFavorites = JSON.parse(localStorageFavorites);
    const arrayFilms = JSON.parse(localStorageFilms);
    favorites = arrayFavorites;
    dataFilms = arrayFilms;
    paintFilms();
    paintFavorites();
  }
}
function handleClickButton() {
  getApi();
}
searchButton.addEventListener('click', handleClickButton);
getLocalStorage();
