import string
import re
import os
import numpy as np
from audio_module.Ponderator import Ponderator
from collections import defaultdict
from gensim import corpora, models, similarities

environment = os.getenv("BATSON_ENV")
if environment == 'dev':
    import config.develop_config as config
elif environment == 'prod':
    import config.production_config as config
else:
    raise ValueError(
        f"La variable de entorno $BATSON_ENV debe ser 'dev' o 'prod'. Se obtuvo: {environment}:")


class AudioPonderator(Ponderator):
    def __init__(self, movies, text, dao):
        super().__init__(movies, text, dao)
        self.xp = [0, 100]
        self.fp = [config.MIN_SIMILARITY, 100]

    def ponderate(self):
        """
        Pondera la lista de peliculas de acuerdo al texto del audio escuchado.\n
        ---
        Return: dict(int, float)
            Devuelve un diccionario donde cada tupla representa (id pelicula, indice de coincidencia).
        """
        if config.VERBOSE:
            print("[AUDIO] Iniciando ponderacion por audio...")

        similarity_by_movie = {}

        plots = []
        for movie in self.movies:
            movie_plots = []

            if movie['plots'] is not None:
                movie_plots.extend(movie['plots'])

            if movie['synopsis'] is not None:
                movie_plots.extend(movie['synopsis'])

            plots.append(movie_plots)

        if config.VERBOSE:
            print("[AUDIO] Procesando textos...")
        texts = []
        for movie_plots in plots:
            texts.append(self.__get_movie_keywords(movie_plots))

        if config.VERBOSE:
            print("[AUDIO] Creando modelo LSI...")
        dictionary = corpora.Dictionary(texts)
        corpus = [dictionary.doc2bow(text) for text in texts]
        lsi = models.LsiModel(corpus, id2word=dictionary,
                              num_topics=len(self.movies))
        if config.VERBOSE:
            print("[AUDIO] Modelo LSI creado.")

        vec_bow = dictionary.doc2bow(self.object.lower().split())

        if config.VERBOSE:
            print("[AUDIO] Ponderando peliculas...")

        if len(vec_bow) == 0:
            for i in range(0, len(self.movies)):
                sim = 1 / len(self.movies) * 100
                similarity_by_movie[self.movies[i]
                                    ['id']] = np.interp(sim, self.xp, self.fp)
            return similarity_by_movie

        vec_lsi = lsi[vec_bow]
        index = similarities.MatrixSimilarity(lsi[corpus])

        sims = index[vec_lsi]

        total = 0
        for sim in sims:
            total += max(0, sim)

        for i in range(0, len(self.movies)):
            sim = max(0, sims[i]) / total * 100
            sim = np.interp(sim, self.xp, self.fp)

            similarity_by_movie[self.movies[i]['id']] = sim
        if config.VERBOSE:
            print("[AUDIO] Ponderacion completa.")

        return similarity_by_movie

    def __get_movie_keywords(self, movie_plots):
        """
        Devuelve una lista de palabras claves.\n
        ---
        Parametros:
            movie_plots: list(str)
                Lista de tramas de la pelicula.\n
        ---
        Return: list(str)
            Devuelve la lista de palabras claves de la pelicula.
        """
        movie_words = []

        for plot in movie_plots:
            preprocessed_text = self.__remove_punctuation(plot)
            preprocessed_text = self.__remove_stopwords(preprocessed_text)
            preprocessed_text = self.__remove_low_freq(
                preprocessed_text, config.LOW_FREQUENCY)
            movie_words.extend(preprocessed_text)

        return movie_words

    def __remove_punctuation(self, text):
        res = ''
        for word in text.split(' '):
            res += ' ' + re.sub('['+string.punctuation+']', ' ', word)
        return res

    # removes stopwords from texts
    def __remove_stopwords(self, text):
        """
        Elimina las palabras vacias (stopwords) del texto.\n
        ---
        Parametros:
            text: str
                Texto a procesar.\n
        ---
        Return: list(str)
            Devuelve la lista de palabras no presentes en la lista de stopwords.
        """
        texts = [word for word in text.lower().split()
                 if word not in config.STOPWORDS]

        return texts

    # removes words with frequency lower than freq
    def __remove_low_freq(self, text, freq):
        """
        Elimina las palabras con frecuencia menor a freq.\n
        ---
        Parametros:
            text: str
                Texto a procesar.\n
            freq: int
                Frecuencia minima de las palabras en el texto
        ---
        Return: list(str)
            Devuelve la lista de palabras con frecuencia mayor a freq.
        """
        frequency = defaultdict(int)

        for token in text:
            frequency[token] += 1

        texts = [token for token in text if frequency[token] > freq]

        return texts
