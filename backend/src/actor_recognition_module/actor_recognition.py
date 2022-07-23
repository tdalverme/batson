import os
import cv2

environment = os.getenv("BATSON_ENV")
if environment == 'dev':
    import config.develop_config as config
elif environment == 'prod':
    import config.production_config as config
else:
    raise ValueError(
        f"La variable de entorno $BATSON_ENV debe ser 'dev' o 'prod'. Se obtuvo: {environment}:")

def get_n_frames(path_video, interval=1):
    frames = []

    video = cv2.VideoCapture(path_video)
    frame_rate = video.get(cv2.CAP_PROP_FPS)
    success, image = video.read()

    count = 0
    while success:
        frames.append(image)
        count += interval
        video.set(1, int(count * frame_rate))
        success, image = video.read()

    return frames


def save_frames(path_video, frames_folder_path, interval=1):
    """
    Guarda los frames del video en la carpeta 'frames_folder_path' de acuerdo al intervalo 'interval'.
    ---
    Parametros:
        path_video: string
            Path del archivo de video.\n
        frames_folder_path: string
            Path a la carpeta donde se guardan los frames.\n
        interval: int
            Intervalo en el que se leen los frames del video.\n
    """

    video = cv2.VideoCapture(path_video)
    frame_rate = video.get(cv2.CAP_PROP_FPS)
    success, image = video.read()

    count = 0

    cv2.imwrite(os.path.join(frames_folder_path, 'frame' + str(count)) + '.jpg', image)

    while success:
        count += interval
        video.set(1, int(count * frame_rate))
        success, image = video.read()

        try:
            width = int(image.shape[1] * config.RESIZING_FACTOR)
            height = int(image.shape[0] * config.RESIZING_FACTOR)
            dsize = (width, height)
            image = cv2.resize(image, dsize)
            cv2.imwrite(os.path.join(frames_folder_path, 'frame' + str(count)) + '.jpg', image)
        except:
            pass

    return count
