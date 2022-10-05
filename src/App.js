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
      const rawData = await fetch("https://all-movie-store-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json");

      if (!rawData.ok) {
        throw new Error("Something is wrong!");
      } else {
        setError(false);
      }

      const moviesData = await rawData.json();

      let loadedMovies = [];
      for (const key in moviesData) {
        loadedMovies.push({
          id : key,
          title : moviesData[key].title,
          openingText : moviesData[key].openingText,
          releaseDate : moviesData[key].releaseDate,
        });
      }

      setMovies(loadedMovies);
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
    try {
      setIsLoading(true);
      const response = await fetch("https://all-movie-store-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json", {
        method : "POST",
        body : JSON.stringify(movie),
        headers : {
          'Content-Type' : 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error("Something is wrong!");
      }

      fetchMoviesHandler(); // for getting updated movies list
    }
    catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
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
