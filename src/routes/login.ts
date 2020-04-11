import { Request, Response } from "express";
import { Router } from "express";
var passport = require('passport');

let router = Router();

router.get('/', function(req: Request, res: Response) {
  res.render('login');
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

module.exports = router;
