import express from "express";
import usersController from "../controllers/usersController";
//import productCreateValidator from "../validators/product-create-validator";
class UsersRouter {
    private router: express.Router;

    constructor() {
        this.router = express.Router();
        this.router.get("/", usersController.list);
        // this.router.get("/me");
        // this.router.get("/:user_id");
        // this.router.post("/");
        // this.router.patch("/:user_id");
        // this.router.delete("/:user_id");
    }

    public get(): express.Router {
        return this.router;
    }
}

const usersRouter = new UsersRouter();
export default usersRouter;
