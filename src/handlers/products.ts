import express, { Request, Response } from 'express'
import { Product, ProductStore } from '../models/product'

const store = new ProductStore()

const index = async (_req: Request, res: Response) => {
    const products = await store.index()
    res.json(products)
}

const show = async (req: Request, res: Response) => {
    const product = await store.show(req.params.id)
    res.json(product)
}

const showByCatagory = async (req: Request, res: Response) => {
    const product = await store.showByCatagory(req.params.catagory)
    res.json(product)
}

const create = async (req: Request, res: Response) => {
    const product: Product = {
        id: 0,
        name: req.body.name,
        price: req.body.price,
        catagory: req.body.catagory
    }

    try {
        const newProduct = await store.create(product)
        res.json(newProduct)
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

const destroy = async (req: Request, res: Response) => {
    const deleted = await store.delete(req.params.id)
    res.json(deleted)
}

const product_routes = (app: express.Application) => {
    app.get('/products', index)
    app.get('/products/:id', show)
    app.get('/products/catagory/:catagory', showByCatagory)
    app.post('/products', create)
    app.delete('/products/:id', destroy)
}

export default product_routes