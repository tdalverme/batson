from abc import abstractmethod

class IMDbDAO():
    def __init__(self):
        pass
    
    @abstractmethod
    def get_actor_id(self, actor_name):
        """
        Devuelve el ID del actor.\n
        ---
        Parametros:
            actor_name: str
                Nombre completo del actor.\n
        ---
        Return: int
            Devuelve el id del actor.
        """
        pass

    @abstractmethod
    def get_filmography_by_name(self, actor_name):
        """
        Devuelve la filmografia del actor.\n
        ---
        Parametros:
            actor_name: str
                Nombre completo del actor.\n
        ---
        Return: list(int)
            Devuelve una lista de IDs de las peliculas donde actuo.
        """
        pass
    
    @abstractmethod
    def get_filmography_by_id(self, actor_id):
        """
        Devuelve la filmografia del actor.\n
        ---
        Parametros:
            actor_id: int
                ID del actor.\n
        ---
        Return: list(int)
            Devuelve una lista de IDs de las peliculas donde actuo.
        """
        pass

    @abstractmethod
    def get_movie(self, movie_id):
        """
        Devuelve una pelicula segun el ID.\n
        ---
        Parametros:
            movie_id: int
                ID de la pelicula.\n
        ---
        Return: Movie
            Devuelve la pelicula con su informacion.
        """
        pass

    @abstractmethod
    def get_plots(self, movie_id):
        """
        Devuelve las tramas de la pelicula.\n
        ---
        Parametros:
            movie_id: int
                ID de la pelicula.\n
        ---
        Return: list(str)
            Devuelve una lista de las tramas de la pelicula.
        """
        pass

    @abstractmethod
    def get_synopsis(self, movie_id):
        """
        Devuelve la sinopsis de la pelicula.\n
        ---
        Parametros:
            movie_id: int
                ID de la pelicula.\n
        ---
        Return: list(str)
            Devuelve la sinopsis de la pelicula en caso de tenerla. En su defecto devuelve None
        """
        pass