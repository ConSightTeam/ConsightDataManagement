import { Client } from "pg";
import { User } from "../model/User";
import bcrypt = require('bcrypt');

export class UserRepository {
    db: Client

    constructor() {
        this.db = new Client();
    }

    async getByID(id: number): Promise<User> {
        await this.db.connect();
        let result = await this.db.query('SELECT id, username FROM public.user WHERE id = $1', [id]);
        await this.db.end();
        
        if (result.rowCount > 0) {
            return result.rows[0] as User;
        } else {
            return null;
        }
    }

    async get(username: string, password: string): Promise<User> {
        await this.db.connect();
        let result = await this.db.query('SELECT id, username, hashed_password FROM public.user WHERE username = $1', [username]);
        await this.db.end();

        if (result.rowCount > 0 && await bcrypt.compare(password, result.rows[0]['hashed_password'])) {
            return {
                id: result.rows[0]['id'],
                username: result.rows[0]['username']
            } as User;
        } else {
            return null;
        }
    }

    async register(username: string, password: string): Promise<boolean> {
        let hashedPassword = await bcrypt.hash(password, 10);

        await this.db.connect();
        let result = await this.db.query('INSERT INTO public.user (username, hashed_password) VALUES ($1, $2)', [username, hashedPassword]);
        await this.db.end();
        return result.rowCount > 0;
    }
}