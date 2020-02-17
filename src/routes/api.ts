import { Request, Response } from "express";
import { DataPointRepository } from "../repositories/postgisDao";
var express = require('express');
var router = express.Router();

router.post('/', async function(req: Request, res: Response) {
    let dao = new DataPointRepository();
    await dao.insertOneWithoutLocation(req.body['uuid'], req.body['data']);
    res.sendStatus(201);
    res.end();
});

module.exports = router;
