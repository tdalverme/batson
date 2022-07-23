import os
import glob
import multiprocessing as mp
import cv2
from actor_recognition_module.actor_recognition import get_n_frames, save_frames
from actor_recognition_module.imdb_utils import *
from actor_recognition_module.face_rec.model.FaceRecModel import FaceRecModel
from audio_module.audio_utils import *
from audio_module.ponderators.AudioPonderator import AudioPonderator 
from database.daos.IMDbAPI import IMDbAPI
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor

environment = os.getenv("BATSON_ENV")
if environment == 'dev':
    import config.develop_config as config
elif environment == 'prod':
    import config.production_config as config
else:
    raise ValueError(
        f"La variable de entorno $BATSON_ENV debe ser 'dev' o 'prod'. Se obtuvo: {environment}:")

dao = IMDbAPI()
model = FaceRecModel('cnn')
model.load_from_file(config.FACEREC_MODEL_PATH)

def sort_movies_by_coincidence(movie):
    return movie['coincidence']

def process_video(path_video, jobs):
    pool = mp.Pool(config.MAX_PROCESSES)

    while not str(os.getpid()) in jobs:
        print("No hay pid")
        pass
    id = str(os.getpid())
    
    job = jobs[id]
    job.update_status(config.STATUS_GETTING_AUDIO)
    jobs[id] = job
    audio = separate_audio(path_video)

    if not audio:
        job = jobs[id]
        job.update_status(config.STATUS_FINISHED)
        jobs[id] = job
        return

    job = jobs[id]
    job.update_status(config.STATUS_GETTING_FRAMES)
    jobs[id] = job

    frames_count = save_frames(path_video, config.FRAMES_FOLDER_PATH)
    job = jobs[id]
    job.set_n_frames(frames_count)
    jobs[id] = job

    if config.VERBOSE:
        print("[VIDEO] Cantidad de frames a analizar: %d" % frames_count)
        print("[VIDEO] Reconociendo actores en frames...")

    job = jobs[id]
    job.update_status(config.STATUS_PROCESSING_VIDEO)
    jobs[id] = job
    text = pool.apply_async(audio_to_text, [audio])

    names_list = []
    for f in os.listdir(config.FRAMES_FOLDER_PATH):
        img = cv2.imread(os.path.join(config.FRAMES_FOLDER_PATH, f))
        
        names = model.predict_from_img(img)
        names_list.extend(names)
        job = jobs[id]
        job.update_progress()
        jobs[id] = job

    names_list = sort_actors(names_list)
    if len(names_list) == 0:
        print("[VIDEO] No se reconoció ningún actor")
        job = jobs[id]
        job.update_status(config.STATUS_FINISHED)
        jobs[id] = job
        return
    
    if config.VERBOSE:
        print("[VIDEO] Actores reconocidos: ", names_list)

    job = jobs[id]
    job.update_status(config.STATUS_GETTING_MOVIES)
    jobs[id] = job
    movies = get_movies_with_actors(names_list)

    ponderator = AudioPonderator(movies, text.get(), dao)

    job = jobs[id]
    job.update_status(config.STATUS_PONDERATING)
    jobs[id] = job
    sims = ponderator.ponderate()

    res = []
    for movie in movies:
        aux = {}
        aux['id'] = movie['id']
        aux['coincidence'] = sims[movie['id']]
        aux['date'] = datetime.today().strftime("%d/%m/%Y %H:%M")
        res.append(aux)

    res.sort(reverse=True, key=sort_movies_by_coincidence)
    job = jobs[id]
    job.update_data(res)
    job.update_status(config.STATUS_FINISHED)
    jobs[id] = job

    try:
        os.remove(path_video)
        files = glob.glob(os.path.join(config.FRAMES_FOLDER_PATH, '*'))
        for f in files:
            os.remove(f)
    except:
        pass

def get_movies_with_actors(actors):
    res = list()
    if len(actors) == 0:
        return res

    for i in range(0, len(actors)):
        actors[i] = actors[i].replace('_', ' ').lower()
    
    movies = list()
    pool = ThreadPoolExecutor(max_workers=5)
    for actor_movies in pool.map(dao.get_filmography_by_name, actors):
        movies.append(actor_movies)
        
    if config.VERBOSE:
        print('[API] Obteniendo coincidencias...')
    coincidences = set(movies[0])

    for actor_movies in movies:
        possible_coincidences = set(coincidences & set(actor_movies))
        if len(possible_coincidences) == 0:
            break
        else:
            coincidences = possible_coincidences

        if len(coincidences) < config.MIN_COINCIDENCES:
            break
    
    if config.VERBOSE:
        print('[API] Obteniendo info de las peliculas...')
    movies = list()

    pool = ThreadPoolExecutor(max_workers=len(coincidences))
    for movie in pool.map(dao.get_movie_data, list(coincidences)[:8]):
        movies.append(movie)
    
    if config.VERBOSE:
        print('[API] Peliculas obtenidas.')
    
    return movies

def sort_actors(names_list):
    for i in range(0, len(names_list)):
      names_list[i] = names_list[i].replace('_', ' ')

    d = dict()
    d = d.fromkeys(names_list, 0)

    try:
        del d[config.ID_UNKNOWN]
    except:
        pass

    for name in names_list:
        if name != config.ID_UNKNOWN:
             d[name] += 1

    sorted_actors = [k for k, v in sorted(d.items(), key=lambda item: item[1], reverse=True)]
    return sorted_actors

def process_image(path_image, jobs):
    while not str(os.getpid()) in jobs:
        pass
    id = str(os.getpid())

    job = jobs[id]
    job.update_status(config.STATUS_PROCESSING_IMAGE)
    jobs[id] = job

    if config.VERBOSE:
        print("[IMG] Reconociendo actores...")
    actors = model.predict(path_image)
    actors = [actor for actor in actors if actor != config.ID_UNKNOWN]

    for i in range(0, len(actors)):
        actors[i] = {"title": actors[i].replace('_', ' '), "id": dao.get_actor_id(actors[i].replace('_', ' '))}

    job = jobs[id]
    job.update_data(actors)
    job.update_status(config.STATUS_FINISHED)
    jobs[id] = job

def flatten_list(l):
    flat_list = [item for sublist in l for item in sublist]
    return flat_list

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in [*config.ALLOWED_EXTENSIONS_IMAGE, *config.ALLOWED_EXTENSIONS_VIDEO]