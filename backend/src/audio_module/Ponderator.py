from abc import abstractmethod

class Ponderator():
    def __init__(self, movies, object, dao):
        self.movies = movies
        self.object = object
        self.dao = dao
        pass

    @abstractmethod
    def ponderate(self):
        pass