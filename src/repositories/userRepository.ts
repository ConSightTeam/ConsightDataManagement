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
        let result = await this.db.query('SELECT id, username, github_id, google_id FROM public.user WHERE id = $1', [id]);
        await this.db.end();
        
        if (result.rowCount > 0) {
            return result.rows[0] as User;
        } else {
            return null;
        }
    }

    async get(username: string, password: string): Promise<User> {
        await this.db.connect();
        let result = await this.db.query('SELECT id, username, hashed_password, github_id, google_id FROM public.user WHERE LOWER(username) = LOWER($1)', [username]);
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

    async update(updated_data: User): Promise<boolean> {
        await this.db.connect();
        let result = await this.db.query('UPDATE public.user SET username = $2, github_id = $3, google_id = $4 WHERE id = $1', 
            [updated_data.id, updated_data.username, updated_data.github_id, updated_data.google_id]);
        await this.db.end();
        return result.rowCount > 0;
    }

    async getOrRegisterOAuth(provider: string , oauth_id: string, username: string): Promise<User> {
        await this.db.connect();
        await this.db.query('INSERT INTO public.user (' + provider + '_id, username) VALUES ($1, $2) ON CONFLICT DO NOTHING;', 
            [oauth_id, username]);
        let result = await this.db.query('SELECT id, username, github_id, google_id FROM public.user WHERE ' + provider + '_id = $1', [oauth_id]);
        await this.db.end()
        
        if (result.rowCount > 0) {
            return result.rows[0] as User;
        } else {
            return null;
        }
    }
}