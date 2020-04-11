import { Request, Response } from "express";
import { Router } from "express";
import { NodeRepository } from "../repositories/nodeRepository";
import { isLoggedIn } from "../middleware/isLoggedIn";
import { User } from "../model/User";

var router = Router();

router.get('/', isLoggedIn, function(req: Request, res: Response) {
  res.render('node', { title: "New Node" });
});

router.post('/', isLoggedIn, function(req: Request, res: Response) {
  let dao = new NodeRepository((req.user as User).id);
  console.log(req.body);
  if (req.body['node_type'] === 'static') {
    dao.insertOneWithLocation(req.body['uuid'], req.body['name'], parseFloat(req.body['x']), parseFloat(req.body['y']));
  } else {
    dao.insertOne(req.body['uuid'], req.body['name']);
  }
  res.redirect('/');
});

router.get('/:uuid', isLoggedIn, async function(req: Request, res: Response) {
  let dao = new NodeRepository((req.user as User).id);
  res.render('node', { node: await dao.get(req.params['uuid']), title: "Edit Node" });
});

router.post('/:uuid', isLoggedIn, function(req: Request, res: Response) {
  let dao = new NodeRepository((req.user as User).id);
  console.log(req.body);
  if (req.body['node_type'] === 'static') {
    dao.updateOneWithLocation(req.params['uuid'], req.body['name'], parseFloat(req.body['x']), parseFloat(req.body['y']));
  } else {
    dao.updateOne(req.params['uuid'], req.body['name']);
  }
  res.redirect('/');
});

router.get('/:uuid/delete', isLoggedIn, async function(req: Request, res: Response) {
  let dao = new NodeRepository((req.user as User).id);
  let node = await dao.get(req.params['uuid']);
  let delete_detail = node.name + ' (' + node.uuid + ')'; 
  res.render('delete_confirmation', { delete_detail: delete_detail, back_url: '/' });
});

router.post('/:uuid/delete', isLoggedIn, async function(req: Request, res: Response) {
  (new NodeRepository((req.user as User).id)).deleteOne(req.params['uuid']);
  res.redirect('/');
});

module.exports = router;
