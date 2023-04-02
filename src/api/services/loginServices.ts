import ILogin from "../../interfaces/iLogin";
import IResult from "../../interfaces/iResult";
import IUser from "../../interfaces/iUser";
import loginRepositories from "../repositories/loginRepositories";

class LoginServices {
    async comparePassword(credentials: ILogin): Promise<IResult<IUser>> {
        let result: IResult<IUser> = { errors: [], status: 200 };
        try {
            result = await loginRepositories.getPassword(credentials.username);
            if (result.data?.password !== credentials.password)
                throw new Error("Invalid credentials");
        } catch (error: any) {
            result.errors?.push(error.message);
            if (error.message === "Invalid credentials") {
                result.status = 401;
            } else {
                result.status = 500;
            }
        }
        return result;
    }
}

const loginServices = new LoginServices();
export default loginServices;
