import supertest from "supertest";
import app from "../../server";
import { ProductStore } from "../../models/product";
import Client from "../../database";

const store = new ProductStore();
const request = supertest(app);

describe("Test Products Endpoints", () => {
  let token = "";
  beforeAll(async () => {
    await store.create({
      id: 1,
      name: "test product1",
      price: 1,
      category: "test category1",
    });
    await store.create({
      id: 2,
      name: "test product2",
      price: 2,
      category: "test category2",
    });
    await store.create({
      id: 3,
      name: "test product3",
      price: 3,
      category: "test category2",
    });
    const response = await request.post("/users").send({
      id: 1,
      firstname: "first",
      lastname: "last",
      password: "test password",
    });
    token = response.body.token;
  });

  afterAll(async () => {
    const conn = await Client.connect();
    await conn.query(
      "TRUNCATE ONLY products, users, orders, order_products RESTART IDENTITY CASCADE;"
    );
    conn.release;
  });

  it("GET /products", async () => {
    const response = await request.get("/products");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3);
  });

  it("GET /products/:id", async () => {
    const response = await request.get("/products/1");
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
    expect(response.body.name).toBe("test product1");
    expect(response.body.price).toBe(1);
    expect(response.body.category).toBe("test category1");
  });

  it("GET /products/category/:category", async () => {
    const response = await request.get("/products/category/test category2");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  it("POST /products with token should succeed", async () => {
    const response = await request
      .post("/products")
      .send({
        name: "test product4",
        price: 4,
        category: "test category3",
      })
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(4);
    expect(response.body.name).toBe("test product4");
    expect(response.body.price).toBe(4);
    expect(response.body.category).toBe("test category3");
  });

  it("POST /products without token should return 401", async () => {
    const response = await request.post("/products").send({
      name: "test product5",
      price: 5,
      category: "test category4",
    });
    expect(response.status).toBe(401);
  });

  it("DELETE /products/:id with token should succeed", async () => {
    const response = await request
      .delete("/products/4")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(4);
    expect(response.body.name).toBe("test product4");
    expect(response.body.price).toBe(4);
    expect(response.body.category).toBe("test category3");
  });

  it("DELETE /products/:id without token should return 401", async () => {
    const response = await request.delete("/products/3");
    expect(response.status).toBe(401);
  });

  it("PUT /products/:id with token should succeed", async () => {
    const response = await request
      .put("/products/3")
      .send({
        name: "test product3 updated",
        price: 33,
        category: "test category  updated",
      })
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("test product3 updated");
    expect(response.body.price).toBe(33);
    expect(response.body.category).toBe("test category  updated");
  });

  it("PUT /products/:id without token should return 401", async () => {
    const response = await request.put("/products/3").send({
      name: "test product3 updated",
      price: 33,
      category: "test category  updated",
    });
    expect(response.status).toBe(401);
  });
});
