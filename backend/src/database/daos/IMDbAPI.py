import os
import time
import requests
from database.IMDbDAO import IMDbDAO

environment = os.getenv("BATSON_ENV")
if environment == 'dev':
    import config.develop_config as config
elif environment == 'prod':
    import config.production_config as config
else:
    raise ValueError(
        f"La variable de entorno $BATSON_ENV debe ser 'dev' o 'prod'. Se obtuvo: {environment}:")


# https://rapidapi.com/SAdrian/api/data-imdb1/
# https://rapidapi.com/apidojo/api/imdb8/
# https://rapidapi.com/movie-of-the-night-movie-of-the-night-default/api/streaming-availability/

class IMDbAPI(IMDbDAO):
    def __init__(self):
        self.rapid_api_key = config.RAPID_API_KEY
        self.rapid_api_host = config.RAPID_API_HOST
        self.imdb_api_key = config.IMDB_API_KEY
        super().__init__()

    def search(self, query):
        url = f"https://imdb-api.com/es/API/SearchAll/{self.imdb_api_key}/{query.replace(' ', '%20')}"
        print(url)
        response_imdb_api = requests.request("GET", url).json()

        if(response_imdb_api['errorMessage']):
            print(f"[!] Error en endpoint '{url}'. Error: {response_imdb_api['errorMessage']}")
            return { "type":"search", "data": [] }
            
        response_imdb_api = response_imdb_api['results']
        results = []
        for result in response_imdb_api:
            if result['resultType'] == 'Name' or result['resultType'] == 'Title':
                results.append(result)

        return {"type":"search", "data": results}

    def get_actor_id(self, actor_name):
        formatted_name = actor_name.replace(' ', '%20')
        url = f"https://data-imdb1.p.rapidapi.com/actor/imdb_id_byName/{formatted_name}/"

        headers = {
            'x-rapidapi-host': "data-imdb1.p.rapidapi.com",
            'x-rapidapi-key': self.rapid_api_key
        }

        response = requests.request("GET", url, headers=headers)
        response = response.json()

        if len(response['results']) == 0:
            print(f"[!] No se encontró el ID de '{actor_name}'")
            return None

        if 'message' in response:
            print(f"[!] Error en endpoint '{url}'. Error: {response['message']}")
            time.sleep(1)
            response = requests.request("GET", url, headers=headers)
            response = response.json()

        if response['results'][0]:
            return response['results'][0]['imdb_id']
        
        return None


    def get_filmography_by_id(self, actor_id):
        url = f"https://data-imdb1.p.rapidapi.com/movie/byActor/{actor_id}/"

        headers = {
            'x-rapidapi-host': "data-imdb1.p.rapidapi.com",
            'x-rapidapi-key': self.rapid_api_key
        }

        response = requests.request("GET", url, headers=headers)
        response = response.json()

        if 'message' in response:
            print(f"[!] Error en endpoint '{url}'. Error: {response['message']}")
            time.sleep(1)
            response = requests.request("GET", url, headers=headers)
            response = response.json()

        if response['results']:
            filmography = []
            for movie in response['results']:
                filmography.append(movie[0]['imdb_id'])

            return filmography

        return []

    def get_filmography_by_name(self, actor_name):
        actor_id = self.get_actor_id(actor_name)

        if actor_id:
            return self.get_filmography_by_id(actor_id)
        
        return []

    def get_movie_data(self, movie_id):
        plots = self.__get_plots(movie_id)
        synopses = self.__get_synopses(movie_id)

        movie_data = {
            'id': movie_id,
            'plots': plots,
            'synopsis': synopses,
        }

        return movie_data

    def __get_plots(self, movie_id):
        url_rapid_api = "https://imdb8.p.rapidapi.com/title/get-plots"

        querystring = {"tconst":f"{movie_id}"}

        headers = {
            'x-rapidapi-key': self.rapid_api_key,
            'x-rapidapi-host': self.rapid_api_host
        }

        response_rapid_api = requests.request("GET", url_rapid_api, headers=headers, params=querystring)
        response_rapid_api = response_rapid_api.json()

        if 'message' in response_rapid_api:
            print(f"[!] Error en endpoint '{url_rapid_api}'. Error: {response_rapid_api['message']}")
            time.sleep(1)
            response_rapid_api = requests.request("GET", url_rapid_api, headers=headers, params=querystring)
            response_rapid_api = response_rapid_api.json()

        plots = []
        for plot in response_rapid_api['plots']:
            plots.append(plot['text'])
        
        return plots

    def __get_synopses(self, movie_id):
        url_rapid_api = "https://imdb8.p.rapidapi.com/title/get-synopses"

        querystring = {"tconst":f"{movie_id}"}

        headers = {
            'x-rapidapi-key': self.rapid_api_key,
            'x-rapidapi-host': self.rapid_api_host
        }

        response_rapid_api = requests.request("GET", url_rapid_api, headers=headers, params=querystring)
        response_rapid_api = response_rapid_api.json()

        if 'message' in response_rapid_api:
            print(f"[!] Error en endpoint '{url_rapid_api}'. Error: {response_rapid_api['message']}")
            time.sleep(1)
            response_rapid_api = requests.request("GET", url_rapid_api, headers=headers, params=querystring)
            response_rapid_api = response_rapid_api.json()

        synopses = []
        for synopsis in response_rapid_api:
            if synopsis['text']:
                synopses.append(synopsis['text'])
        
        return synopses