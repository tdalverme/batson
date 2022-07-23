import os
from pathlib import Path
import multiprocessing as mp
from job.jobs.ImageJob import ImageJob
from job.jobs.VideoJob import VideoJob
from flask import Flask, request, jsonify
from flask import request, Flask
from werkzeug.utils import secure_filename
from actor_recognition_module.imdb_utils import *
from util.utils import *
from util.utils import dao

environment = os.getenv("BATSON_ENV")
if environment == 'dev':
    import config.develop_config as config
elif environment == 'prod':
    import config.production_config as config
else:
    raise ValueError(
        f"La variable de entorno $BATSON_ENV debe ser 'dev' o 'prod'. Se obtuvo: {environment}:")

###############################################################################################

app = Flask(__name__)
tmp_folder = os.path.join(config.BASE_PATH, 'tmp')

try:
    jobs = mp.Manager().dict()
except:
    pass

try:
    Path(tmp_folder).mkdir(exist_ok=True)
    Path(config.FRAMES_FOLDER_PATH).mkdir(exist_ok=True)
except:
    print("[!] Error al crear las carpetas necesarias en el server")
    raise

###############################################################################################

@app.route('/', methods=['GET'])
def home():
    return "<h1>TEST API</p>"

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query')

    return jsonify(dao.search(query))

@app.route('/results/<id>', methods=['GET'])
def get_request_status(id):
    try:
        job = jobs[str(id)]
        res = {
            'type': job.get_type(),
            'status': job.get_status(),
            'data': job.get_data(),
            'progress': job.get_progress(),
        }
        if job.get_status() == 'finished':
            del jobs[str(id)]
    except:
        print(f"[!] Error al obtener job '{id}'")
        res = {'status': 'error', 'results': None}
    
    return jsonify(res)

@app.route('/upload-file/', methods=['POST'])
def start_request():
    if request.method == 'POST':
        if 'file' not in request.files:
            return "Error {}: No file part".format(config.NO_FILE_PART), config.NO_FILE_PART

        uploaded_file = request.files['file']

        if uploaded_file.filename == '':
            return "Error {}: File not selected".format(config.FILE_NOT_SELECTED), config.FILE_NOT_SELECTED

        path_file = ''
        if uploaded_file and allowed_file(uploaded_file.filename):
            filename = secure_filename(uploaded_file.filename)
            path_file = os.path.join(tmp_folder, filename)
            uploaded_file.save(path_file)

            if filename.rsplit('.')[1].lower() in config.ALLOWED_EXTENSIONS_IMAGE:
                if config.VERBOSE:
                    print("[IMG] Procesando imagen...")
                p = mp.Process(target=process_image, args=(
                    path_file, jobs,), daemon=False)
                p.start()
                jobs[str(p.pid)] = ImageJob()

            elif filename.rsplit('.')[1].lower() in config.ALLOWED_EXTENSIONS_VIDEO:
                if config.VERBOSE:
                    print("[VIDEO] Procesando video...")
                p = mp.Process(target=process_video, args=(
                    path_file, jobs,), daemon=False)
                p.start()
                jobs[str(p.pid)] = VideoJob()

            return jsonify({'type': 'request-id', 'data': {'id': str(p.pid)}})

    else:
        return "Error %d Method Not Allowed" % config.METHOD_NOT_ALLOWED

if __name__ == '__main__':
    jobs = mp.Manager().dict()
    app.run()