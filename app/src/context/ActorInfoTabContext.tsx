import React, { useEffect, useRef, useState } from 'react';
import { URL_IMDb_NAME } from '../utils/IPS';

export type TActorInfo = {
  id: string;
  name: string;
  summary: string;
  image: string;
  birthDate: string;
  deathDate: string;
  errorMessage?: string;
  castMovies: {
    id: string;
    title: string;
    year: number;
    role: string;
  }[];
};

type ActorInfoTabContextState = {
  actorInfo: null | TActorInfo;
  loading: boolean;
  hasError: boolean;
  fetchActorDetails: (idActor: string) => void;
};

export const ActorInfoTabContext = React.createContext(
  {} as ActorInfoTabContextState,
);

export const ActorInfoTabProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [actorInfo, setActorInfo] = useState<TActorInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const _isMounted = useRef<boolean>(true);
  useEffect(() => {
    _isMounted.current = true;
    return () => {
      _isMounted.current = false;
    };
  }, []);

  const fetchActorDetails = async (actorId: string) => {
    setLoading(true);
    setHasError(false);

    try {
      const response = await fetch(URL_IMDb_NAME + actorId, {
        method: 'GET',
      });

      const batsonResponse = (await response.json()) as TActorInfo;

      if(batsonResponse?.errorMessage !== ''){
        _isMounted.current && setHasError(true);
      }else {
        _isMounted.current && setActorInfo(batsonResponse);
      }
    } catch (error) {
      console.log({ error });
      _isMounted.current && setHasError(true);
    } finally {
      _isMounted.current && setLoading(false);
    }
  };

  return (
    <ActorInfoTabContext.Provider
      value={{
        actorInfo,
        loading,
        hasError,
        fetchActorDetails,
      }}>
      {children}
    </ActorInfoTabContext.Provider>
  );
};
