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
                isLeader: false,
            };

            if (user.team !== null) {
                if (await this.isLeader(user)) {
                    user.isLeader = true;
                }
            }

            result.data = user;
        } catch (error: any) {
            result.errors?.push(error.message);
            result.status = 500;
        }

        return result;
    }

    private async isLeader(user: IUser): Promise<boolean> {
        if (!user.id) {
            throw new Error("Internal server error");
        }

        try {
            const queryText = `
                SELECT * FROM teams
                WHERE leader = $1;
            `;
            const values = [user.id];

            const result = await this.db.query(queryText, values);

            if (result.length === 0) {
                return false;
            } else {
                return true;
            }
        } catch (error) {
            throw error;
        }
    }
}

const loginRepositories = new LoginRepositories();
export default loginRepositories;
