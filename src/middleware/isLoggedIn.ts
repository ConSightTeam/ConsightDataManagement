import { Request, Response, NextFunction } from "express";

export function isLoggedIn(req: Request, res: Response, next: NextFunction) {
    if (req.user) {
        res.locals['user'] = req.user;
        console.log(req.user);
        next();
    } else {
        res.redirect('/login')
    }
}