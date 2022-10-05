import React, {useState} from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchMoviesHandler() {
    try {
      setIsLoading(true);
      const response = await fetch("https://swapi.dev/api/films/");
      
      if (!response.ok) {
        throw new Error("Something is wrong!");
      }
      
      const data = await response.json();
      const transformedMoviesDate = data.results.map(movieData => {
        return {
          id : movieData.episode_id,
          title : movieData.title,
          openingText : movieData.opening_crawl,
          releaseDate : movieData.release_date
        }
      })
      setMovies(transformedMoviesDate);
    }
    catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        { !isLoading && movies.length > 0 && <MoviesList movies={movies} /> }
        { !isLoading && movies.length === 0 && !error && <p>Movies not found!</p> }
        { !isLoading && error && <p>{error}</p> }
        { isLoading && <p>Loading...</p> }
      </section>
    </React.Fragment>
  );
}

export default App;
