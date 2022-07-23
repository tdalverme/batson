from config.base_config import *

BASE_PATH = '/opt/webapp/'
FRAMES_FOLDER_PATH = os.path.join(BASE_PATH, 'tmp', 'frames')
JSON_ACTORS = os.path.join(BASE_PATH, 'database', ACTORS_JSON_FILENAME)
JSON_MOVIES = os.path.join(BASE_PATH, 'database', MOVIES_JSON_FILENAME)
FACEREC_MODEL_PATH = os.path.join(BASE_PATH, 'actor_recognition_module', 'models', FACEREC_MODEL_FILENAME)
MAX_PROCESSES = 2

# RAPID_API_KEY = "4ceadcc0aemshe1b676974cd7a42p1b7518jsn5d9ebade926a"
RAPID_API_KEY = "12e292b6a7msh08d67adace490b5p161815jsnf849ea9a6cb3"
# RAPID_API_KEY = "7feda91880msh8fd211b6b0ce2e6p1c79e7jsnfd9edca6241c"
RAPID_API_HOST = "imdb8.p.rapidapi.com"

IMDB_API_KEY = "k_o4melqoy"
# IMDB_API_KEY = "k_q49kn8qk"