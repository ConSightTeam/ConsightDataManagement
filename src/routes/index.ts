import { Request, Response } from "express";
import { Router } from "express";
import { NodeRepository } from "../repositories/nodeRepository";
import { isLoggedIn } from "../middleware/isLoggedIn";
import { User } from "../model/User";

var router = Router();

router.get('/', isLoggedIn, async function(req: Request, res: Response, next) {
  let dao = new NodeRepository((req.user as User).id);
  res.render('index', { nodes: await dao.getAll() });
});

module.exports = router;
