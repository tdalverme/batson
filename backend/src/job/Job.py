import os

environment = os.getenv("BATSON_ENV")
if environment == 'dev':
    import config.develop_config as config
elif environment == 'prod':
    import config.production_config as config
else:
    raise ValueError(
        f"La variable de entorno $BATSON_ENV debe ser 'dev' o 'prod'. Se obtuvo: {environment}:")

class Job:
    def __init__(self, type):
        self.id = str(os.getpid())
        self.type = type
        self.data = None
        self.status = config.STATUS_INITIAL
        self.progress = 0

    def update_status(self, status):
        self.status = status

    def update_data(self, data):
        self.data = data
    
    def get_status(self):
        return self.status
    
    def get_data(self):
        return self.data
    
    def get_id(self):
        return self.id
    
    def get_type(self):
        return self.type

    def set_progress(self, progress):
        self.progress = progress