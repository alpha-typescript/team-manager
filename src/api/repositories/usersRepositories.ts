import IUser from "../../interfaces/iUser";
import IResult from "../../interfaces/iResult";
import ConnectDB from "../database/postgres";
import { v4 as uuidV4 } from "uuid";
import { QueryResult } from "pg";
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
                uuidV4(),
                newUser.username || "",
                newUser.email || "",
                newUser.firstName || "",
                newUser.lastName || "",
                newUser.password || "",
                newUser.team || null,
                newUser.isAdmin || false,
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
    /* async insert(pool: pg.Pool, product: IProduct): Promise<IResult<IProduct>> {
        const iresult: IResult<IProduct> = { errors: [], status: 200 };
        try {
            const query = `INSERT INTO store.product (id, name, price, category_id) VALUES ($1, $2, $3, $4) RETURNING *`;
            const values = [
                uuidv4(),
                product.name,
                product.price,
                product.category,
            ];
            const queryResult = await pool.query(query, values);
            if (queryResult.rowCount > 0) {
                iresult.data = {
                    id: queryResult.rows[0].id,
                    name: queryResult.rows[0].name,
                    price: queryResult.rows[0].price,
                    category: queryResult.rows[0].category_id,
                    createdAt: queryResult.rows[0].created_at,
                    updatedAt: queryResult.rows[0].updated_at,
                };
            }
        } catch (error: any) {
            iresult.errors?.push(error.message);
            iresult.status = 500;
        }
        return iresult;
    } */
}

const userRepositories = new UserRepositories();
export default userRepositories;
