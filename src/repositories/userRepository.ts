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
        let result = await this.db.query('SELECT id, username, email, github_id, google_id FROM public.user WHERE id = $1', [id]);
        await this.db.end();
        
        if (result.rowCount > 0) {
            return result.rows[0] as User;
        } else {
            return null;
        }
    }

    async get(username: string, password: string): Promise<User> {
        await this.db.connect();
        let result = await this.db.query('SELECT id, username, email, hashed_password, github_id, google_id FROM public.user WHERE LOWER(username) = LOWER($1)', [username]);
        await this.db.end();

        if (result.rowCount > 0 && await bcrypt.compare(password, result.rows[0]['hashed_password'])) {
            let toReturn: any = result.rows[0];
            delete toReturn.hashed_password; // Ensure the hashed password does not leave the data access object
            return toReturn as User;
        } else {
            return null;
        }
    }

    async register(email: string, username: string, password: string): Promise<boolean> {
        let hashedPassword = await bcrypt.hash(password, 10);

        await this.db.connect();
        let result = await this.db.query('INSERT INTO public.user (email, username, hashed_password) VALUES ($1, $2, $3)', [email, username, hashedPassword]);
        await this.db.end();
        return result.rowCount > 0;
    }

    async update(updated_data: User): Promise<boolean> {
        await this.db.connect();
        let result = await this.db.query('UPDATE public.user SET email = $2, username = $3, github_id = $4, google_id = $5 WHERE id = $1', 
            [updated_data.id, updated_data.email, updated_data.username, updated_data.github_id, updated_data.google_id]);
        await this.db.end();
        return result.rowCount > 0;
    }

    async getOrRegisterOAuth(provider: string , oauth_id: string, username: string, email: string): Promise<User> {
        await this.db.connect();
        await this.db.query('INSERT INTO public.user (' + provider + '_id, username, email) VALUES ($1, $2) ON CONFLICT DO NOTHING;', 
            [oauth_id, username, email]);
        let result = await this.db.query('SELECT id, email, username, github_id, google_id FROM public.user WHERE ' + provider + '_id = $1', [oauth_id]);
        await this.db.end()
        
        if (result.rowCount > 0) {
            return result.rows[0] as User;
        } else {
            return null;
        }
    }
}