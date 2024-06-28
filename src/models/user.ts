import Client from '../database'

export type User = {
    id: number;
    firstName: string;
    lastName: string;
    password: string;
}

export class UserStore {
    async index(): Promise<User[]> {
        try {
            const conn = await Client.connect()
            const sql = 'SELECT * FROM users'

            const result = await conn.query(sql)

            conn.release()

            return result.rows
        } catch (err) {
            throw new Error(`Cannot get users: ${err}`)
        }
    }

    async show(id: string): Promise<User> {
        try {
            const conn = await Client.connect()
            const sql = 'SELECT * FROM users WHERE id=($1)'

            const result = await conn.query(sql, [id])

            conn.release()

            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot get user: ${err}`)
        }
    }

    async create(u: User): Promise<User> {
        try {
            const conn = await Client.connect()
            const sql = 'INSERT INTO users (firstName, lastName, password) VALUES($1, $2, $3) RETURNING *'

            const result = await conn.query(sql, [u.firstName, u.lastName, u.password])

            conn.release()

            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot create user: ${err}`)
        }
    }

    async delete(id: string): Promise<User> {
        try {
            const conn = await Client.connect()
            const sql = 'DELETE FROM users WHERE id=($1) RETURNING *'

            const result = await conn.query(sql, [id])

            conn.release()

            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot delete user: ${err}`)
        }
    }

    async update(u: User): Promise<User> {
        try {
            const conn = await Client.connect()
            const sql = 'UPDATE users SET firstName = $1, lastName = $2, password = $3 WHERE id = $4 RETURNING *'

            const result = await conn.query(sql, [u.firstName, u.lastName, u.password, u.id])

            conn.release()

            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot update user: ${err}`)
        }
    }
}