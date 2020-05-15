import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { NodeRepository } from "../repositories/nodeRepository";
import { isLoggedIn } from "../middleware/isLoggedIn";
import { User } from "../model/User";
import { Node } from "../model/Node";
import { generateToken } from "../middleware/manageToken";

var router = Router();

router.use(isLoggedIn);

router.get('/', function(req: Request, res: Response) {
  res.render('node', { title: "New Node" });
});

router.post('/', async function(req: Request, res: Response, next: NextFunction) {
  let dao = new NodeRepository((req.user as User).id);
  try {
    if (req.body['node_type'] === 'static') {
      await dao.insertOneWithLocation(req.body['uuid'], req.body['name'], parseFloat(req.body['x']), parseFloat(req.body['y']));
    } else {
      await dao.insertOne(req.body['uuid'], req.body['name']);
    }
  } catch (err) {
    return next(err);
  }
  
  res.redirect('/');
});

router.get('/:uuid', async function(req: Request, res: Response) {
  let dao = new NodeRepository((req.user as User).id);
  res.render('node', { node: await dao.get(req.params['uuid']), title: "Edit Node" });
});

router.post('/:uuid', function(req: Request, res: Response, next: NextFunction) {
  let dao = new NodeRepository((req.user as User).id);
  try {
    if (req.body['node_type'] === 'static') {
      dao.updateOneWithLocation(req.params['uuid'], req.body['name'], parseFloat(req.body['x']), parseFloat(req.body['y']));
    } else {
      dao.updateOne(req.params['uuid'], req.body['name']);
    }
  } catch (e) {
    return next(e);
  }
  
  res.redirect('/');
});

router.get('/:uuid/delete', async function(req: Request, res: Response) {
  let dao = new NodeRepository((req.user as User).id);
  let node = await dao.get(req.params['uuid']);
  let delete_detail = node.name + ' (' + node.uuid + ')'; 
  res.render('delete_confirmation', { delete_detail: delete_detail, back_url: '/' });
});

router.post('/:uuid/delete', async function(req: Request, res: Response, next: NextFunction) {
  try {
    (new NodeRepository((req.user as User).id)).deleteOne(req.params['uuid']);
  } catch (e) {
    return next(e);
  }
  
  res.redirect('/');
});

router.get('/:uuid/token', function(req: Request, res: Response) {
  res.render('generate_token');
})

router.post('/:uuid/token', async function(req: Request, res: Response, next: NextFunction) {
  let node_uuid: string = req.params['uuid'];
  let dao = new NodeRepository((req.user as User).id);
  let node: Node = null;

  try {
    node = await dao.get(node_uuid);
  } catch (e) {
    return next(e);
  }

  // check to see if the user actually is the owner of the node by seeing if the query return any result
  if (node) { 
    res.render('generate_token', { token: generateToken(node) });
  } else {
    res.send(404).send({ message: 'Either the node doesnt exist or permission to the resouce is denied.' });
  }
});

module.exports = router;
