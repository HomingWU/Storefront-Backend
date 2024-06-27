import {Order, OrderStore} from '../../models/order'

const store = new OrderStore()

describe('Order Model', () => {
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
})