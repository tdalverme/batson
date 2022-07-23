import { useNavigation } from '@react-navigation/core';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectMovieBatson,
  setCandidatesMovies,
} from '../../../redux/reducers/movieBatsonSlice';
import {
  BatsonStatusEnum,
  completeMovieInfo,
  getBatsonsIdByFile,
  getMoviesCandidates,
  Movie,
} from '../../../services/movies';
import { timeout } from '../../../utils/timeout';

const MAX_NUMBER_OF_REQUEST = 30;

const useFetchMovieCandidates = () => {
  const navigation = useNavigation() as any;

  const { file } = useSelector(selectMovieBatson);
  const dispatch = useDispatch();

  const [hasError, setHasError] = useState(false);
  const [progress, setProgress] = useState({ step: 0, duration: 0 });

  const numberOfRequest = useRef(0);
  const _isMounted = useRef<boolean>(true);

  useEffect(() => {
    _isMounted.current = true;
    return () => {
      _isMounted.current = false;
    };
  }, []);
  

  const abortFetching = () => {
    _isMounted.current && setProgress({ step: 9.5, duration: 12000 });
    _isMounted.current && setHasError(true);
  };

  const fetchMovieCandidates = async () => {
    try {
      setProgress({ step: 3, duration: 15000 });
      const { requestID } = await getBatsonsIdByFile(file.path, file.mime);
      await timeout(10000);
      _polling(requestID);
    } catch (e) {
      console.log({ e });
      abortFetching();
    }
  };
    
  const _polling = async (requestID: string): Promise<void> => {
    if (numberOfRequest.current === MAX_NUMBER_OF_REQUEST) {
      return abortFetching();
    } 
    numberOfRequest.current++;
    
    try{
      const {
        data,
        status,
        progress: step,
      } = await getMoviesCandidates(requestID);
  
      const actionByState = {
        [BatsonStatusEnum.STATUS_ERROR]: () => {
          return abortFetching();
        },
        [BatsonStatusEnum.STATUS_FINISHED]: async () => {
          _isMounted.current && setProgress({ step: 9.5, duration: 12000 });
          let candidatesMovies: (Required<Movie>[] | null) = null;
          try {
            candidatesMovies = await Promise.all(data.map(completeMovieInfo));
          } catch (e) {
            abortFetching();
          }
      
          _isMounted.current && dispatch(setCandidatesMovies(candidatesMovies));
          _isMounted.current && setProgress({ step: 10, duration: 200 });
  
          if (candidatesMovies && candidatesMovies.length > 0) {
            await timeout(200);
            _isMounted.current && navigation.replace('CandidatesMoviesScreen', { readonly: false });
          }
        },
        [BatsonStatusEnum.STATUS_GETTING_MOVIES]: async ()=> {
          _isMounted.current && setProgress({ step: 9, duration: 12000 });
        },
        [BatsonStatusEnum.STATUS_PROCESSING_VIDEO]: async ()=> {
          if(step >= 0 && step <= 1){
            _isMounted.current && setProgress({
              step: 4 + step * 4,
              duration: 8000,
            });
          } 
        }
      };
  
      actionByState[status as keyof typeof actionByState]?.();
  
      if(status !== BatsonStatusEnum.STATUS_FINISHED){
        await timeout(2000);
        _polling(requestID);
      }
    } catch (error) {
      await timeout(2000);
      _polling(requestID);
    }
  };

  return {
    fetchMovieCandidates,
    hasError,
    progress,
  };
};

export default useFetchMovieCandidates;
