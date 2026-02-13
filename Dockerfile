# AssetTrack Pro - Docker Image
# Task #3 - Docker Containerization

# Use official Python runtime as base image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the Python program into the container
COPY app.py .

# Command to run the program
CMD ["python", "app.py"]
