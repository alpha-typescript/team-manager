import express from "express";
import usersController from "./controllers/usersController";
import teamsController from "./controllers/teamsController";
import loginController from "./controllers/loginController";
import authenticate from "./middleware/authenticate";
//import usersRouter from "./routes/usersRoutes";
// import teamsRouter from "./routes/teamsRoutes";
// import loginController from "./routes/loginController";
// import logoutController from "./routes/logoutController";

const router = express.Router();

//users routes
router.get("/users", authenticate, usersController.list);
router.post("/users", authenticate, usersController.insert);
router.patch("/users/:user_id", authenticate, usersController.updateUser);
//teams routes
router.get("/teams", authenticate, teamsController.list);
router.get("/teams/:team_id", authenticate, teamsController.getTeam);
router.get(
    "/teams/:team_id/members",
    authenticate,
    teamsController.listMembers
);
router.post("/teams", authenticate, teamsController.insert);
router.post("/teams/:team_id/member/:user_id", teamsController.addTeamToUser);
router.delete("/teams/:team_id/member/:user_id", teamsController.removeMember);

//login-logout routes
router.post("/login", loginController.login);
router.delete("/logout", loginController.logout);

export default router;

//--------
// ADICIONE ROTAR NESSE ARQUIVO, IGNORE A PASTA ROUTES POR ENQUANTO!!!!
//--
