import { PassportStatic } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UserRepository } from "../repositories/userRepository";
import { User } from "../model/User";

export class AuthenticationSettings {
    readonly github_client_id: string;
    readonly github_secret: string;

    readonly google_client_id: string;
    readonly google_secret: string;

    readonly root_url: string;

    constructor() {
        this.github_client_id = process.env['GITHUB_CLIENT_ID'];
        this.github_secret = process.env['GITHUB_SECRET'];

        this.google_client_id = process.env['GOOGLE_CLIENT_ID'];
        this.google_secret = process.env['GOOGLE_SECRET'];

        this.root_url = process.env['ROOT_URL'];
    }

    public get github_enabled() : boolean {
        return (this.github_client_id != null) && (this.github_secret != null);
    }

    public get github_callback() : string {
        return this.root_url + 'login/github/callback';
    }
    
    public get google_enabled() : boolean {
        return (this.google_client_id != null) && (this.google_secret != null);
    }

    
    public get google_callback() : string {
        return this.root_url + 'login/google/callback';
    }
    
}

export function setup_authentication(passport: PassportStatic): void {
    let authentication_settings = new AuthenticationSettings();

    // Local Setup
    passport.use(new LocalStrategy(async function(username: string, password: string, done) {
        let dao = new UserRepository();
        let user: User;
        try {
            user = await dao.get(username, password);
            if (!user) {
                return done(null, false, {message: "Username or password does not match"});
            }
        } catch (e) {
            done(e);
        }
    
        return done(null, user);
    }));

    // Github Setup
    if (authentication_settings.github_enabled) {
        passport.use(new GithubStrategy({
            clientID: authentication_settings.github_client_id,
            clientSecret: authentication_settings.github_secret,
            callbackURL: authentication_settings.github_callback
        }, async function(accessToken, refreshToken, profile, done) {
            let dao = new UserRepository();
            let user: User;
            try {
                user = await dao.getOrRegisterOAuth('github', profile.id, profile.username);
                if (!user) {
                    return done(null, false, {message: "Fail to create or retrive github account"});
                }
            } catch (e) {
                done(e);
            }
        
            return done(null, user);
        }));
    }

    // Google Setup
    if (authentication_settings.google_enabled) {
        passport.use(new GoogleStrategy({
            clientID: authentication_settings.google_client_id,
            clientSecret: authentication_settings.google_secret,
            callbackURL: authentication_settings.google_callback
        }, async function(accessToken, refreshToken, profile, done) {
            let dao = new UserRepository();
            let user: User;
            try {
                user = await dao.getOrRegisterOAuth('google', profile.id, profile.username);
                if (!user) {
                    return done(null, false, {message: "Fail to create or retrive google account"});
                }
            } catch (e) {
                done(e);
            }
        
            return done(null, user);
        }));
    }
    
    passport.serializeUser(function(user: User, done) {
        done(null, user.id);
      });
      
    passport.deserializeUser(async function(id: number, done) {
        let dao = new UserRepository();
        try {
            done(null, await dao.getByID(id));
        } catch (e) {
            done(e);
        }
    });
}