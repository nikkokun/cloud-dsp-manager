# Cloud DSP

This project uses the [Cloudinary API](https://cloudinary.com/documentation) to provide audio editing capabilities for users on the cloud. 

## Installation Overview

`npm run dev`

This repository is for managing the API endpoints for front end and back end.

### Front End:

#### ReactJS

We use React to create components.

### Back End:

#### NodeJS.

Please ensure you have bablerc and nodemon installed.

### Database

#### PostGresQL

We use [PostGresQL](https://www.postgresql.org/) as our database, so in order to run this manager, you need to have it installed.

## Concept

We ask users to upload files to our front end, which passes an upload request using the Cloudinary API. This then stores the file on our Cloudinary Server and returns a URL to access the file. 

We retrieve all files uploaded by the user on our interface dynamically, providing options to edit the audio file.

We have five main digital signal processing functions detailed in our **cloud-api-transformer** [repository](https://github.com/nikkokun/cloud-dsp-transformer).

They are viz.:

* **Pitch Shift**

    This allows the user to shift the pitch by a certain number of cents.

    At our prototype stage, we have predefined the values for pitch correction, but future development could allow the user to set this value from their end.

* **Time Stretch**

    This allows the user to stretch the time of the audio file at a fixed sampling rate

* **Beat Separation**

    This allows the user to separate just the rhythm using onset patterns and frequency estimation.

* **Harmony Separation**

    This allows the user to separate just the harmony using onset patterns and frequency estimation.

* **Re-Sampling**

    This allows the user to resample the audio file and splice it by beat. The resulting data is iterable and reversible. We recunstruct the audio file using the transformed data and sampling rate.

Dependencies for the these transforms are `ffmpeg` and `librosa`

These can be installed using the command:

`pip install librosa`

`brew install ffmpeg`
