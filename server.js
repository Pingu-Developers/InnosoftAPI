'use strict';

const deploy = (env) => {
  return new Promise((resolve, reject) => {
    try{
      var fs = require('fs'),
      http = require('http'),
      path = require('path');
    
      var express = require("express");
      var app = express();
      var oasTools = require('oas-tools');
      var jsyaml = require('js-yaml');
    
      var serverPort = process.env.PORT || 5000;
    
      app.use(express.json({strict: false}));
    
      var spec = fs.readFileSync(path.join(__dirname, '/api/oas-doc.yaml'), 'utf8');
      var oasDoc = jsyaml.safeLoad(spec);
    
      var options_object = {
        controllers: path.join(__dirname, './controllers'),
        loglevel: 'info',
        strict: false,
        router: true,
        validator: true
      };
    
      oasTools.configure(options_object);
    
      oasTools.initialize(oasDoc, app, function() {
        http.createServer(app).listen(serverPort, function() {
          console.log("App running at http://localhost:" + serverPort);
          console.log("________________________________________________________________");
          if (options_object.docs !== false) {
            console.log('API docs (Swagger UI) available on http://localhost:' + serverPort + '/docs');
            console.log("________________________________________________________________");
          }
          resolve();
        });
      });
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


