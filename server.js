'use strict';

const deploy = (env) => {
  return new Promise((resolve, reject) => {
    try {
      const fs = require('fs');
      const http = require('http');
      const path = require('path');
      const mongoose = require('mongoose');

      const express = require('express');
      const app = express();
      const oasTools = require('oas-tools');
      const jsyaml = require('js-yaml');

      const serverPort = process.env.PORT || 5000;
      const mongoPort = process.env.MONGO_PORT || 27017;
      const mongoHost = process.env.MONGO_HOST || 'localhost';
      const mongoDBName = process.env.MONGO_DBNAME || 'innochatdb';
      const mongoURL = `mongodb://${mongoHost}:${mongoPort}/${mongoDBName}`;

      app.use(express.json({ strict: false }));

      const spec = fs.readFileSync(path.join(__dirname, '/api/oas-doc.yaml'), 'utf8');
      const oasDoc = jsyaml.safeLoad(spec);

      const options = {
        controllers: path.join(__dirname, './controllers'),
        loglevel: env === 'test' ? 'error' : 'info',
        strict: false,
        router: true,
        validator: true
      };

      mongoose.connect(mongoURL).then(() => {
        oasTools.configure(options);

        oasTools.initialize(oasDoc, app, function () {
          http.createServer(app).listen(serverPort, function () {
            if (env !== 'test') {
              console.log('________________________________________________________________');
              console.log('App running!');
              console.log('________________________________________________________________');
              if (options.docs !== false) {
                console.log('API docs (Swagger UI) available on /docs');
                console.log('________________________________________________________________');
              }
            }
            resolve();
          });
        });
      }).catch(err => reject(err));
    } catch (err) {
      reject(err);
    }
  });
};

const undeploy = () => {
  process.exit();
};

module.exports = {
  deploy: deploy,
  undeploy: undeploy
};
