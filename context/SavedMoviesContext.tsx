import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { Platform } from "react-native";

const STORAGE_KEY = "saved_movies";

interface SavedMovie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
}

interface SavedMoviesContextValue {
  saved: SavedMovie[];
  isSaved: (id: number) => boolean;
  toggleSave: (movie: SavedMovie) => void;
}

const SavedMoviesContext = createContext<SavedMoviesContextValue>({
  saved: [],
  isSaved: () => false,
  toggleSave: () => {},
});

function readStorage(): SavedMovie[] {
  if (Platform.OS === "web") {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function writeStorage(movies: SavedMovie[]) {
  if (Platform.OS === "web") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
    } catch {}
  }
}

export function SavedMoviesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [saved, setSaved] = useState<SavedMovie[]>([]);

  // Hydrate from storage on mount
  useEffect(() => {
    setSaved(readStorage());
  }, []);

  const isSaved = useCallback(
    (id: number) => saved.some((m) => m.id === id),
    [saved],
  );

  const toggleSave = useCallback((movie: SavedMovie) => {
    setSaved((prev) => {
      const exists = prev.some((m) => m.id === movie.id);
      const next = exists
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie];
      writeStorage(next);
      return next;
    });
  }, []);

  return (
    <SavedMoviesContext.Provider value={{ saved, isSaved, toggleSave }}>
      {children}
    </SavedMoviesContext.Provider>
  );
}

export function useSavedMovies() {
  return useContext(SavedMoviesContext);
}
