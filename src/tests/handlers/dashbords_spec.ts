import supertest from "supertest";
import app from "../../server";
import { ProductStore } from "../../models/product";
import { UserStore } from '../../models/user';
import { OrderStore } from '../../models/order';
import Client from "../../database";

const request = supertest(app);

describe("Test Dashboards Endpoints", () => {
    beforeAll(async () => {
        const productStore = new ProductStore();
        const userStore = new UserStore();
        const orderStore = new OrderStore();
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
        await orderStore.addProduct(1, '1', '1', '3');
        await orderStore.addProduct(2, '2', '2', '3');
        await orderStore.addProduct(3, '3', '3', '4');
        await orderStore.addProduct(4, '1', '1', '5');
        await orderStore.addProduct(4, '1', '1', '5');
        await orderStore.addProduct(5, '2', '2', '6');
        await orderStore.addProduct(5, '2', '2', '6');
        await orderStore.addProduct(6, '3', '3', '2');
      });

      afterAll(async () => {
        const conn = await Client.connect();
        await conn.query(
          "TRUNCATE ONLY products, users, orders, order_products RESTART IDENTITY CASCADE;"
        );
        conn.release;
      });

      it("GET /dashboard/top5products", async () => {
        const response = await request.get("/dashboard/top5products");
        expect(response.status).toBe(200);
        expect(response.body.length).toEqual(5);
      });

});