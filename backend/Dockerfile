FROM python:3.8

# Install python and pip
ADD ./requirements.txt /tmp/requirements.txt

# Install dependencies
# RUN apt-get install ffmpeg libsm6 libxext6  -y4
RUN apt-get update
RUN apt-get install -y ffmpeg
RUN apt-get install python3
RUN python3 -m pip install -U cmake
RUN python3 -m pip install --no-cache-dir -q -r /tmp/requirements.txt

# Add our code
ADD ./src /opt/webapp/
WORKDIR /opt/webapp

# Run the image as a non-root user
RUN adduser myuser
USER myuser

# Run the app.  CMD is required to run on Heroku
# $PORT is set by Heroku			
#CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "app:app"]
CMD gunicorn --bind 0.0.0.0:$PORT app:app --timeout 120