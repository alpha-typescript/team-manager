import swaggerAutogen from "swagger-autogen";
import { config } from "dotenv";
config({ path: "../../config/.env" });

const outputFile = "./swagger.json";
const endpointsFiles = ["../api/router.ts"];
const PORT = process.env.PORT;
const HOSTNAME = process.env.HOST;

const doc = {
  info: {
    version: "1.0.0",
    title: "Team Manager API",
    description:
      "Documentation for a Team Manager automatically generated by the <b>swagger-autogen</b> module.",
  },
  host: `${HOSTNAME}:${PORT}`,
  basePath: "/",
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: ["Users", "Teams"],
      description: "Endpoints",
    },
  ],
  definitions: {
    User: {
      id: "3e5daa5e-ac58-4f19-a89f-017b6c313c4c",
      username: "alpha",
      email: "alpha@alpha.com",
      firstName: "Alpha",
      lastName: "Edtech",
      password: "12345",
      teams: {
        id: "c33a19a6-41cf-45af-9200-756d7371a",
        name: "Grupo Alpha",
        leader: "3e5daa5e-ac58-4f19-a89f-017b6c313c4c",
      },
      isAdmin: "false",
    },
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc);
