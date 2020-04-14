import { Router, Request, Response } from "express";

import { isLoggedIn } from "../middleware/isLoggedIn";

import { AuthenticationSettings } from "../helper/authentication";
import { User } from "../model/User";

var router = Router();

router.use(isLoggedIn);

router.get('/', function(req: Request, res: Response) {
    let auth_settings = new AuthenticationSettings();
    
    res.render('profile', { current_user: req.user as User, github_enabled: auth_settings.github_enabled, google_enabled: auth_settings.google_enabled });
});


module.exports = router;
