import express from "express";
//import router from "./api/router"; // add later

export default class App {
    public server: express.Application;

    constructor() {
        this.server = express();
        this.middleware();
        this.router();
    }

    private middleware() {
        this.server.use(express.json());
    }

    private router() {
        // add later
        //this.server.use(router);
    }
}
