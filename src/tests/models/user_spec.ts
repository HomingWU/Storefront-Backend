import {User, UserStore} from '../../models/user';
import bcrypt from 'bcrypt'
import Client from '../../database'

const store = new UserStore()

describe('User Model', () => {

    const saltRounds = process.env.SALT_ROUNDS as string
    const pepper = process.env.BCRYPT_PASSWORD

    beforeAll(async() => {
        await store.create({
            id: 0,
            firstname: 'Test',
            lastname: 'User1',
            password: 'password1'
        })
        await store.create({
            id: 0,
            firstname: 'Test',
            lastname: 'User2',
            password: 'password2'
        })
        await store.create({
            id: 0,
            firstname: 'Test',
            lastname: 'User3',
            password: 'password3'
        })
    })

    afterAll(async() => {
        const conn = await Client.connect()
        await conn.query('TRUNCATE ONLY users RESTART IDENTITY CASCADE;')
        conn.release
    })

    it('should have an index method', () => {
        expect(store.index).toBeDefined()
    })

    it('should have a show method', () => {
        expect(store.show).toBeDefined()
    })

    it('should have a create method', () => {
        expect(store.create).toBeDefined()
    })

    it('should have an authenticate method', () => {
        expect(store.authenticate).toBeDefined()
    })

    it('should have a delete method', () => {
        expect(store.delete).toBeDefined()
    })

    it('should have an update method', () => {
        expect(store.update).toBeDefined()
    })

    it('index method should return a list of users', async () => {
        const result = await store.index()
        expect(result.length).toBe(3)
    })

    it('create method should add a user', async () => {
        const result = await store.create({
            id: 0,
            firstname: 'Test',
            lastname: 'User4',
            password: 'password4'
        })
        expect(result.id).toBe(4)
        expect(result.firstname).toBe('Test')
        expect(result.lastname).toBe('User4')
        expect(bcrypt.compareSync('password4' + pepper, result.password)).toBe(true)
        expect((await store.index()).length).toBe(4)
    })

    it('authenticate method should return a user if correct', async () => {
        const result = await store.authenticate('Test', 'User1', 'password1')
        expect(result).toBeDefined()
    })

    it('authenticate method should return null if incorrect', async () => {
        const result = await store.authenticate('Test', 'User1', 'password2')
        expect(result).toBeNull()
    })

    it('show method should return the correct user', async () => {
        const user = await store.show('1')
        expect(user.firstname).toBe('Test')
        expect(user.lastname).toBe('User1')
    })

    it('delete method should remove the user', async () => {
        const user = await store.delete('1')
        expect(user.firstname).toBe('Test')
        expect(user.lastname).toBe('User1')
        expect((await store.index()).length).toBe(3)
    })
    it('update method should update the user', async () => {
        const user = await store.update({
            id: 2,
            firstname: 'TestUpdated',
            lastname: 'User2Updated',
            password: 'password2Updated'
        })
        expect(user.firstname).toBe('TestUpdated')
        expect(user.lastname).toBe('User2Updated')
        expect(bcrypt.compareSync('password2Updated' + pepper, user.password)).toBe(true)
        expect(user.id).toBe(2)
        expect((await store.index()).length).toBe(3)
    })
})