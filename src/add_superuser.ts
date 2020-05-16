if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }

import { Client } from "pg";
import readline = require('readline-sync')
import PasswordValidator = require("password-validator");
import bcrypt = require('bcrypt');

import { get_password_schema } from "./helper/password_schema";

const usernameValidator = new PasswordValidator().min(5);
const emailValidator = new PasswordValidator().has(new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'));

let cli_args = process.argv.slice(2);
let username: string = cli_args[0];
let email: string = cli_args[1];
let password: string = cli_args[2];

if (!username) {
    username = readline.question('Please enter username: ');
}
if (!usernameValidator.validate(username)) {
    console.log('Error: username not valid');
    process.exit(1);
}

if (!email) {
    email = readline.question('Please enter E-Mail: ');
}
if (!emailValidator.validate(email)) {
    console.log('Error: invalid email');
    process.exit(1);
}

if (!password) {
    password = readline.question('Please enter password: ', { hideEchoBack: true })
}
if (!get_password_schema().validate(password)) {
    console.log('Error: Password is not complex enough.');
    process.exit(1);
}


const client = new Client();

(async () => {
    try {
        let hashedPassword = await bcrypt.hash(password, 10);

        await client.connect();
        let result = await client.query('INSERT INTO public.user (email, username, hashed_password, is_admin) VALUES ($1, $2, $3, TRUE)', [email, username, hashedPassword]);
        await client.end();
        
        if (result.rowCount > 0) {
            console.log("Account created successfully");
        } else {
            console.log("Failled to create account");
        }
    } catch (e) {
        console.error(e.stack);
    }
})();