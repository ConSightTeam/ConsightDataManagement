import { Pool, PoolClient } from "pg";

const pool = new Pool()

export function query(text: string, params?: Array<any>) {
  if (params) {
    return pool.query(text, params);
  } else {
    return pool.query(text);
  }
}

export function get_pool_client(): Promise<PoolClient> { return pool.connect() }