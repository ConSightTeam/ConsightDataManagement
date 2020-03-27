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
            if (element.location) {
                let location: Geometry = JSON.parse(element.location) as Geometry;
                element.location = location;
            }
            result.push(element as Node);
        });
        console.log(result);
        return result;
    }

    async get(uuid: string): Promise<Node> {
        await this.db.connect();
        let queryResult = await this.db.query('SELECT uuid, name, ST_ASGeoJson(location) AS location FROM node WHERE uuid = $1;', [uuid]);
        await this.db.end();
        let result: any = queryResult.rows[0];
        if (result.location) {
            let location: Geometry = JSON.parse(result.location) as Geometry;
            result.location = location;
        }
        console.log(result);
        return result as Node;
    }

    async insertOne(uuid:string, name: string): Promise<boolean> {
        await this.db.connect();
        let result = await this.db.query('INSERT INTO node (uuid, name) VALUES ($1, $2)', [uuid, name]);
        await this.db.end();
        return result.rowCount > 0;
    }

    async insertOneWithLocation(uuid:string, name: string, x: number, y: number): Promise<boolean> {
        await this.db.connect();
        let result = await this.db.query('INSERT INTO node (uuid, name, location) VALUES ($1, $2, ST_GeomFromGeoJSON($3))', [uuid, name, this.constructGeoJsonPoint(x, y)]);
        await this.db.end();
        return result.rowCount > 0;
    }

    async updateOne(uuid:string, name: string): Promise<boolean> {
        await this.db.connect();
        let result = await this.db.query('UPDATE node SET name = $2, location = null WHERE uuid = $1', [uuid, name]);
        await this.db.end();
        return result.rowCount > 0;
    }

    async updateOneWithLocation(uuid:string, name: string, x: number, y: number): Promise<boolean> {
        await this.db.connect();
        let result = await this.db.query('UPDATE node SET name = $2, location = ST_GeomFromGeoJSON($3) WHERE uuid = $1', [uuid, name, this.constructGeoJsonPoint(x, y)]);
        await this.db.end();
        return result.rowCount > 0;
    }

    async deleteOne(uuid: string){
        await this.db.connect();
        let result = await this.db.query('DELETE FROM node WHERE uuid = $1', [uuid]);
        await this.db.end();
        return result.rowCount > 0;
    }

    private constructGeoJsonPoint(x: number, y: number) {
        return {
            "type": "Point",
            "coordinates": [x, y]
        }
    }
}