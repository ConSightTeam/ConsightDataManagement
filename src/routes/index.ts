import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { NodeRepository } from "../repositories/nodeRepository";
import { isLoggedIn } from "../middleware/isLoggedIn";
import { User } from "../model/User";

var router = Router();

router.get('/', isLoggedIn, async function(req: Request, res: Response, next: NextFunction) {
  let dao = new NodeRepository((req.user as User).id);
  try {
    res.render('index', { nodes: await dao.getAll() });
  } catch (err) {
    return next(err);
  }
  
});

module.exports = router;
