import Client from '../database'

export type Order = {
    id: number;
    user_id: number;
    status: string;
}

export class OrderStore {
    async index(): Promise<Order[]> {
        try {
            const conn = await Client.connect()
            const sql = 'SELECT * FROM orders'

            const result = await conn.query(sql)

            conn.release()

            return result.rows
        } catch (err) {
            throw new Error(`Could not get orders. Error: ${err}`)
        }
    }

    async show(id: string): Promise<Order> {
        try {
            const conn = await Client.connect()
            const sql = 'SELECT * FROM orders WHERE id=($1)'

            const result = await conn.query(sql, [id])

            conn.release()

            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not find order ${id}. Error: ${err}`)
        }
    }

    async currentOrderByUser(user_id: string): Promise<Order[]> {
        try {
            const conn = await Client.connect()
            const sql = 'SELECT * FROM orders WHERE user_id=($1) AND status=\'active\''

            const result = await conn.query(sql, [user_id])

            conn.release()

            return result.rows
        } catch (err) {
            throw new Error(`Could not find order for user ${user_id}. Error: ${err}`)
        }
    }

    async completedOrdersByUser(user_id: string): Promise<Order[]> {
        try {
            const conn = await Client.connect()
            const sql = 'SELECT * FROM orders WHERE user_id=($1) AND status=\'complete\''

            const result = await conn.query(sql, [user_id])

            conn.release()

            return result.rows
        } catch (err) {
            throw new Error(`Could not find order for user ${user_id}. Error: ${err}`)
        }
    }

    async create(o: Order): Promise<Order> {
        try {
            const conn = await Client.connect()
            const sql = 'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *'

            const result = await conn.query(sql, [o.user_id, o.status])

            conn.release()

            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not add new order. Error: ${err}`)
        }
    }

    async update(o: Order): Promise<Order> {
        try {
            const conn = await Client.connect()
            const sql = 'UPDATE orders SET user_id = $1, status = $2 WHERE id = $3 RETURNING *'

            const result = await conn.query(sql, [o.user_id, o.status, o.id])

            conn.release()

            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not update order ${o.id}. Error: ${err}`)
        }
    }

    async delete(id: string): Promise<Order> {
        try {
            const conn = await Client.connect()
            const sql = 'DELETE FROM orders WHERE id=($1) RETURNING *'

            const result = await conn.query(sql, [id])

            conn.release()

            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not delete order ${id}. Error: ${err}`)
        }
    }
}