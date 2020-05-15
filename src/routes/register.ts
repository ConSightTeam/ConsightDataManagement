import { Router, Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import { UserRepository } from "../repositories/userRepository";
import { get_password_schema } from "../helper/password_schema";

let router = Router();

router.get('/', function(req: Request, res: Response) {
    res.render('register');
});

router.post('/', 
        [check('email').notEmpty().isEmail().normalizeEmail(), 
        check('username').notEmpty().isLength({ min: 5 }), 
        check('password').notEmpty().custom((value) => get_password_schema().validate(value)), 
        check('password_confirm', 'Confirm Password field must have the same value as the password field')
            .notEmpty().custom((value, { req }) => value === req.body['password'])
    ],
    async function(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('register', { error: errors});
        }

        let username: string = req.body['username'];
        let password: string = req.body['password'];
        let email: string = req.body['email'];

        let dao = new UserRepository();
        try {
            dao.register(email, username, password);
        } catch(e) {
            return next(e)
        }
        
        res.redirect('/login');
});

module.exports = router;
