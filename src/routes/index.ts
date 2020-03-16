import { Request, Response } from "express";
import { Router } from "express";

var router = Router();

/* GET home page. */
router.get('/', function(req: Request, res: Response, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
