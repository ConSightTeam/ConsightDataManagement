import { query } from "../helper/db";
import { User } from "../model/User";
import bcrypt = require('bcrypt');

export class UserRepository {
    async getByID(id: number): Promise<User> {
        let result = await query('SELECT id, username, email, hashed_password IS NOT NULL as have_password, github_id, google_id FROM public.user WHERE id = $1', [id]);
        
        if (result.rowCount > 0) {
            return result.rows[0] as User;
        } else {
            return null;
        }
    }

    async get(username: string, password: string): Promise<User> {
        let result = await query('SELECT id, username, email, hashed_password, hashed_password IS NOT NULL as have_password, github_id, google_id FROM public.user WHERE LOWER(username) = LOWER($1)', [username]);

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

        let result = await query('INSERT INTO public.user (email, username, hashed_password) VALUES ($1, $2, $3)', [email, username, hashedPassword]);
        return result.rowCount > 0;
    }

    async update(updated_data: User): Promise<boolean> {
        let result = await query('UPDATE public.user SET email = $2, username = $3, github_id = $4, google_id = $5 WHERE id = $1', 
            [updated_data.id, updated_data.email, updated_data.username, updated_data.github_id, updated_data.google_id]);
        return result.rowCount > 0;
    }

    async updatePassword(user: User, new_password: string): Promise<boolean> {
        let newHashedPassword = await bcrypt.hash(new_password, 10);

        let result = await query('UPDATE public.user SET hashed_password = $2 WHERE id = $1', 
            [user.id, newHashedPassword]);

        return result.rowCount > 0;
    }

    async getOrRegisterOAuth(provider: string , oauth_id: string, username: string, email: string): Promise<User> {
        await query('INSERT INTO public.user (' + provider + '_id, username, email) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', 
                    [oauth_id, username, email]);
        let result = await query('SELECT id, email, username, github_id, google_id FROM public.user WHERE ' + provider + '_id = $1', [oauth_id]);
        
        if (result.rowCount > 0) {
            return result.rows[0] as User;
        } else {
            return null;
        }
    }
}