import Client from '../database'
import bcrypt from 'bcrypt'

export type User = {
    id: number;
    firstname: string;
    lastname: string;
    password: string;
}
const saltRounds = process.env.SALT_ROUNDS as string
const pepper = process.env.BCRYPT_PASSWORD

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
            const sql = 'INSERT INTO users (firstname, lastname, password) VALUES($1, $2, $3) RETURNING *'
            const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds))
            const result = await conn.query(sql, [u.firstname, u.lastname, hash])

            conn.release()

            return result.rows[0]
            
        } catch (err) {
            throw new Error(`Cannot create user: ${err}`)
        }
    }

    async authenticate(firstname: string, lastname: string, password: string): Promise<User | null> {

        const conn = await Client.connect()
        const sql = 'SELECT * FROM users WHERE firstname=($1) AND lastname=($2)'
        const result = await conn.query(sql, [firstname, lastname])

        if (result.rows.length) {
            const user = result.rows[0]
            if (bcrypt.compareSync(password + pepper, user.password)) {
                return user
            }
        }
        return null
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
            const sql = 'UPDATE users SET firstname = $1, lastname = $2, password = $3 WHERE id = $4 RETURNING *'
            const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds))
            const result = await conn.query(sql, [u.firstname, u.lastname, hash, u.id])

            conn.release()

            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot update user: ${err}`)
        }
    }
}