import express from "express";
import usersController from "./controllers/usersController";
import teamsController from "./controllers/teamsController";
import loginController from "./controllers/loginController";
import authenticate from "./middleware/authenticate";
import UserValidator from "../validators/UserValidator";
import TeamValidator from "../validators/TeamValidator";
import AddTeamToUserValidator from "../validators/AddTeamToUserValidator";
import LoginValidator from "../validators/LoginValidator";
//import usersRouter from "./routes/usersRoutes";
// import teamsRouter from "./routes/teamsRoutes";
// import loginController from "./routes/loginController";
// import logoutController from "./routes/logoutController";

const router = express.Router();

//users routes
router.get("/users", authenticate, usersController.list);
router.get("/users/:user_id", authenticate, usersController.getUser);
router.delete("/users/:user_id", authenticate, usersController.deleteUser);
router.post("/users", authenticate, UserValidator, usersController.insert);
router.patch(
    "/users/:user_id",
    authenticate,
    UserValidator,
    usersController.updateUser
);
//teams routes
router.get("/teams", authenticate, teamsController.list);
router.get("/teams/:team_id", authenticate, teamsController.getTeam);
router.get(
    "/teams/:team_id/members",
    authenticate,
    teamsController.listMembers
);
router.post("/teams", authenticate, TeamValidator, teamsController.insert);
router.post(
    "/teams/:team_id/member/:user_id",
    AddTeamToUserValidator,
    teamsController.addTeamToUser
);
router.patch("/teams/:team_id", authenticate, teamsController.update);
router.delete("/teams/:team_id", authenticate, teamsController.deleteTeam);
router.delete(
    "/teams/:team_id/member/:user_id",
    authenticate,
    teamsController.removeMember
);

//login-logout routes
router.post("/login", LoginValidator, loginController.login);
router.delete("/logout", loginController.logout);

export default router;

//--------
// ADICIONE ROTAR NESSE ARQUIVO, IGNORE A PASTA ROUTES POR ENQUANTO!!!!
//--
