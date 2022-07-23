import json
import os
from database.IMDbDAO import IMDbDAO
from imdb import IMDb

environment = os.getenv("BATSON_ENV")
if environment == 'dev':
    import config.develop_config as config
elif environment == 'prod':
    import config.production_config as config
else:
    raise ValueError(
        f"La variable de entorno $BATSON_ENV debe ser 'dev' o 'prod'. Se obtuvo: {environment}:")


class IMDbDAOTemporal(IMDbDAO):
    def __init__(self):
        self._actors = {}
        self._movies = {}
        self._ia = IMDb()
        with open(config.JSON_ACTORS, 'r') as f:
            self._actors = json.load(f)
        with open(config.JSON_MOVIES, 'r') as f:
            try:
                self._movies = json.load(f)
            except:
                pass

    def get_filmography_by_name(self, actor_name):
        return self._actors[actor_name]['filmography']  # list

    def _get_title_movie(self, movie):
        title_keys = ['title', 'localized title', 'long imdb canonical title', 'long imdb title', 'smart canonical title',
                      'smart long imdb canonical title']
        substring = ' - IMDb'
        for key in title_keys:
            if key in movie.keys():
                return movie[key].replace(substring, "")
        return "No hay un título disponible"

    def _get_title_description(self, movie):
        description_keys = ['plot outline', 'plot']
        for key in description_keys:
            if key in movie.keys():
                if isinstance(movie[key], list):
                    return movie[key][0]
                return movie[key]
        return 'No hay una descripción disponible'

    def _get_title_plots(self, movie):
        if 'plot' not in movie.keys():
            return None
        return movie['plot']

    def _get_title_synopsis(self, movie):
        if 'synopsis' in movie.keys():
            if movie['synopsis'][0] is not None:
                return movie['synopsis'][0]
            if movie['synopsis'] is not None:
                return movie['synopsis']

        return None

    def _get_title_rating(self, movie):
        rating_key = 'rating'
        if rating_key in movie.keys():
            return movie[rating_key], movie['votes']
        return -1, -1

    def _get_title_poster(self, movie):
        poster_key = 'full-size cover url'
        if poster_key in movie.keys():
            return movie[poster_key]
        return None

    def get_movie_data(self, movie_id):
        movie = self._ia.get_movie(movie_id)
        title = self._get_title_movie(movie)
        description = self._get_title_description(movie)
        rating, votes = self._get_title_rating(movie)
        poster_url = self._get_title_poster(movie)
        plots = self._get_title_plots(movie)
        synopsis = self._get_title_synopsis(movie)

        return {
            'id': movie_id,
            'title': title,
            'description': description,
            'rating': rating,
            'votes': votes,
            'poster_url': poster_url,
            'plots': plots,
            'synopsis': synopsis
        }

    def _get_genres(self, movie):
        genres_key = 'genres'
        if genres_key in movie.keys():
            return movie[genres_key]
        return None

    def _get_duration(self, movie):
        duration_key = 'runtimes'
        if duration_key in movie.keys():
            return movie[duration_key][0]
        return None

    def _get_year(self, movie):
        year_key = 'year'
        if year_key in movie.keys():
            return movie[year_key]
        return -1

    def _get_cast_roles(self, movie):
        cast_key = 'cast'
        if cast_key in movie.keys():
            cast_roles = []
            cast = movie['cast']
            top_actors = 10
            for actor in cast[:top_actors]:
                if isinstance(actor.currentRole, str):
                    rol = {
                        'actor_name': actor['name'],
                        'role': actor.currentRole
                    }
                    cast_roles.append(rol)
            return cast_roles
        return []

    def _get_director(self, movie):
        director_key = 'director'
        if director_key in movie.keys():
            return movie[director_key][0]['name']
        return ""

    def _get_movie_from_db(self, movie_id):
        if movie_id in self._movies.keys():
            return self._movies[movie_id]
        return None

    def get_movie_data_2(self, movie_id):

        movie_data = self._get_movie_from_db(movie_id)

        if movie_data is None:

            movie = self._ia.get_movie(movie_id)
            # puede ser "No hay un título disponible"
            title = self._get_title_movie(movie)
            # puede ser 'No hay una descripción disponible'
            description = self._get_title_description(movie)
            rating, votes = self._get_title_rating(movie)  # puede ser -1, -1
            poster_url = self._get_title_poster(
                movie) if self._get_title_poster(movie) is not None else ""
            plots = self._get_title_plots(
                movie) if self._get_title_plots(movie) is not None else ""
            synopsis = self._get_title_synopsis(
                movie) if self._get_title_synopsis(movie) is not None else ""
            genres = self._get_genres(movie) if self._get_genres(
                movie) is not None else ""
            duration = self._get_duration(
                movie) if self._get_duration(movie) is not None else ""
            year = self._get_year(movie)
            cast_roles = self._get_cast_roles(movie)  # puede ser lista vacia
            director = self._get_director(movie)  # puede ser string vacia

            movie_data = {
                'id': movie_id,
                'title': title,
                'description': description,
                'rating': rating,
                'votes': votes,
                'poster_url': poster_url,
                'plots': plots,  # list
                'synopsis': synopsis,
                'genres': genres,  # list
                'duration': duration,
                'year': year,
                'cast_roles': cast_roles,  # lista,
                'director': director
            }

            self._insert_new_movie({movie_id: movie_data}, movie_id)

        return movie_data

    def _insert_new_movie(self, movie_data, movie_id):
        self._movies[movie_id] = movie_data[movie_id]
        with open(config.JSON_MOVIES, 'w') as f:
            json.dump(self._movies, f)
