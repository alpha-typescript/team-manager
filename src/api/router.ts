import express from "express";
import usersController from "./controllers/usersController";
//import usersRouter from "./routes/usersRoutes";
// import teamsRouter from "./routes/teamsRoutes";
// import loginController from "./routes/loginController";
// import logoutController from "./routes/logoutController";

const router = express.Router();

router.use("/users", usersController.list);
// router.use("/teams", teamsRouter);
// router.post("/login", loginController);
// router.delete("/logout", logoutController);

export default router;
