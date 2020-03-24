import { Request, Response } from "express";
import { Router } from "express";
import { NodeRepository } from "../repositories/nodeRepository";

var router = Router();

router.get('/', async function(req: Request, res: Response, next) {
  let dao = new NodeRepository();
  res.render('index', { nodes: await dao.getAll() });
});

module.exports = router;
