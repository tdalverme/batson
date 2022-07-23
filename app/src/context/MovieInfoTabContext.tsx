import React, { useEffect, useRef, useState } from 'react';
import { completeMovieInfo, Movie } from '../services/movies';

type MovieTabInfoContextState = {
  movieTabInfo: null | Movie;
  loading: boolean;
  hasError: boolean;
  fetchMovieTabInfo: (idMovie: string) => void;
  setMovieTabInfo: (movie: Movie | null) => void;
};

export const MovieTabInfoContext = React.createContext(
  {} as MovieTabInfoContextState,
);

export const MovieTabInfoProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [movieTabInfo, setMovieTabInfo] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const _isMountedRef = useRef<boolean>(true);
  useEffect(() => {
    _isMountedRef.current = true;
    return () => {
      _isMountedRef.current = false;
    };
  }, []);

  const fetchMovieTabInfo = async (movieID: string) => {
    setLoading(true);
    try {
      const currentMovieTabInfo = await completeMovieInfo({ id: movieID });
      _isMountedRef.current && setMovieTabInfo({
        ...currentMovieTabInfo,
      });
    } catch (_error) {
      _isMountedRef.current && setMovieTabInfo(null);
      _isMountedRef.current && setHasError(true);
    } finally {
      _isMountedRef.current && setLoading(false);
    }
  };

  return (
    <MovieTabInfoContext.Provider
      value={{
        movieTabInfo,
        loading,
        hasError,
        fetchMovieTabInfo,
        setMovieTabInfo,
      }}>
      {children}
    </MovieTabInfoContext.Provider>
  );
};
