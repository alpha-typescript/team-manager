import express from "express";
import usersController from "./controllers/usersController";
import teamsController from "./controllers/teamsController";
//import usersRouter from "./routes/usersRoutes";
// import teamsRouter from "./routes/teamsRoutes";
// import loginController from "./routes/loginController";
// import logoutController from "./routes/logoutController";

const router = express.Router();

//users routes
router.get("/users", usersController.list);

//teams routes
router.get("/teams", teamsController.list);

//login-logout routes
// router.post("/login", loginController);
// router.delete("/logout", logoutController);

export default router;
