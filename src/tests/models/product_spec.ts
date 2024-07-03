import {ProductStore} from '../../models/product'
import Client from '../../database'

const store = new ProductStore()

describe('Product Model', () => {
    beforeAll(async() => {
        await store.create({
            id: 1,
            name: 'test product1',
            price: 1,
            category: 'test category1'
        })
        await store.create({
            id: 2,
            name: 'test product2',
            price: 2,
            category: 'test category2'
        })
        await store.create({
            id: 3,
            name: 'test product3',
            price: 3,
            category: 'test category2'
        })
    })

    afterAll(async() => {
        const conn = await Client.connect()
        await conn.query('TRUNCATE ONLY products RESTART IDENTITY CASCADE;')
        conn.release
    })

    it('should have an index method', () => {
        expect(store.index).toBeDefined()
    })

    it('should have a show method', () => {
        expect(store.show).toBeDefined()
    })

    it('should have a showByCategory method', () => {
        expect(store.showByCategory).toBeDefined()
    })

    it('should have a create method', () => {
        expect(store.create).toBeDefined()
    })

    it('should have a delete method', () => {
        expect(store.delete).toBeDefined()
    })

    it('should have an update method', () => {
        expect(store.update).toBeDefined()
    })

    it('create method should add a product', async () => {
        const result = await store.create({
            id: 1,
            name: 'test product4',
            price: 4,
            category: 'test category4'
        })

        expect(result).toEqual({
            id: 4,
            name: 'test product4',
            price: 4,
            category: 'test category4'
        })
    })
    it('index method should return a list of products', async () => {
        const result = await store.index()
        expect(result.length).toEqual(4)
    })
    it('show method should return the correct product', async () => {
        const result = await store.show('1')
        expect(result.id).toEqual(1)
    })
    it('showByCategory method should return the correct products', async () => {
        const result = await store.showByCategory('test category2')
        expect(result.length).toEqual(2)
        const result2 = await store.showByCategory('test category1')
        expect(result2.length).toEqual(1)
    })
    it('delete method should remove the product', async () => {
        const result = await store.delete('1')
        expect(result.id).toEqual(1)
        const result2 = await store.index()
        expect(result2.length).toEqual(3)
    })
    it('update method should update the product', async () => {
        const result = await store.update({
            id: 2,
            name: 'test product2',
            price: 5,
            category: 'test category2'
        })
        expect(result.price).toEqual(5)
    })
})