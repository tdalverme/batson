from job.Job import Job
import os
from abc import abstractmethod

environment = os.getenv("BATSON_ENV")
if environment == 'dev':
    import config.develop_config as config
elif environment == 'prod':
    import config.production_config as config
else:
    raise ValueError(
        f"La variable de entorno $BATSON_ENV debe ser 'dev' o 'prod'. Se obtuvo: {environment}:")

class VideoJob(Job):
    def __init__(self):
        self.n_frames = 0
        super().__init__('movies')

    def set_n_frames(self, n_frames):
        self.n_frames = n_frames

    def update_progress(self):
        self.progress += 1

    def get_progress(self):
        if self.n_frames == 0:
            return 0
        return self.progress / self.n_frames