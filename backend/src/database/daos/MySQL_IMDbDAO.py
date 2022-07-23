import mysql.connector
import os
from database.IMDbDAO import IMDbDAO

environment = os.getenv("BATSON_ENV")
if environment == 'dev':
    import config.develop_config as config
elif environment == 'prod':
    import config.production_config as config
else:
    raise ValueError(
        f"La variable de entorno $BATSON_ENV debe ser 'dev' o 'prod'. Se obtuvo: {environment}:")

class MySQL_IMDbDAO(IMDbDAO):
    def __init__(self):
        self.db = mysql.connector.connect(
            user = config.USERNAME,
            password = config.PASSWORD,
            database = config.DATABASE
        )
        self.cursor = self.db.cursor()
        super().__init__()

    def get_actor_id(self, actor_name):
        self.cursor.execute("SELECT name_id FROM names_ WHERE UPPER(name_) LIKE UPPER(\'%%%s%%\') AND birth_year IS NOT NULL" % actor_name)
        results = self.cursor.fetchall()
        return results

    def get_filmography_by_id(self, actor_id):
        self.cursor.execute("SELECT title_id FROM had_role WHERE name_id=\'%s\'" % actor_id)
        results = self.cursor.fetchall()
        return results

    def get_filmography_by_name(self, actor_name):
        self.cursor.execute("SELECT filmography FROM actors WHERE name=\'%s\'" % actor_name)
        results = self.cursor.fetchall()
        return results

    def get_movie(self, movie_id):
        self.cursor.execute("SELECT primary_title FROM titles WHERE title_id=\'%s\'" % movie_id)
        results = self.cursor.fetchall()
        return results

    def get_plots(self, movie_id):
        self.cursor.execute("SELECT plots FROM movies WHERE id=%d" % movie_id)
        results = self.cursor.fetchall()
        return results
    
    def get_synopsis(self, movie_id):
        self.cursor.execute("SELECT synopsis FROM movies WHERE id=%d" % movie_id)
        results = self.cursor.fetchall()

        if not results:
            return None

        return results