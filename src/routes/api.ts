import { Request, Response } from "express";
import { DataPointRepository } from "../repositories/dataPointRepository";
var express = require('express');
var router = express.Router();

router.post('/', async function(req: Request, res: Response) {
    let haveLocation: boolean = (req.body['lat'] != null) && (req.body['long'] != null);
    let dao = new DataPointRepository();
    let success: boolean = false;
    try {
        if (haveLocation) {
            let lat: number = parseFloat(req.body['lat']);
            let long: number = parseFloat(req.body['long']);
            if (lat == null && long == null) {
                res.status(400).end({'error': 'Invalid lat or long'});
            }
            success = await dao.insertOne(req.body['uuid'], lat, long, req.body['data']);
        } else {
            success = await dao.insertOneWithoutLocation(req.body['uuid'], req.body['data']);
        }
    } catch (err) {
        console.error("Request: " + JSON.stringify(req.body));
        console.error(err.message);
        res.status(500).end(err.messenge);
        return;
    }
    if (success) {
        res.sendStatus(201);
    } else {
        res.sendStatus(400);
    }
    res.end();
});

module.exports = router;
