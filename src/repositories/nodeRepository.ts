import { query } from "../helper/db";
import { Node } from "../model/Node";

export class NodeRepository {
    private owner_id: number;

    constructor(owner_id: number) {
        this.owner_id = owner_id;
    }

    async getAll(): Promise<Node[]> {
        let queryResult = await query('SELECT uuid, name, ST_ASGeoJson(location) AS location FROM node WHERE owner = $1;', [this.owner_id]);
        let result: Array<Node> = [];
        queryResult.rows.forEach(element => {
            if (element.location) {
                let location: Geometry = JSON.parse(element.location) as Geometry;
                element.location = location;
            }
            result.push(element as Node);
        });
        return result;
    }

    async get(uuid: string): Promise<Node> {
        let queryResult = await query('SELECT uuid, name, ST_ASGeoJson(location) AS location FROM node WHERE uuid = $1 AND owner = $2;', [uuid, this.owner_id]);
        let result: any = queryResult.rows[0];
        if (result.location) {
            let location: Geometry = JSON.parse(result.location) as Geometry;
            result.location = location;
        }
        return result as Node;
    }

    async insertOne(uuid:string, name: string): Promise<boolean> {
        let result = await query('INSERT INTO node (uuid, name, owner) VALUES ($1, $2, $3)', [uuid, name, this.owner_id]);
        return result.rowCount > 0;
    }

    async insertOneWithLocation(uuid:string, name: string, x: number, y: number): Promise<boolean> {
        let result = await query('INSERT INTO node (uuid, name, location, owner) VALUES ($1, $2, ST_GeomFromGeoJSON($3), $4)', 
            [uuid, name, this.constructGeoJsonPoint(x, y), this.owner_id]);
        return result.rowCount > 0;
    }

    async updateOne(uuid:string, name: string): Promise<boolean> {
        let result = await query('UPDATE node SET name = $2, location = null WHERE uuid = $1 AND owner = $3', [uuid, name, this.owner_id]);
        return result.rowCount > 0;
    }

    async updateOneWithLocation(uuid:string, name: string, x: number, y: number): Promise<boolean> {
        let result = await query('UPDATE node SET name = $2, location = ST_GeomFromGeoJSON($3) WHERE uuid = $1 AND owner = $4', 
            [uuid, name, this.constructGeoJsonPoint(x, y), this.owner_id]);
        return result.rowCount > 0;
    }

    async deleteOne(uuid: string){
        let result = await query('DELETE FROM node WHERE uuid = $1 AND owner = $2', [uuid, this.owner_id]);
        return result.rowCount > 0;
    }

    private constructGeoJsonPoint(x: number, y: number) {
        return {
            "type": "Point",
            "coordinates": [x, y]
        }
    }
}