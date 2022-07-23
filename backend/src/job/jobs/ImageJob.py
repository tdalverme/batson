from job.Job import Job
import os

environment = os.getenv("BATSON_ENV")
if environment == 'dev':
    import config.develop_config as config
elif environment == 'prod':
    import config.production_config as config
else:
    raise ValueError(
        f"La variable de entorno $BATSON_ENV debe ser 'dev' o 'prod'. Se obtuvo: {environment}:")

class ImageJob(Job):
    def __init__(self):
        super().__init__('actors')

    def get_progress(self):
        return 0