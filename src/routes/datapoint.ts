import { Request, Response } from "express";
import { Router } from "express";
import { DataPointRepository } from "../repositories/dataPointRepository";

var router = Router();

router.get('/:node_uuid', async function(req: Request, res: Response) {
    let node_uuid = req.params['node_uuid'];
    let page: number = parseInt(req.query['page-select']) || 1;
    let dao1 = new DataPointRepository();
    let dao2 = new DataPointRepository();
    res.render('datapoint_list', { 
        data_points: await dao1.getMutiples(page, node_uuid), current_page: page, 
        total_page: await dao2.getTotal(node_uuid), node_uuid: node_uuid 
    });
});

router.get('/:node_uuid/:id/delete', async function(req: Request, res: Response) {
    let node_uuid = req.params['node_uuid'];
    let id = req.params['id'];
    let delete_detail = "data point id: " + id + ", from node id: " + node_uuid;
    res.render('delete_confirmation', { delete_detail: delete_detail, back_url: '/data_point/' + node_uuid });
});

router.post('/:node_uuid/:id/delete', async function(req: Request, res: Response) {
    let node_uuid = req.params['node_uuid'];
    let id = req.params['id'];
    (new DataPointRepository()).deleteOne(parseInt(id));
    res.redirect('/data_point/' + node_uuid);
});

module.exports = router;