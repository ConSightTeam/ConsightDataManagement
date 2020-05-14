import { Router, Request, Response } from "express";

import { isLoggedIn } from "../middleware/isLoggedIn";

import { AuthenticationSettings } from "../helper/authentication";
import { User } from "../model/User";
import { UserRepository } from "../repositories/userRepository";
import { check, validationResult } from "express-validator";
import { get_password_schema } from "../helper/password_schema";

var router = Router();

router.use(isLoggedIn);

router.get('/', function(req: Request, res: Response) {
    let auth_settings = new AuthenticationSettings();
    
    res.render('profile', { current_user: req.user as User, 
        github_enabled: auth_settings.github_enabled, google_enabled: auth_settings.google_enabled,
        error: req.flash('error') });
});

router.get('/change_password', function(req: Request, res: Response) {
    res.render('change_password');
});

router.post('/change_password', [
        check('password').notEmpty().custom((value) => get_password_schema().validate(value)), 
        check('password_confirm', 'Confirm Password field must have the same value as the password field')
        .notEmpty().custom((value, { req }) => value === req.body['password'])
    ], 
    async function(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('change_password', { error: errors});
        }

        let dao = new UserRepository();
        if (!(await dao.updatePassword(req.user as User, req.body['password']))) {
            req.flash('error', 'Error updating password');
        } 
        res.redirect('/profile');
    }
);

router.get('/edit', function(req: Request, res: Response) {
    let user = req.user as User;
    res.render('edit_profile', { email: user.email, username: user.username });
})

router.post('/edit', [
    check('email').notEmpty().isEmail().normalizeEmail(), 
    check('username').notEmpty().isLength({ min: 5 })
    ], 
    async function(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('edit_profile', { error: errors});
        }

        let user: User = req.user as User;
        user.email = req.body['email'];
        user.username = req.body['username'];

        let dao = new UserRepository();
        if (!(await dao.update(user))) {
            req.flash('error', 'Error updating password');
        } 
        res.redirect('/profile');
    }
);

module.exports = router;
