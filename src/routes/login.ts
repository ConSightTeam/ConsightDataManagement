import { Request, Response } from "express";
import { Router } from "express";
import * as passport from 'passport';
import { AuthenticationSettings } from "../helper/authentication";

let router = Router();

router.get('/', function(req: Request, res: Response) {
  let auth_settings = new AuthenticationSettings();
  res.render('login', { message: req.flash('error'), google_enabled: auth_settings.google_enabled, github_enabled: auth_settings.github_enabled });
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/github', passport.authenticate('github', {scope: [ 'user:email' ]}));

router.get('/github/callback', passport.authenticate('github', { 
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/google', passport.authenticate('google', {scope: 'openid profile email' }));

router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

module.exports = router;
