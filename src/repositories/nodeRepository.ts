import { Client } from "pg";
import { Node } from "../model/Node";

export class NodeRepository {
    db: Client

    constructor() {
        this.db = new Client();
    }

    async getAll(): Promise<Node[]> {
        return null;
    }
}