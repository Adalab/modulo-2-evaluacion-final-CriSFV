'use strict';
let userSearch = document.querySelector('.js_userName');
const searchButton = document.querySelector('.js_searchButton');
const filmList = document.querySelector('.filmList');

function eraserClick(ev) {
  ev.preventDefault();
}
userSearch.addEventListener('submit', eraserClick);

function searchFilm() {
  const userSearchValue = userSearch.value;

  fetch(`//api.tvmaze.com/search/shows?q=${userSearchValue}`)
    .then((response) => response.json())
    .then((data) => {
      for (const eachdata of data) {
        filmList.innerHTML += `<li><img src="${eachdata.show.image.medium}" alt="Caratula"><h3 class="film-title">${eachdata.show.name}</h3></li>`;
      }
    });
}

function handleClickButton(ev) {
  console.log(ev.currentTarget);
  console.log(ev.target);
  searchFilm();
}

searchButton.addEventListener('click', handleClickButton);
