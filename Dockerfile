# Use an official Python runtime as a parent image
FROM python:3.12

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file to leverage Docker cache
COPY requirements.txt /app/

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Download Dockerize
RUN apt-get update && apt-get install -y curl && \
    curl -sSL https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz | tar -xz -C /usr/local/bin

# Copy the consultation_app directory contents into the container at /app
COPY consultation_app /app/consultation_app

# Set the working directory to /app/consultation_app
WORKDIR /app/consultation_app

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Run the application with Dockerize to wait for the database to be ready
CMD ["dockerize", "-wait", "tcp://db:5432", "-timeout", "30s", "sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]