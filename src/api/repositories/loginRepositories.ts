import IUser from "../../interfaces/iUser";
import IResult from "../../interfaces/iResult";
import ConnectDB from "../database/postgres";

class LoginRepositories {
    private db = new ConnectDB();

    public async getPassword(username: string): Promise<IResult<IUser>> {
        const result: IResult<IUser> = { errors: [], status: 200 };

        try {
            const queryText = `
                SELECT * FROM users
                WHERE username = $1;
            `;

            const values = [username];

            const userResult = await this.db.query(queryText, values);
            result.data = {};

            if (userResult.length === 0) throw new Error("User not found");

            const user: IUser = {
                id: userResult[0].id,
                username: userResult[0].username,
                email: userResult[0].email,
                firstName: userResult[0].first_name,
                lastName: userResult[0].last_name,
                password: userResult[0].password,
                team: userResult[0].team,
                isAdmin: userResult[0].is_admin,
            };
            result.data = user;
        } catch (error: any) {
            result.errors?.push(error.message);
            result.status = 500;
        }

        return result;
    }
}

const loginRepositories = new LoginRepositories();
export default loginRepositories;
