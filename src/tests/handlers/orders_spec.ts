import supertest from "supertest";
import app from "../../server";
import { ProductStore } from "../../models/product";
import { OrderStore } from "../../models/order";
import Client from "../../database";

const request = supertest(app);

describe("Test Orders Endpoints", () => {
  let token1 = "";
  let token2 = "";
  beforeAll(async () => {
    // Create two users
    const response1 = await request.post("/users").send({
      firstname: "first1",
      lastname: "last1",
      password: "test password1",
    });
    token1 = response1.body.token;
    const response2 = await request.post("/users").send({
      firstname: "first2",
      lastname: "last2",
      password: "test password2",
    });
    token2 = response2.body.token;

    // Create six products
    const productStore = new ProductStore();
    await productStore.create({
      id: 1,
      name: "test product1",
      price: 1,
      category: "test category1",
    });
    await productStore.create({
      id: 2,
      name: "test product2",
      price: 2,
      category: "test category2",
    });
    await productStore.create({
      id: 3,
      name: "test product3",
      price: 3,
      category: "test category2",
    });
    await productStore.create({
      id: 4,
      name: "test product4",
      price: 4,
      category: "test category3",
    });
    await productStore.create({
      id: 5,
      name: "test product5",
      price: 5,
      category: "test category3",
    });
    await productStore.create({
      id: 6,
      name: "test product6",
      price: 6,
      category: "test category3",
    });
    // Create orders for user 1
    const orderStore = new OrderStore();
    await orderStore.create(
      {
        id: 1,
        user_id: 1,
        status: "active",
      }
    );
    await orderStore.create(
      {
        id: 2,
        user_id: 1,
        status: "complete",
      }
    );
    await orderStore.create(
      {
        id: 3,
        user_id: 1,
        status: "active",
      }
    );
  });
  afterAll(async () => {
    const conn = await Client.connect();
    await conn.query(
      "TRUNCATE ONLY products, users, orders, order_products RESTART IDENTITY CASCADE;"
    );
    conn.release;
  });

  it ("GET /orders with valid token should return a list of orders", async () => {
    const response = await request.get("/orders").set("Authorization", `Bearer ${token1}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3);
  });

  it ("GET /orders with invalid token should return 401", async () => {
    const response = await request.get("/orders").set("Authorization", `Bearer invalid`);
    expect(response.status).toBe(401);
  });

  it ("GET /orders/:id with valid token should return an order", async () => {
    const response = await request.get("/orders/1").set("Authorization", `Bearer ${token2}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
    expect(response.body.user_id).toBe(1);
    expect(response.body.status).toBe("active");
  });

  it ("GET /orders/:id with invalid token should return 401", async () => {
    const response = await request.get("/orders/1").set("Authorization", `Bearer some invalid token`);
    expect(response.status).toBe(401);
  });

  it ("GET /orders/active/:user_id with valid token should return a list of active orders", async () => {
    const response = await request.get("/orders/active/1").set("Authorization", `Bearer ${token1}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  it ("GET /orders/active/:user_id with invalid token should return 401", async () => {
    const response = await request.get("/orders/active/1").set("Authorization", `Bearer ${token2}`);
    expect(response.status).toBe(401);
  });

  it ("GET /orders/complete/:user_id with valid token should return a list of complete orders", async () => {
    const response = await request.get("/orders/complete/1").set("Authorization", `Bearer ${token1}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });

  it ("GET /orders/complete/:user_id with invalid token should return 401", async () => {
    const response = await request.get("/orders/complete/1").set("Authorization", `Bearer ${token2}`);
    expect(response.status).toBe(401);
  });

  it ("POST /orders with valid token should create an order", async () => {
    const response = await request.post("/orders").send({
      user_id: 1,
      status: "active",
    }).set("Authorization", `Bearer ${token1}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(4);
    expect(response.body.user_id).toBe(1);
    expect(response.body.status).toBe("active");
  });

  it ("POST /orders with invalid token should return 401", async () => {
    const response = await request.post("/orders").send({
      user_id: 1,
      status: "active",
    }).set("Authorization", `Bearer ${token2}`);
    expect(response.status).toBe(401);
  });

  it ("DELETE /orders/:id with valid token should delete an order", async () => {
    const response = await request.delete("/orders/3").send({
      id: 3,
      user_id: 1,
      status: "active"
    }).set("Authorization", `Bearer ${token1}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(3);
    expect(response.body.user_id).toBe(1);
    expect(response.body.status).toBe("active");

    const response2 = await request.get("/orders/active/1").set("Authorization", `Bearer ${token1}`);
    expect(response2.status).toBe(200);
    expect(response2.body.length).toBe(2);

  });

  it ("DELETE /orders/:id with invalid token should return 401", async () => {
    const response = await request.delete("/orders/4").send({
      id: 4,
      user_id: 1,
      status: "active"
    }).set("Authorization", `Bearer ${token2}`);
    expect(response.status).toBe(401);
  });

  it ("POST /users/:user_id/orders/:order_id/products with valid token should add a product to an active order", async () => {
    const response = await request.post("/users/1/orders/1/products").send({
      product_id: 1,
      quantity: 1,
    }).set("Authorization", `Bearer ${token1}`);
    expect(response.status).toBe(200);
    expect(response.body.order_id).toBe(1);
    expect(response.body.product_id).toBe(1);
  });

  it ("POST /users/:user_id/orders/:order_id/products with invalid token should return 401", async () => {
    const response = await request.post("/users/1/orders/1/products").send({
      product_id: 1,
      quantity: 1,
    }).set("Authorization", `Bearer ${token2}`);
    expect(response.status).toBe(401);
  });

  it ("POST /users/:user_id/orders/:order_id/products when order doesn't belong to user will return 400", async () => {
    const response = await request.post("/users/2/orders/1/products").send({
      product_id: 1,
      quantity: 1,
    }).set("Authorization", `Bearer ${token2}`);
    expect(response.status).toBe(400);
  });

  it ("POST /users/:user_id/orders/:order_id/products when order is not active will return 400", async () => {
    const response = await request.post("/users/1/orders/2/products").send({
      product_id: 1,
      quantity: 1,
    }).set("Authorization", `Bearer ${token1}`);
    expect(response.status).toBe(400);
  });

  it("PUT /orders/:id with valid token should update an order", async () => {
    const response = await request.put("/orders/1").send({
      user_id: 1,
      status: "complete",
    }).set("Authorization", `Bearer ${token1}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
    expect(response.body.user_id).toBe(1);
    expect(response.body.status).toBe("complete");
  });

  it("PUT /orders/:id with invalid token should return 401", async () => {
    const response = await request.put("/orders/1").send({
      user_id: 1,
      status: "complete",
    }).set("Authorization", `Bearer ${token2}`);
    expect(response.status).toBe(401);
  });

});