import express from "express";
import router from "./api/router"; // add later
import cookieParser from "cookie-parser";
import { config } from "dotenv";
config({ path: "config/.env" }); // cool, thanks chatGPT

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
    }

    private router() {
        this.server.use(router);
    }
}
