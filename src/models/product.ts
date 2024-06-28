import Client from '../database'

export type Product = {
    id: number;
    name: string;
    price: number;
    catagory: string;
}

export class ProductStore {
    async index(): Promise<Product[]> {
        try {
            const conn = await Client.connect()
            const sql = 'SELECT * FROM products'

            const result = await conn.query(sql)

            conn.release()

            return result.rows
        } catch (err) {
            throw new Error(`Cannot get products: ${err}`)
        }
    }

    async show(id: string): Promise<Product> {
        try {
            const conn = await Client.connect()
            const sql = 'SELECT * FROM products WHERE id=($1)'

            const result = await conn.query(sql, [id])

            conn.release()

            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot get product: ${err}`)
        }
    }

    async showByCatagory(catagory: string): Promise<Product[]> {
        try {
            const conn = await Client.connect()
            const sql = 'SELECT * FROM products WHERE catagory=($1)'

            const result = await conn.query(sql, [catagory])

            conn.release()

            return result.rows
        } catch (err) {
            throw new Error(`Cannot get product: ${err}`)
        }
    }

    async create(p: Product): Promise<Product> {
        try {
            const conn = await Client.connect()
            const sql = 'INSERT INTO products (name, price, catagory) VALUES($1, $2, $3) RETURNING *'

            const result = await conn.query(sql, [p.name, p.price, p.catagory])

            conn.release()

            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot create product: ${err}`)
        }
    }

    async delete(id: string): Promise<Product> {
        try {
            const conn = await Client.connect()
            const sql = 'DELETE FROM products WHERE id=($1) RETURNING *'

            const result = await conn.query(sql, [id])

            conn.release()

            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot delete product: ${err}`)
        }
    }

    async update(p: Product): Promise<Product> {
        try {
            const conn = await Client.connect()
            const sql = 'UPDATE products SET name = $1, price = $2, catagory = $3 WHERE id = $4 RETURNING *'

            const result = await conn.query(sql, [p.name, p.price, p.catagory, p.id])

            conn.release()

            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot update product: ${err}`)
        }
    }
}