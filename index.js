// Require external modules
const Swagger = require("@fastify/swagger");
const SwaggerUI = require("@fastify/swagger-ui");
const mongoose = require("mongoose");
const fastify = require("fastify")({
  logger: true,
});

const port = 4000;

//database connection with mongoose
const dbURL = `mongodb://127.0.0.1:27017/text-fastify-app`;
mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Mong DB connect success"));

fastify.get("/", async (request, reply) => {
  return { hello: "world" };
});

fastify.register(Swagger, {
  openapi: {
    info: {
      title: "Books API",
      description: "An external API to manage a bookstore",
      version: "1.0.0",
    },
  },
  refResolver: {
    buildLocalReference(json, baseUri, fragment, i) {
      return json.$id || `def-${i}`;
    },
  },
});

// Enable SwaggerUI
fastify.register(SwaggerUI, {
  routePrefix: "/api-docs",
});

fastify.listen({ port: port }, (error, address) => {
  if (error) {
    console.log(error);
  }
  console.log(`listening on  ${address}`);

  // fastify.log.info(`server listening on ${address}`);
});
