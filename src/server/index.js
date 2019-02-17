const path = require('path');
const async = require('async');
const express = require('express');
const os = require('os');
const bodyParser = require('body-parser');
const config = require('./config.js');
const sleep = require('system-sleep');
const fs = require('fs');
const okta = require('@okta/okta-sdk-nodejs');

const oktaClient = new okta.Client({
  orgUrl: 'https://dev-448979.oktapreview.com',
  token: '00LhDYaW2ox4maZ_XAHqhN8FlnWXYKm0CrI-n50igF'
});

const Users = require('./models/Users');
const Audios = require('./models/Audios');

const users = new Users();
const audios = new Audios();

const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'dafphfi62',
  api_key: '993732551731529',
  api_secret: 'HWXpmMvmibHzFOl8wSBFY6oRHAM'
});


const app = express();

app.use(express.static('dist'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//////////////////////////// API's

app.post('/api/register', async (req, res) => {
  if (
    !req.body.hasOwnProperty('email')
    || !req.body.hasOwnProperty('password')
    || !req.body.hasOwnProperty('firstname')
    || !req.body.hasOwnProperty('lastname')
  ) {
    return res.status(400)
      .send({
        success: 'false',
        message: 'missing parameter'
      });
  }

  const email = req.body.email;
  const password = req.body.password;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;

  let results = {};

  try {
    const getUserInfoResults = users.newUser(email, firstname, lastname, password);
    results = await getUserInfoResults;
  } catch (e) {
    console.log(e);
    return res.status(403)
      .send({
        success: 'false',
        message: 'email already exists'
      });
  }

  if (results['rowCount'] === 0) {
    return res.status(400)
      .send({
        success: 'false',
        message: 'error'
      });
  }
  const newUser = {
    profile: {
      email: req.body.email,
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      login: req.body.email
    },
    credentials: {
      password: {
        value: req.body.password
      }
    }
  };

  try {
    await oktaClient.createUser(newUser);
  } catch (e) {
    console.log(e);
  }

  return res.status(200)
    .send({
      results
    });
});

app.post('/api/login', async (req, res) => {
  if (!req.body.hasOwnProperty('email')) {
    return res.status(400)
      .send({
        success: 'false',
        message: 'missing parameter :email'
      });
  }
  if (!req.body.hasOwnProperty('password')) {
    return res.status(400)
      .send({
        success: 'false',
        message: 'missing parameter :password'
      });
  }

  const email = req.body.email;
  const password = req.body.password;

  let results = {};

  try {
    const getUserInfoResults = users.authenticateUser(email, password);
    results = await getUserInfoResults;
  } catch (e) {
    console.log(e);
    return res.status(403)
      .send({
        success: 'false',
        message: 'email or password is wrong'
      });
  }

  if (results['rowCount'] === 0) {
    return res.status(400)
      .send({
        success: 'false',
        message: 'error'
      });
  }
  results = results.rows;
  return res.status(200)
    .send({
      results
    });
});

app.post('/api/deactivate', async (req, res) => {
  if (
    !req.body.hasOwnProperty('email')
    || !req.body.hasOwnProperty('id')
  ) {
    return res.status(400)
      .send({
        success: 'false',
        message: 'missing parameter'
      });
  }

  const id = req.body.id;
  const email = req.body.email;

  let results = {};
  try {
    const deleteUserResults = users.deleteUser(id);
    results = await deleteUserResults;
  } catch (e) {
    console.log(e);
    return res.status(403)
      .send({
        success: 'false',
        message: 'email or password is wrong'
      });
  }

  try {
    const user = await oktaClient.getUser(email);
    await user.deactivate();
    await user.delete();
    console.log('ran')
  } catch (e) {
    console.log(e);
    return res.status(403)
      .send({
        success: 'false',
        error: e
      });
  }

  if (results['rowCount'] === 0) {
    return res.status(400)
      .send({
        success: 'false',
        message: 'error'
      });
  }

  results = {message: 'deleted'};
  return res.status(200)
    .send({
      results
    });
});

app.post('/api/new_audio', async (req, res) => {
  if (
    !req.body.hasOwnProperty('filename')
    || !req.body.hasOwnProperty('url')
    || !req.body.hasOwnProperty('user_id')
  ) {
    return res.status(400)
      .send({
        success: 'false',
        message: 'missing parameter'
      });
  }

  const filename = req.body.filename;
  const url = req.body.url;
  const userId = req.body.user_id;

  let results = {};

  try {
    const getUserInfoResults = audios.newAudio(filename, url, userId);
    results = await getUserInfoResults;
  } catch (e) {
    console.log(e);
    return res.status(403)
      .send({
        success: 'false',
        message: e
      });
  }

  if (results['rowCount'] === 0) {
    return res.status(400)
      .send({
        success: 'false',
        message: 'error'
      });
  }

  return res.status(200)
    .send({
      results
    });
});

app.get('/api/get_audios/:id', async (req, res) => {
  if (!req.params.hasOwnProperty('id')) {
    return res.status(400)
      .send({
        success: 'false',
        message: 'missing parameter'
      });
  }
  const userId = req.params.id;
  let results = {};
  try {
    const getUserInfoResults = audios.getAudios(userId);
    results = await getUserInfoResults;
  } catch (e) {
    console.log(e);
    return res.status(403)
      .send({
        success: 'false',
        message: e
      });
  }

  if (results['rowCount'] === 0) {
    return res.status(400)
      .send({
        success: 'false',
        message: 'error'
      });
  }

  results = results.rows;

  return res.status(200)
    .send({
      results
    });
});

app.get('/api/health_check', async (req, res) => {
  console.log('health_check');
  return res.status(200)
    .send({
      message: 'ok'
    });
});


app.listen(8080, () => console.log('Listening on port 8080!'));
