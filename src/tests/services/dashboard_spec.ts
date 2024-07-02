import { DashboardQueries } from "../../services/dashboard";
import { Product, ProductStore } from "../../models/product";
import { UserStore } from '../../models/user';
import { OrderStore } from '../../models/order';
import Client from "../../database";

describe("Dashboard Service", () => {
    const productStore = new ProductStore();
    const userStore = new UserStore();
    const dashboardQueries = new DashboardQueries();
    const orderStore = new OrderStore();

    beforeAll(async () => {
        await userStore.create({
            id: 1,
            firstname: "user1f",
            lastname: "user1l",
            password: "password1",
        });
        await userStore.create({
            id: 2,
            firstname: "user2f",
            lastname: "user2l",
            password: "password2",
        });
        await userStore.create({
            id: 3,
            firstname: "user3f",
            lastname: "user3l",
            password: "password3",
        });
        await productStore.create({
            id: 1,
            name: "product1",
            price: 100,
            category: "category1",
        });
        await productStore.create({
            id: 2,
            name: "product2",
            price: 200,
            category: "category2",
        });
        await productStore.create({
            id: 3,
            name: "product3",
            price: 300,
            category: "category3",
        });
        await productStore.create({
            id: 4,
            name: "product4",
            price: 400,
            category: "category4",
        });
        await productStore.create({
            id: 5,
            name: "product5",
            price: 500,
            category: "category5",
        });
        await productStore.create({
            id: 6,
            name: "product6",
            price: 600,
            category: "category6",
        });
        await orderStore.create({
            id: 1,
            user_id: 1,
            status: "active",
        });
        await orderStore.create({
            id: 2,
            user_id: 2,
            status: "active",
        });
        await orderStore.create({
            id: 3,
            user_id: 3,
            status: "active",
        });
    });

    afterAll(async() => {
        const conn = await Client.connect()
        await conn.query('TRUNCATE ONLY orders, products, users RESTART IDENTITY CASCADE;')
        conn.release
    });

    it ("should return nothing if there are no orders", async () => {
        const result = await dashboardQueries.top5Products();
        expect(result).toEqual([]);
    });
    it ("should return the top products if less than 5 orders", async () => {
        await orderStore.addProduct(1, '1', '1', '1');
        await orderStore.addProduct(2, '2', '2', '1');
        await orderStore.addProduct(3, '3', '3', '2');
        const result = await dashboardQueries.top5Products();
        expect(result.length).toEqual(2);
        expect(result[0].name).toEqual("product1");
        expect(result[1].name).toEqual("product2");
    });

    it ("should return the top 5 products if there are more than 5 orders", async () => {
        await orderStore.addProduct(1, '1', '1', '3');
        await orderStore.addProduct(2, '2', '2', '3');
        await orderStore.addProduct(3, '3', '3', '4');
        await orderStore.addProduct(4, '1', '1', '5');
        await orderStore.addProduct(4, '1', '1', '5');
        await orderStore.addProduct(5, '2', '2', '6');
        await orderStore.addProduct(5, '2', '2', '6');
        await orderStore.addProduct(6, '3', '3', '2');
        const result = await dashboardQueries.top5Products();
        expect(result.length).toEqual(5);
        const ids = result.map(item => item.name);
        expect(ids).toContain("product1");
        expect(ids).toContain("product2");
        expect(ids).toContain("product3");
        expect(ids).toContain("product6");
        expect(ids).toContain("product5");
        expect(ids).not.toContain("product4");
    });
});