import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config({ path: "./config/.env" });
export default class ConnectDB {
    private _pool: Pool;
    constructor() {
        this._pool = new Pool({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
            port: Number(process.env.PGPORT),
            max: 20,
            idleTimeoutMillis: 100,
        });
    }

    get pool() {
        return this._pool;
    }

    public async query(
        command: string,
        array: Array<string | boolean | null> = []
    ) {
        const client = await this._pool.connect();
        try {
            await client.query("BEGIN");
            const response = await client.query(command, array);
            await client.query("COMMIT");
            client.release();
            return response.rows;
        } catch (error) {
            await client.query("ROLLBACK");
            client.release();
            throw error;
        }
    }
}
