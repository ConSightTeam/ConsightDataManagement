import { Client } from "pg";
import { Node } from "../model/Node";

export class NodeRepository {
    db: Client

    constructor() {
        this.db = new Client();
    }

    async getAll(): Promise<Node[]> {
        await this.db.connect();
        let queryResult = await this.db.query('SELECT uuid, name, ST_ASGeoJson(location) AS location FROM node;');
        await this.db.end();
        let result: Array<Node> = [];
        queryResult.rows.forEach(element => {
            let location: Geometry = JSON.parse(element.location) as Geometry;
            element.location = location;
            result.push(element as Node);
        });
        console.log(result);
        return result;
    }
}