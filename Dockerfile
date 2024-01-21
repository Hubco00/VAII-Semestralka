FROM python:3.9.13

WORKDIR /VAIIKO2CheckPoint

# Copy your project files from your host directory to the container
COPY . /VAIIKO2CheckPoint

# Install Python dependencies
RUN python3 -m pip install -r requirements.txt

# Expose the port your Flask app will run on
EXPOSE 5000



# Start your Flask application
CMD ["flask", "run", "--host=0.0.0.0"]