import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Easing,
  runOnJS,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { URL_SEARCH } from '../../../utils/IPS';

export type BatsonSearch = {
  data: (Actor | Movie)[];
};

export type Actor = {
  id: string;
  image: string;
  imageUri: string;
  resultType: 'Name';
  title: string;
};

export type Movie = {
  id: string;
  image: string;
  resultType: 'Title';
  posterUri: string;
  releaseYear: number;
  genres: string[];
  duration: number;
  title: string;
  description: string;
  rating: number;
};

export const useSearch = () => {
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [searchResponse, setSearchResponse] = useState<BatsonSearch | null>(
    null,
  );
  const searchProgress = useSharedValue(0);
  const _isMountedRef = useRef<boolean>(true);

  const resetSearch = useCallback(() => {
    setSearchResponse(null);
    setHasError(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    _isMountedRef.current = true;
    return () => {
      _isMountedRef.current = false;
    };
  }, []);

  const showError = () => {
    _isMountedRef.current && setHasError(true);
    _isMountedRef.current && setLoading(false);
  };

  const search = useCallback(async (query: string) => {
    setLoading(true);
    setHasError(false);
    try {
      const response = await fetch(URL_SEARCH + '?query=' + query, {
        method: 'GET',
      });

      const parsedResponse = (await response.json()) as BatsonSearch;

      if (parsedResponse.data.length > 0) {
        setSearchResponse(parsedResponse);
      } else {
        setSearchResponse(null);
      }
      setHasError(false);
    } catch (error) {
      setSearchResponse(null);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const openingSearchAnimation = (callback: () => void) => {
    searchProgress.value = withTiming(
      1,
      {
        duration: 450,
        easing: Easing.linear,
      },
      () => {
        runOnJS(callback)();
      },
    );
  };

  const closingSearchAnimation = (callback: () => void) => {
    searchProgress.value = withTiming(
      0,
      {
        duration: 300,
        easing: Easing.inOut(Easing.sin),
      },
      () => {
        runOnJS(callback)();
      },
    );
  };

  return {
    search,
    resetSearch,
    setLoading,
    showError,
    loading,
    searchResponse,
    hasError,
    searchAnimationProgress: searchProgress,
    openingSearchAnimation,
    closingSearchAnimation,
  };
};
