import React, { useCallback, useState, useEffect } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from "./components/AddMovie";
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      // const response = await fetch("https://swapi.dev/api/films/");
      // const response = await fetch("https://swapi.dev/api/film/"); // wrong url, for testing when occur error
      const response = await fetch("https://all-movie-store-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json");
      
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
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movie) {
    const response = await fetch("https://all-movie-store-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json", {
      method : "POST",
      body : JSON.stringify(movie),
      headers : {
        'Content-Type' : 'application/json'
      }
    });

    const data = await response.json();
    console.log(data);
  }

  let content = "Movies not found!";

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        { content }
      </section>
    </React.Fragment>
  );
}

export default App;
