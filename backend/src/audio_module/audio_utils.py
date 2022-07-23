import speech_recognition as sr
from pydub import AudioSegment
from moviepy.editor import *
from pydub.utils import make_chunks
import shutil
import sys
import os

environment = os.getenv("BATSON_ENV")
if environment == 'dev':
    import config.develop_config as config
elif environment == 'prod':
    import config.production_config as config
else:
    raise ValueError(
        f"La variable de entorno $BATSON_ENV debe ser 'dev' o 'prod'. Se obtuvo: {environment}:")

if sys.platform == 'darwin':
    AudioSegment.converter = os.path.join(config.BASE_PATH, 'ffmpeg')
else:
   AudioSegment.converter = 'C:\\ffmpeg\\bin\\ffmpeg.exe'

r = sr.Recognizer()

def separate_audio(path_video):
    audio = None

    if path_video.endswith('.mp4'):
        audio = AudioFileClip(path_video)
        path_audio = path_video.replace('mp4', 'wav')
        audio.write_audiofile(path_audio)
        audio = AudioSegment.from_wav(path_audio)
        os.remove(path_audio)
    
    return audio

def audio_to_text(audio):
    if config.VERBOSE:
        print("[AUDIO] Reconociendo audio...")

    chunks = make_chunks(audio, 3500)
    if config.VERBOSE:
        print("[AUDIO] Audio separado en chunks.")

    try:
        os.mkdir('audio_chunks')
    except(FileExistsError):
        pass
  
    os.chdir('audio_chunks')
  
    text = ''
    i = 0
    for chunk in chunks:
        chunk_silent = AudioSegment.silent(duration = 1000)
  
        audio_chunk = chunk_silent + chunk + chunk_silent
  
        audio_chunk.export("chunk{0}.wav".format(i), bitrate ='192k', format ="wav")
  
        filename = 'chunk'+str(i)+'.wav'
  
        r = sr.Recognizer()
  
        with sr.AudioFile(filename) as source:
            r.adjust_for_ambient_noise(source)
            audio_listened = r.record(source)
  
        try:
            rec = r.recognize_google(audio_listened)
            text += rec.lower() + ' '
            if config.VERBOSE:
                print("[AUDIO] Chunk {} procesado.".format(i))
  
        except sr.UnknownValueError:
            pass
            if config.VERBOSE:
                print("[AUDIO] No se entendio el audio del chunk {}.".format(i))
  
        except sr.RequestError as e:
            if config.VERBOSE:
                print("[AUDIO] Could not request results. check your internet connection")
  
        i += 1
    
    os.chdir('..')
    shutil.rmtree('audio_chunks')
    if config.VERBOSE:
        print("[AUDIO] Audio reconocido.")
        print("[AUDIO] Texto reconocido: ", '\'', text, '\'')

    return text