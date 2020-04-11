import { Request, Response } from "express";
import { Router } from "express";

let router = Router();

router.get('/', function(req: Request, res: Response) {
    req.logOut();
    res.redirect('/login');
});

module.exports = router;
