import express from "express";
import usersController from "./controllers/usersController";
import teamsController from "./controllers/teamsController";
import loginController from "./controllers/loginController";
import authenticate from "./middleware/authenticate";
import patchUserValidator from "../validators/PatchUserValidator";
import AddTeamToUserValidator from "../validators/AddTeamToUserValidator";
//import usersRouter from "./routes/usersRoutes";
// import teamsRouter from "./routes/teamsRoutes";
// import loginController from "./routes/loginController";
// import logoutController from "./routes/logoutController";

const router = express.Router();

//users routes
router.get("/users", authenticate, usersController.list);
router.post("/users", authenticate, usersController.insert);
router.patch("/users/:user_id", authenticate, patchUserValidator, usersController.updateUser);
//teams routes
router.get("/teams", authenticate, teamsController.list);
router.get("/teams/:team_id", authenticate, teamsController.getTeam);
router.get(
    "/teams/:team_id/members",
    authenticate,
    teamsController.listMembers
);
router.post("/teams/:team_id/member/:user_id", authenticate, AddTeamToUserValidator, usersController.addTeamToUser);

//login-logout routes
router.post("/login", loginController.login);
// router.delete("/logout", logoutController);

export default router;

//--------
// ADICIONE ROTAR NESSE ARQUIVO, IGNORE A PASTA ROUTES POR ENQUANTO!!!!
//--
