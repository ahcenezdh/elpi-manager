import mariadb, {Pool, PoolConnection} from "mariadb";

class Database {
    private static instance: Database;
    private pool: Pool | undefined;

    constructor() {
        this.initPool();
    }

    private initPool(): void {
        this.pool = mariadb.createPool({
            host: process.env.DATABASE_IP,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            connectionLimit: 5,
            multipleStatements: true
        });
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async getConnection(): Promise<PoolConnection> {
        try {
            return await this.getConnection();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async query<T>(sql: string, params?: any): Promise<T> {
        let conn: PoolConnection | undefined;

        try {
            conn = await this.getConnection();
            return await conn.query(sql, params);
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (conn) await conn.release();
        }
    }

    public async end(): Promise<void> {
        try {
            await this.pool?.end();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default Database;