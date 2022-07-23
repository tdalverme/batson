// import { Platform } from 'react-native';

export const URL_POST = 'https://batson-webapp.herokuapp.com/upload-file/';
export const URL_POLLING = 'https://batson-webapp.herokuapp.com/results/';
export const URL_SEARCH = 'https://batson-webapp.herokuapp.com/search';

// export const URL_POST =
//   Platform.OS === 'ios'
//     ? 'http://127.0.0.1:5000/upload-file/'
//     : 'http://10.0.2.2:5000/upload-file/';

// export const URL_POLLING =
//   Platform.OS === 'ios'
//     ? 'http://127.0.0.1:5000/results/'
//     : 'http://10.0.2.2:5000/results/';

// export const URL_SEARCH =
//   Platform.OS === 'ios'
//     ? 'http://127.0.0.1:5000/search'
//     : 'http://10.0.2.2:5000/search';

// export const IMDb_API_KEY = 'k_o4melqoy/';
export const IMDb_API_KEY = 'k_rva2kvup/';

export const URL_IMDb_MOVIE =
  'https://imdb-api.com/es/API/Title/' + IMDb_API_KEY;
export const URL_IMDb_NAME = 'https://imdb-api.com/en/API/Name/' + IMDb_API_KEY;
export const URL_IMDb_TRAILER =
  'https://imdb-api.com/en/API/YouTube/' + IMDb_API_KEY;
export const URL_IMDb_YOUTUBE_ID =
  'https://imdb-api.com/en/API/YouTubeTrailer/' + IMDb_API_KEY;
export const URL_IMDb_CRITICS =
  'https://imdb-api.com/en/API/Reviews/' + IMDb_API_KEY;
export const URL_STREAMING_SERVICES =
  'https://streaming-availability.p.rapidapi.com/get/basic?country=ar&imdb_id=';

// export const URL_POST = 'https://backend.mocklab.io/upload-file';
// export const URL_POLLING = 'https://backend.mocklab.io/results/';
// export const URL_IMDb_YOUTUBE_ID = 'https://imdb.mocklab.io/YouTubeTrailer/';
// export const URL_IMDb_MOVIE = 'https://imdb.mocklab.io/Title/';
// export const URL_IMDb_CRITICS = 'https://imdb.mocklab.io/Reviews/';
// export const URL_STREAMING_SERVICES = 'https://imdb.mocklab.io/Streamings/';
