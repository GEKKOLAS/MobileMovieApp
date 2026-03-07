// API service for fetching movies from TMDB

const API_BASE_URL = "https://api.themoviedb.org/3";
const BEARER_TOKEN = process.env.EXPO_PUBLIC_MOVIE_API_KEY;

const headers = {
  accept: "application/json",
  Authorization: `Bearer ${BEARER_TOKEN}`,
};

interface FetchMoviesParams {
  query: string;
  page?: number;
}

export const fetchMovies = async ({
  query,
  page = 1,
}: FetchMoviesParams): Promise<Movie[]> => {
  try {
    const endpoint = query
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
      : `${API_BASE_URL}/movie/popular?page=${page}`;

    const response = await fetch(endpoint, { headers });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

export const fetchMovieDetails = async (
  movieId: number,
): Promise<MovieDetails> => {
  try {
    const response = await fetch(`${API_BASE_URL}/movie/${movieId}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};
