import { Client } from 'pg'

export class DataPointRepository {
    db: Client

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

    private constructGeoJsonPoint(x: number, y: number) {
        return {
            "type": "Point",
            "coordinates": [x, y]
        }
    }
}