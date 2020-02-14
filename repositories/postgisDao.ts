import { Client } from 'pg'

export class DataPointRepository {
    db: Client

    constructor() {
        this.db = new Client();
    }

    async insertOne(node_uuid: string, geo: object, data: object) {
        await this.db.connect();
        let result = await this.db.query('INSERT INTO data_point (node, data, location, inserted_on) VALUES ($1, $2, $3, NOW())', [node_uuid, JSON.stringify(data), geo]);
        await this.db.end();
        return result.rowCount > 0;
    }

    async insertOneWithoutLocation(node_uuid: string, data: object) {
        await this.db.connect();
        let result = await this.db.query('INSERT INTO data_point (node, data, location, inserted_on) VALUES ($1, $2, (SELECT location From node WHERE uuid = $1), NOW())', [node_uuid, JSON.stringify(data)]);
        await this.db.end();
        return result.rowCount > 0;
    }
}