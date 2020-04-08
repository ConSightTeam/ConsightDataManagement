import { Request, Response } from "express";
import { Router } from "express";
import { NodeRepository } from "../repositories/nodeRepository";

var router = Router();

router.get('/', function(req: Request, res: Response) {
  res.render('node', { title: "New Node" });
});

router.post('/', function(req: Request, res: Response) {
  let dao = new NodeRepository();
  console.log(req.body);
  if (req.body['node_type'] === 'static') {
    dao.insertOneWithLocation(req.body['uuid'], req.body['name'], parseFloat(req.body['x']), parseFloat(req.body['y']));
  } else {
    dao.insertOne(req.body['uuid'], req.body['name']);
  }
  res.redirect('/');
});

router.get('/:uuid', async function(req: Request, res: Response) {
  let dao = new NodeRepository();
  res.render('node', { node: await dao.get(req.params['uuid']), title: "Edit Node" });
});

router.post('/:uuid', function(req: Request, res: Response) {
  let dao = new NodeRepository();
  console.log(req.body);
  if (req.body['node_type'] === 'static') {
    dao.updateOneWithLocation(req.params['uuid'], req.body['name'], parseFloat(req.body['x']), parseFloat(req.body['y']));
  } else {
    dao.updateOne(req.params['uuid'], req.body['name']);
  }
  res.redirect('/');
});

router.get('/:uuid/delete', async function(req: Request, res: Response) {
  let dao = new NodeRepository();
  let node = await dao.get(req.params['uuid']);
  let delete_detail = node.name + ' (' + node.uuid + ')'; 
  res.render('delete_confirmation', { delete_detail: delete_detail, back_url: '/' });
});

router.post('/:uuid/delete', async function(req: Request, res: Response) {
  (new NodeRepository()).deleteOne(req.params['uuid']);
  res.redirect('/');
});

module.exports = router;