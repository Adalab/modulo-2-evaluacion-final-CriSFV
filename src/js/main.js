'use strict';
const userSearch = document.querySelector('.js_userText');
const searchButton = document.querySelector('.js_searchButton');
const filmList = document.querySelector('.js_filmList');
const favoriteList = document.querySelector('.js_favoriteList');

function submitDefault(event) {
  event.preventDefault();
}
userSearch.addEventListener('submit', submitDefault);

function searchFilm() {
  const userSearchValue = userSearch.value;
  fetch(`//api.tvmaze.com/search/shows?q=${userSearchValue}`)
    .then((response) => response.json())
    .then((data) => {
      for (const eachdata of data) {
        if (eachdata.show.image === null) {
          filmList.innerHTML += `<li class="film js_film"><img src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" alt="Caratula"><h3 class="film__title">${eachdata.show.name}</h3></li>`;
        } else {
          filmList.innerHTML += `<li class="film js_film"><img src="${eachdata.show.image.medium}" alt="Caratula"><h3 class="film__title">${eachdata.show.name}</h3></li>`;
        }
        selectedFilmListener();
      }
    });
}
function handleFavoriteFilmSelected(ev) {
  const filmSelected = ev.target.parentElement;
  filmSelected.classList.toggle('film__selected');
  //si está, no volverlo a añadir, y si se desmarca eliminarlo
  favoriteList.innerHTML += filmSelected.innerHTML;
}

function selectedFilmListener() {
  const filmSearched = document.querySelectorAll('.js_film');
  for (const eachfilm of filmSearched) {
    eachfilm.addEventListener('click', handleFavoriteFilmSelected);
  }
}

function handleClickButton() {
  searchFilm();
}
searchButton.addEventListener('click', handleClickButton);
