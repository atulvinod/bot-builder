"use strict";
require("module-alias/register");
require("dotenv").config();
const path = require("node:path");
const AutoLoad = require("@fastify/autoload");
const cors = require("@fastify/cors");
// Pass --options via CLI arguments in command to enable these options.
const options = {
  logger: true,
};

module.exports = async function (fastify, opts) {
  // Place here your custom code!
  fastify.register(require("@fastify/multipart"), {
    attachFieldsToBody: true,
    limits: {
      fileSize:
        Number(process.env.NEXT_PUBLIC_MAX_FILES_SIZE_LIMIT_MB) * 1000000,
    },
  });

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
      dir: path.join(__dirname, "plugins"),
      options: Object.assign({}, opts),
    });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
      dir: path.join(__dirname, "routes"),
      options: Object.assign({}, opts),
    });

  fastify.register(cors);

  fastify.addHook("preHandler", (request, response, done) => {
    fastify.authenticate(request, response);
      done();
    });
};

module.exports.options = options;
