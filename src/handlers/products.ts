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

const showByCategory = async (req: Request, res: Response) => {
    const product = await store.showByCategory(req.params.category)
    res.json(product)
}

const create = async (req: Request, res: Response) => {
    const product: Product = {
        id: 0,
        name: req.body.name,
        price: req.body.price,
        category: req.body.category
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

const update = async (req: Request, res: Response) => {
    const product: Product = {
        id: parseInt(req.params.id),
        name: req.body.name,
        price: req.body.price,
        category: req.body.category
    }

    try {
        const updated = await store.update(product)
        res.json(updated)
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

const product_routes = (app: express.Application) => {
    app.get('/products', index)
    app.get('/products/:id', show)
    app.get('/products/category/:category', showByCategory)
    app.post('/products', create)
    app.delete('/products/:id', destroy)
    app.put('/products/:id', update)
}

export default product_routes