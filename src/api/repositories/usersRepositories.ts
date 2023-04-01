import IUser from "../../interfaces/iUser";
import IResult from "../../interfaces/iResult";
import ConnectDB from "../database/postgres";

class UserRepositories {
    private db = new ConnectDB();

    public async list(): Promise<IResult<IUser[]>> {
        const result: IResult<IUser[]> = { errors: [], status: 200 };

        try {
            const usersResult = await this.db.query(`SELECT * FROM users`);
            result.data = [];

            usersResult.forEach((userResult) => {
                const user: IUser = {
                    id: userResult.id,
                    username: userResult.username,
                    email: userResult.email,
                    firstName: userResult.firstName,
                    lastName: userResult.lastName,
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
