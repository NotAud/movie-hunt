
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
getPopularMovies('John Wick')