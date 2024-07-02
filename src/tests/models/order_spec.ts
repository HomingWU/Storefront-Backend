import {Order, OrderStore} from '../../models/order'
import { ProductStore } from '../../models/product'
import { UserStore } from '../../models/user'
import Client  from '../../database'
import e from 'express'

const store = new OrderStore()
const productStore = new ProductStore()
const userStore = new UserStore()

describe('Order Model', () => {
    beforeAll(async() => {
        await userStore.create({
            id: 1,
            firstname: 'user1f',
            lastname: 'user1l',
            password: 'password1'
        })
        await userStore.create({
            id: 1,
            firstname: 'user2f',
            lastname: 'user2l',
            password: 'password2'
        })
        await productStore.create({
            id: 1,
            name: 'product1',
            price: 100,
            category: 'category1'
        })
        await productStore.create({
            id: 2,
            name: 'product2',
            price: 200,
            category: 'category2'
        })
        await store.create({
            id: 1,
            user_id: 1,
            status: 'active'
        })
        
        await store.create({
            id: 1,
            user_id: 2,
            status: 'active'
        })

        await store.create({
            id: 1,
            user_id: 1,
            status: 'complete'
        })

        await store.create({
            id: 1,
            user_id: 1,
            status: 'complete'
        })

        await store.create({
            id: 1,
            user_id: 2,
            status: 'complete'
        })
    })

    afterAll(async() => {
        const conn = await Client.connect()
        await conn.query('TRUNCATE ONLY orders, products, users RESTART IDENTITY CASCADE;')
        conn.release
    })

    it('should have an index method', () => {
        expect(store.index).toBeDefined()
    })

    it('should have a show method', () => {
        expect(store.show).toBeDefined()
    })

    it('should have a currentOrderByUser method', () => {
        expect(store.currentOrderByUser).toBeDefined()
    })

    it('should have a completedOrdersByUser method', () => {
        expect(store.completedOrdersByUser).toBeDefined()
    })

    it('should have a create method', () => {
        expect(store.create).toBeDefined()
    })

    it('should have a addProduct method', () => {
        expect(store.addProduct).toBeDefined()
    })

    it('should have a delete method', () => {
        expect(store.delete).toBeDefined()
    })

    it('should have an update method', () => {
        expect(store.update).toBeDefined()
    })

    it('index method should return a list of orders', async() => {
        const result = await store.index()
        expect(result.length).toEqual(5)
    })
    it('show method should return the correct order', async() => {
        const result = await store.show('1')
        expect(result.id).toEqual(1)
        expect(result.user_id).toEqual(1)
        expect(result.status).toEqual('active')
    })
    it('currentOrderByUser method should return the correct order', async() => {
        const result = await store.currentOrderByUser('1')
        expect(result.length).toEqual(1)
        expect(result[0].id).toEqual(1)
        expect(result[0].user_id).toEqual(1)
        expect(result[0].status).toEqual('active')
    })
    it('completedOrdersByUser method should return the correct order', async() => {
        const result = await store.completedOrdersByUser('1')
        expect(result.length).toEqual(2)
        expect(result[0].status).toEqual('complete')
        expect(result[1].status).toEqual('complete')
    })
    it('create method should add a new order', async() => {
        const result = await store.create({
            id: 1,
            user_id: 2,
            status: 'complete'
        })
        expect(result.id).toEqual(6)
        expect(result.user_id).toEqual(2)
        expect(result.status).toEqual('complete')
    })
    it('addProduct method should add a product to an active order', async() => {
        const result = await store.addProduct(1, '1', '1', '1')
        expect(result.id).toEqual(1)
        expect(result.order_id).toEqual(1)
    })
    it('addProduct method should not add a product to a complete order', async() => {
       try {
            await store.addProduct(1, '1', '3', '1')
            fail('Should have thrown an error')
        } catch (err) {
            expect(err).toBeDefined()
        }
    })
    it('addProduct method should not add a product to a wrong user', async() => {
        try {
            await store.addProduct(1, '2', '1', '1')
            fail('Should have thrown an error')
        } catch (err) {
            expect(err).toBeDefined()
        }
    })
    it('update method should change the order status', async() => {
        const result = await store.update({
            id: 1,
            user_id: 1,
            status: 'complete'
        })
        expect(result.id).toEqual(1)
        expect(result.user_id).toEqual(1)
        expect(result.status).toEqual('complete')
    })
    it('delete method should remove the order', async() => {
        const result = await store.delete('2')
        expect(result.id).toEqual(2)
        expect(result.user_id).toEqual(2)
        expect(result.status).toEqual('active')
    })
})