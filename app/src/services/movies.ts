import {
  URL_IMDb_CRITICS,
  URL_IMDb_MOVIE,
  URL_IMDb_YOUTUBE_ID,
  URL_POLLING,
  URL_POST,
  URL_STREAMING_SERVICES,
} from '../utils/IPS';

export enum BatsonStatusEnum {
  STATUS_GETTING_AUDIO = 'getting_audio',
  STATUS_GETTING_FRAMES = 'getting_frames',
  STATUS_PROCESSING_VIDEO = 'processing_video',
  STATUS_PROCESSING_IMAGE = 'processing_image',
  STATUS_GETTING_MOVIES = 'getting_movies',
  STATUS_PONDERATING = 'ponderating_movies',
  STATUS_FINISHED = 'finished',
  STATUS_ERROR = 'error',
}

export type CandidatesMoviesResponseData = {
  id: string;
  coincidence: number;
  date: string;
};

export type CandidatesMoviesResponse = {
  type: 'movies';
  status: BatsonStatusEnum;
  progress: number;
  data: CandidatesMoviesResponseData[];
};

type StreamingsNames = 'disney' | 'hbo' | 'netflix' | 'prime';

export type TStreaming = {
  streamingInfo: {
    [k in StreamingsNames]?: {
      ar: {
        link: string;
      };
    };
  };
};

export type TYoutubeID = {
  videoId: string;
  videoUrl: string;
  errorMessage: string;
};
type TCritics = {
  title: string;
  content: string;
  rate: number;
  reviewLink: string;
};
export type Movie = {
  type: 'movie';
  id: string;
  title: string;
  image: string;
  plot: string;
  plotLocal: string;
  runtimeMins: number;
  imDbRating: number;
  year: number;
  genreList: { key: string; value: string }[];
  date: string;
  coincidence: number;
  videoYoutubeId?: string;
  errorMessage?: string;
  streamings?: TStreaming;
  actorList: {
    id: string;
    image: string;
    name: string;
    asCharacter: string;
  }[];
  critics: TCritics[];
};

export const getMoviesCandidates = async (requestID: string) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await fetch(URL_POLLING + requestID, {
      method: 'GET',
    });

    const candidatesMoviesResponse =
      (await response.json()) as CandidatesMoviesResponse;

    return candidatesMoviesResponse;
  } catch (error) {
    throw error;
  } 
};

export const getBatsonsIdByFile = async (path: string, mime: string) => {
  const formData = new FormData();
  formData.append('file', {
    name: 'mobile-file-upload.' + path.split('.').pop(),
    uri: path,
    type: mime,
  });

  const responseID = await fetch(URL_POST, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });

  const {
    data: { id: requestID },
  } = (await responseID.json()) as {
    data: { id: string };
  };
  return { requestID };
};

export const completeMovieInfo = async (
  movieWithoutInfo: Partial<CandidatesMoviesResponseData> & { id: string },
): Promise<Required<Movie>> => {
  const response = await fetch(URL_IMDb_MOVIE + movieWithoutInfo.id, {
    method: 'GET',
  });
  const movieResponse = (await response.json()) as Movie;
  if (movieResponse?.errorMessage) {
    throw new Error();
  }

  const youtubeID = await fetch(URL_IMDb_YOUTUBE_ID + movieWithoutInfo.id, {
    method: 'GET',
  });
  const youtubeIDResponse = (await youtubeID.json()) as TYoutubeID;

  let streamings: TStreaming = {streamingInfo: {}};
  try{
    const streamingResponse = await fetch(
      URL_STREAMING_SERVICES + movieWithoutInfo.id,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'streaming-availability.p.rapidapi.com',
          'x-rapidapi-key': '12e292b6a7msh08d67adace490b5p161815jsnf849ea9a6cb3',
        },
      },
    );
    streamings = (await streamingResponse.json()) as TStreaming;
  }catch(e){
    console.log(e);
  }


  const criticsResponse = await fetch(URL_IMDb_CRITICS + movieWithoutInfo.id, {
    method: 'GET',
  });
  const critics = (await criticsResponse.json()) as { items: TCritics[] };

  const merge = {
    ...movieWithoutInfo,
    ...movieResponse,
    type: 'movie',
    videoYoutubeId: youtubeIDResponse.videoId,
    streamings,
    critics: critics.items,
  } as Required<Movie>;

  return merge;
};
