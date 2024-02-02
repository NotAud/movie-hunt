
const BASE_URL = config.api_base_url
const API_KEY = config.api_key

 async function getPopularMovies(searchTerm) {
    let data = []
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${searchTerm}&api_key=${API_KEY}`)
        const responseData = await response.json()
        data = responseData?.results
        console.log(data)
    } catch (error) {
        
    }
    return data
}
async function getGenres(){
    let data = []
    try {
        const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
        const responseData = await response.json()
        data = responseData
        console.log(data)
    } catch (error) {
        
    }
    return data
}
async function generateGenres (){
    try {
        var data = await getGenres()
        data.genres.forEach(element => {
           console.log(element.name);
           
        });
    
    } catch (error) {
        console.error("Error fetching genres:", error)
    }
    
}
async function createGenreButtons() {
    const genreButtonsContainer = document.querySelector('#genreButtonsContainer');
    const data = await getGenres();
    
    data.genres.forEach(genre => {
        const button = document.createElement('button');
        button.textContent = genre.name;
        button.addEventListener('click', async () => {
            const searchTerm = genre.name;
            const popularMovies = await getPopularMovies(searchTerm);
            displayPopularMovies(popularMovies)
        });
        genreButtonsContainer.appendChild(button);
    });
}
    function displayPopularMovies(movies) {
        const popularMoviesContainer = document.getElementById('popularMoviesContainer');
        popularMoviesContainer.innerHTML = '';

        if (movies && movies.length > 0) {
            movies.forEach(movie => {
                const movieElement = document.createElement('div');
                movieElement.textContent = movie.title;
                popularMoviesContainer.appendChild(movieElement)
            });

        } else {
            const noMoviesMessage = document.createElement('p');
            noMoviesMessage.textContent = 'No popular movies found for this genre.';
            popularMoviesContainer.appendChild(noMoviesMessage);
        }
    }

createGenreButtons ();