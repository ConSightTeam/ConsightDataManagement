import { Request, Response } from "express";
import { Router } from "express";
import { UserRepository } from "../repositories/userRepository";

let router = Router();

router.get('/', function(req: Request, res: Response) {
    res.render('register');
});

router.post('/', async function(req: Request, res: Response) {
    let username: string = req.body['username'];
    let password: string = req.body['password'];
    let password_confirm: string = req.body['password_confirm'];

    if (password != password_confirm) {
        return res.render('register', { error: 'Password and password confirmation does not match.' });
    }

    let dao = new UserRepository();
    dao.register(username, password);

    res.redirect('/login');
});

module.exports = router;
