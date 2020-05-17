import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { DataPointRepository } from "../repositories/dataPointRepository";
import { isLoggedIn } from "../middleware/isLoggedIn";
import { User } from "../model/User";

var router = Router();

router.use(isLoggedIn);

router.get('/:node_uuid', async function(req: Request, res: Response, next: NextFunction) {
    let node_uuid = req.params['node_uuid'];
    let page: number = parseInt(req.query['page-select'] as string) || 1;
    let dao = new DataPointRepository();
    let total_instances: number = parseInt(await dao.getTotal(node_uuid));
    let total_pages = Math.ceil(total_instances / 10);

    try {
        res.render('datapoint_list', { 
            data_points: await dao.getMutiples(page, node_uuid), current_page: page, 
            total_pages: total_pages ,node_uuid: node_uuid 
        });
    } catch (e) {
        return next(e);
    }
});

router.get('/:node_uuid/:id/delete', async function(req: Request, res: Response) {
    let node_uuid = req.params['node_uuid'];
    let id = req.params['id'];
    let delete_detail = "data point id: " + id + ", from node id: " + node_uuid;
    res.render('delete_confirmation', { delete_detail: delete_detail, back_url: '/data_point/' + node_uuid });
});

router.post('/:node_uuid/:id/delete', async function(req: Request, res: Response, next: NextFunction) {
    let node_uuid = req.params['node_uuid'];
    let id = req.params['id'];

    try {
        await (new DataPointRepository()).deleteOne(parseInt(id), (req.user as User).id);
    } catch (e) {
        return next(e);
    }
    
    res.redirect('/data_point/' + node_uuid);
});

module.exports = router;