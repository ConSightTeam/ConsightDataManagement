import { Client } from 'pg'

export class DataPointRepository {
    db: Client;

    constructor() {
        this.db = new Client();
    }

    async insertOne(node_uuid: string, locationX: number, locationY: number, data: object): Promise<boolean> {
        await this.db.connect();
        let result = await this.db.query('INSERT INTO data_point (node, data, location, inserted_on) VALUES ($1, $2, ST_GeomFromGeoJSON($3), NOW())', 
                                         [node_uuid, JSON.stringify(data), this.constructGeoJsonPoint(locationX, locationY)]);
        await this.db.end();
        return result.rowCount > 0;
    }

    async insertOneWithoutLocation(node_uuid: string, data: object): Promise<boolean> {
        await this.db.connect();
        let result = await this.db.query('INSERT INTO data_point (node, data, location, inserted_on) VALUES ($1, $2, (SELECT location From node WHERE uuid = $1), NOW())', 
                                         [node_uuid, JSON.stringify(data)]);
        await this.db.end();
        return result.rowCount > 0;
    }

    async getTotal(node_uuid: string): Promise<string> {
        await this.db.connect();
        let result = await this.db.query('SELECT COUNT(*) FROM data_point WHERE node=$1', [node_uuid]);
        await this.db.end();
        return result.rows['count'];
    }

    async getMutiples(page: number, node_uuid: string) {
        await this.db.connect()
        let queryResult = await this.db.query(
            'SELECT data_point.id, ST_ASGeoJson(data_point.location) AS location, data_point.data, data_point.node, data_point.inserted_on \
             FROM data_point \
             WHERE node = $1 \
             ORDER BY node, inserted_on DESC \
             OFFSET $2 \
             LIMIT 10', [node_uuid, page * 10]);
        await this.db.end();
        let result: Array<DataPoint> = [];
        queryResult.rows.forEach(element => {
            let location: Geometry = JSON.parse(element.location) as Geometry;
            element.location = location;
            result.push(element as DataPoint)
        });
        return result;
    }

    public async deleteOne(id: number, owner_id: number): Promise<boolean> {
        await this.db.connect();
        let result = await this.db.query('DELETE FROM data_point WHERE data_point.id = $1 AND (SELECT (data_point.node = node.uuid) FROM node WHERE node.owner = $2)', [id, owner_id]);
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