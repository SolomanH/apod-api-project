const form = document.querySelector('form');
const dateInput = document.querySelector('#date');
const apodContainer = document.querySelector('#apod-container');
const favoritesContainer = document.querySelector('#favorites-container');


form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const date = dateInput.value;

  try {
    const apodData = await getApodData(date);
    displayApodData(apodData);
  } catch (error) {
    console.error(error);
    alert('An error occurred. Please try again later.');
  }
});


async function getApodData(date) {
  const apiKey = 'PmWouVpGaU1gTP1gGxHvQKlTeHcJgBVtrtODNz2H';
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  return data;
}


function displayApodData(apodData) {
    const title = apodData.title;
    const date = apodData.date;
    const explanation = apodData.explanation;
    const imageUrl = apodData.url;
    const hdImageUrl = apodData.hdurl || imageUrl; 
  
    const titleElement = document.createElement('h2');
    titleElement.textContent = title;
  
    const dateElement = document.createElement('p');
    dateElement.textContent = date;
  
    const explanationElement = document.createElement('p');
    explanationElement.textContent = explanation;
  
    const imageElement = document.createElement('img');
    imageElement.src = imageUrl;
  
    
    imageElement.style.width = '800px';
    imageElement.style.height = '500px';
  
   
    imageElement.style.position = 'relative';
  
   
    imageElement.addEventListener('click', () => {
      const popupContainer = document.createElement('div');
      popupContainer.style.position = 'absolute';
      popupContainer.style.top = '0';
      popupContainer.style.left = '0';
      popupContainer.style.width = '80%';
      popupContainer.style.height = '100%';
      popupContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      popupContainer.style.display = 'flex';
      popupContainer.style.justifyContent = 'center';
      popupContainer.style.alignItems = 'center';
      popupContainer.style.zIndex = '999';
  
      const popupImage = document.createElement('img');
      popupImage.src = hdImageUrl;
      popupImage.style.maxWidth = '40%';
      popupImage.style.maxHeight = '70%';
  
      popupContainer.appendChild(popupImage);
  
      document.body.appendChild(popupContainer);
  
     
      popupContainer.addEventListener('click', () => {
        document.body.removeChild(popupContainer);
      });
    });
  
    apodContainer.innerHTML = '';
    apodContainer.appendChild(titleElement);
    apodContainer.appendChild(dateElement);
    apodContainer.appendChild(explanationElement);
    apodContainer.appendChild(imageElement);
  
    const favoriteButton = document.createElement('button');
    favoriteButton.textContent = 'Save to Favorites';
    favoriteButton.addEventListener('click', () => {
      addFavorite(apodData);
    });
    apodContainer.appendChild(favoriteButton);
  }
  

function addFavorite(apod) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push(apod);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  
   
    showFavorites();
  }
  


function removeFavorite(apodUrl) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites = favorites.filter(favorite => favorite.url !== apodUrl);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  showFavorites();
  
}


function showFavorites() {
    favoritesContainer.innerHTML = '';
    
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (favorites.length === 0) {
        const noFavoritesMessage = document.createElement('p');
       
        favoritesContainer.appendChild(noFavoritesMessage);
    } else {
        favorites.forEach(favorite => {
            const favoriteContainer = document.createElement('div');
            favoriteContainer.classList.add('favorite-container');

            const favoriteTitle = document.createElement('h2');
            favoriteTitle.textContent = favorite.title;
            favoriteContainer.appendChild(favoriteTitle);

            const favoriteDate = document.createElement('p');
            favoriteDate.textContent = favorite.date;
            favoriteContainer.appendChild(favoriteDate);

            const favoriteImage = document.createElement('img');
            favoriteImage.src = favorite.url;
            favoriteImage.alt = favorite.title;
            favoriteImage.addEventListener('click', () => {
                window.open(favorite.hdurl);
            });
            favoriteContainer.appendChild(favoriteImage);

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', () => {
                removeFavorite(favorite.url);
            });
            favoriteContainer.appendChild(removeButton);

            favoritesContainer.appendChild(favoriteContainer);
        });
    }
}

  
  showFavorites();
  

  const showFavoritesButton = document.createElement('button');
  showFavoritesButton.textContent = ' Favorites';
  showFavoritesButton.addEventListener('click', () => {
    showFavorites();
  });
  document.body.appendChild(showFavoritesButton);

  
  