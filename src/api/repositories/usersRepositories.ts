import IUser from "../../interfaces/iUser";
import IResult from "../../interfaces/iResult";
import ConnectDB from "../database/postgres";
class UserRepositories {
    private db = new ConnectDB();

    public async exists(userId: string): Promise<boolean> {
        const result = await this.db.query(
            `SELECT EXISTS (SELECT 1 FROM users WHERE id = $1);`,
            [userId]
        );
        return result[0].exists;
    }

    public async isAdmin(userId: string): Promise<boolean> {
        const result = await this.db.query(
            `SELECT is_admin FROM users WHERE id = $1;`,
            [userId]
        );
        return result[0].is_admin;
    }

    public async isLeader(userId: string): Promise<boolean> {
        const result = await this.db.query(
            `SELECT EXISTS (SELECT 1 FROM teams WHERE leader = $1);`,
            [userId]
        );

        return result[0].exists;
    }

    public async hasAlreadyTeam(userId: string): Promise<boolean> {
        const result = await this.db.query(
            `SELECT CASE WHEN team IS NOT NULL THEN true ELSE false END AS has_team FROM users WHERE id = $1;`,
            [userId]
        );
        return result[0].has_team;
    }

    public async list(): Promise<IResult<IUser[]>> {
        const result: IResult<IUser[]> = { errors: [], status: 200 };

        try {
            const usersResult = await this.db.query(`SELECT * FROM users`);
            result.data = [];

            if (usersResult.length === 0) throw new Error("No users found");

            usersResult.forEach((userResult) => {
                const user: IUser = {
                    id: userResult.id,
                    username: userResult.username,
                    email: userResult.email,
                    firstName: userResult.first_name,
                    lastName: userResult.last_name,
                    team: userResult.team,
                    isAdmin: userResult.is_admin,
                };
                result.data?.push(user);
            });
        } catch (error: any) {
            result.errors?.push(error.message);
            result.status = 500;
        }

        return result;
    }

    public async insert(newUser: IUser): Promise<IResult<IUser>> {
        const result: IResult<IUser> = { errors: [], status: 200 };

        try {
            const queryText = `INSERT INTO users (id,username,email,first_name,last_name,password,team,is_admin) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;

            const values = [
                newUser.id!,
                newUser.username!,
                newUser.email!,
                newUser.firstName!,
                newUser.lastName!,
                newUser.password!,
                newUser.team!,
                newUser.isAdmin!,
            ];
            const userResult = await this.db.query(queryText, values);
            result.data = {};

            if (userResult.length === 0)
                throw new Error("User was not created");

            const user: IUser = {
                id: userResult[0].id,
                username: userResult[0].username,
                email: userResult[0].email,
                firstName: userResult[0].first_name,
                lastName: userResult[0].last_name,
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

    public async getUser(userId: string): Promise<IResult<IUser>> {
        const result: IResult<IUser> = { errors: [], status: 200 };

        try {
            const userResult = await this.db.query(
                `
                SELECT * FROM users WHERE id = $1
                `,
                [userId]
            );

            if (userResult.length === 0) throw new Error("User not found");

            const user: IUser = {
                id: userResult[0].id,
                username: userResult[0].username,
                email: userResult[0].email,
                firstName: userResult[0].first_name,
                lastName: userResult[0].last_name,
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

    public async deleteUser(userId: string): Promise<IResult<IUser>> {
        const result: IResult<IUser> = { errors: [], status: 200 };

        try {
            const userResult = await this.db.query(
                `
                DELETE FROM users WHERE id = $1
                RETURNING *;
                `,
                [userId]
            );

            if (userResult.length === 0) throw new Error("User not found");

            const user: IUser = {
                id: userResult[0].id,
                username: userResult[0].username,
                email: userResult[0].email,
                firstName: userResult[0].first_name,
                lastName: userResult[0].last_name,
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

    public async patch(User: IUser): Promise<IResult<IUser>> {
        const result: IResult<IUser> = { errors: [], status: 200 };

        try {
            const queryText = `
            UPDATE users SET 
            username = $1, 
            email = $2, 
            first_name = $3, 
            last_name = $4, 
            password = $5 
            WHERE id = $6
            RETURNING *`;

            const values = [
                User.username || "",
                User.email || "",
                User.firstName || "",
                User.lastName || "",
                User.password || "",
                User.id || "",
            ];
            const userResult = await this.db.query(queryText, values);
            result.data = {};

            if (userResult.length === 0) throw new Error("User not found");

            const user: IUser = {
                id: userResult[0].id,
                username: userResult[0].username,
                email: userResult[0].email,
                firstName: userResult[0].first_name,
                lastName: userResult[0].last_name,
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

const userRepositories = new UserRepositories();
export default userRepositories;
