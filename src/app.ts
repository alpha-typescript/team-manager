import express from "express";
import router from "./api/router";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
config({ path: "config/.env" });
import swaggerDocument from "./docs/swagger.json";
import swaggerUi from "swagger-ui-express";
export default class App {
    public server: express.Application;

    constructor() {
        this.server = express();
        this.middleware();
        this.router();
    }

    private middleware() {
        this.server.use(express.json());
        this.server.use(cookieParser(process.env.JWTSECRET || "senha secreta"));
        this.server.use(
            "/docs",
            swaggerUi.serve,
            swaggerUi.setup(swaggerDocument)
        );
    }

    private router() {
        this.server.use(router);
    }
}
