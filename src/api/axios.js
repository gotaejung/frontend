import axios from 'axios';

//영화 api용(TMDB API)
const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/movie/',
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
  }
})


//챗봇 API(Flask 백엔드)
const chatApi = axios.create({
  baseURL: 'https://backend-1w2e.onrender.com',
  //baseURL: 'http://localhost:8000',
  headers: { 
    'Content-Type': 'application/json' } 
});

export { chatApi };
export default api;