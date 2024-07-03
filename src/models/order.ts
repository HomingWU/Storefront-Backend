import Client from '../database'

export type Order = {
    id: number;
    user_id: number;
    status: string;
}
export type OrderProduct = {
    id: number;
    quantity: number;
    order_id: number;
    product_id: number;
}

export class OrderStore {
    async index(): Promise<Order[]> {
        try {
            const conn = await Client.connect()
            const sql = 'SELECT * FROM orders'

            const result = await conn.query(sql)

            conn.release()

            const orders = result.rows.map((row: Order) => {
                row.user_id = parseInt(row.user_id as unknown as string);
                return row;
            });

            return orders
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

            result.rows[0].user_id = parseInt(result.rows[0].user_id)

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

            const orders : Order[] = await Promise.all(result.rows.map(async (order: Order) => {
                const productsSql = 'SELECT product_id, SUM(quantity) AS quantity FROM order_products WHERE order_id=($1) GROUP BY product_id'
                const productsResult = await conn.query(productsSql, [order.id])
                return {
                    id: order.id,
                    user_id: parseInt(order.user_id as unknown as string),
                    status: order.status,
                    products: productsResult.rows
                }
            }))

            conn.release()

            return orders
        } catch (err) {
            throw new Error(`Could not find order for user ${user_id}. Error: ${err}`)
        }
    }

    async completedOrdersByUser(user_id: string): Promise<Order[]> {
        try {
            const conn = await Client.connect()
            const sql = 'SELECT * FROM orders WHERE user_id=($1) AND status=\'complete\''

            const result = await conn.query(sql, [user_id])

            const orders : Order[] = await Promise.all(result.rows.map(async (order: Order) => {
                const productsSql = 'SELECT product_id, SUM(quantity) AS quantity FROM order_products WHERE order_id=($1) GROUP BY product_id'
                const productsResult = await conn.query(productsSql, [order.id])
                return {
                    id: order.id,
                    user_id: order.user_id,
                    status: order.status,
                    products: productsResult.rows
                }
            }))

            conn.release()

            return orders
        } catch (err) {
            throw new Error(`Could not find order for user ${user_id}. Error: ${err}`)
        }
    }

    async addProduct(quantity: number, userId: string, orderId: string, productId: string): Promise<OrderProduct> {

        // get order to see if it is active and belongs to user
        try {
            const ordersql = 'SELECT * FROM orders WHERE id=($1)'

            const conn = await Client.connect()

            const result = await conn.query(ordersql, [orderId])

            const order = result.rows[0]
            conn.release()
            if (order.status !== "active") {
                throw new Error(`Could not add product ${productId} to order ${orderId} because order status is ${order.status}`)
            }

            if (order.user_id !== userId) {
                throw new Error(`Could not add product ${productId} to order ${orderId} because order does not belong to user ${userId}`)
            }
            
        } catch (err) {
            throw new Error(`${err}`)
        }

        try {
            const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *'

            const conn = await Client.connect()

            const result = await conn
                .query(sql, [quantity, orderId, productId])

            const order = result.rows[0]
            result.rows[0].order_id = parseInt(result.rows[0].order_id)
            result.rows[0].product_id = parseInt(result.rows[0].product_id)

            conn.release()

            return order
        } catch (err) {
            throw new Error(`Could not add product ${productId} to order ${orderId}: ${err}`)
        }
    }

    async create(o: Order): Promise<Order> {
        try {
            const conn = await Client.connect()
            const sql = 'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *'

            const result = await conn.query(sql, [o.user_id, o.status])

            conn.release()
            result.rows[0].user_id = parseInt(result.rows[0].user_id)

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
            result.rows[0].user_id = parseInt(result.rows[0].user_id)
            
            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not update order ${o.id}. Error: ${err}`)
        }
    }

    async delete(order : Order): Promise<Order> {
        try {
            const conn = await Client.connect()
            const sql = 'SELECT * FROM orders WHERE id=($1)'
            const result = await conn.query(sql, [order.id])
            conn.release()
            if (result.rows.length === 0) {
                throw new Error(`Could not find order ${order.id}`)
            } else if (parseInt(result.rows[0].user_id) !== order.user_id) {
                throw new Error(`Could not delete order ${order.id} because it does not belong to user ${order.user_id}`)
            }
        } catch (err) {
            throw new Error(`${err}`)
        }

        try {
            const conn = await Client.connect()
            const sql1 = 'DELETE FROM order_products WHERE order_id=($1)'
            const sql2 = 'DELETE FROM orders WHERE id=($1) RETURNING *'

            await conn.query(sql1, [order.id])
            const result2 = await conn.query(sql2, [order.id])

            conn.release()
            result2.rows[0].user_id = parseInt(result2.rows[0].user_id)

            return result2.rows[0]
        } catch (err) {
            throw new Error(`Could not delete order ${order.id}. Error: ${err}`)
        }
    }
}