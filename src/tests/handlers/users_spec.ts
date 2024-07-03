import supertest from "supertest";
import app from "../../server";
import Client from "../../database";

const request = supertest(app);

describe("Users Endpoints", () => {
    let token = "";
    beforeAll(async () => {
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
          "TRUNCATE ONLY users RESTART IDENTITY CASCADE;"
        );
        conn.release;
      });

    it ("POST /users should create a user", async () => {
        const response = await request.post("/users").send({
            id: 2,
            firstname: "first2",
            lastname: "last2",
            password: "test password2",
        });
        expect(response.status).toBe(200);
        expect(response.body.user.id).toBe(2);
        expect(response.body.user.firstname).toBe("first2");
        expect(response.body.user.lastname).toBe("last2");
    });

    it ("GET /users with valid token should return a list of users", async () => {
        const response = await request.get("/users").set("Authorization", `Bearer ${token}`);;
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    });

    it("GET /users without token should return 401", async () => {
        const response = await request.get("/users");
        expect(response.status).toBe(401);
    });

    it("GET /users/:id with valid token should return a user", async () => {
        const response = await request.get("/users/1").set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(1);
        expect(response.body.firstname).toBe("first");
        expect(response.body.lastname).toBe("last");
    });

    it("GET /users/:id without token should return 401", async () => {
        const response = await request.get("/users/1");
        expect(response.status).toBe(401);
    });

    it ("POST /users/authenticate should return a token if valid", async () => {
        const response = await request.post("/users/authenticate").send({
            firstname: "first",
            lastname: "last",
            password: "test password",
        });
        expect(response.status).toBe(200);
        expect(response.body.user.id).toBe(1);
        expect(response.body.user.firstname).toBe("first");
        expect(response.body.user.lastname).toBe("last");
        expect(response.body.token).toBeTruthy();
    });

    it ("POST /users/authenticate should return 401 if invalid", async () => {
        const response = await request.post("/users/authenticate").send({
            firstname: "first",
            lastname: "last",
            password: "wrong password",
        });
        expect(response.status).toBe(401);
        expect(response.body.error).toBe("unauthorized");
    });

    it ("PUT /users/:id with wrong token should return 401", async () => {
        const response = await request.put("/users/2").send({
            firstname: "first updated",
            lastname: "last updated",
            password: "test password updated",
        }).set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(401);
    });

    it("PUT /users/:id with valid token should update a user", async () => {
        const response = await request.put("/users/1").send({
            firstname: "first1",
            lastname: "last1",
            password: "test password1",
        }).set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(1);
        expect(response.body.firstname).toBe("first1");
        expect(response.body.lastname).toBe("last1");
    });

    it("DELETE /users/:id with wrong token should return 401", async () => {
        const response = await request.delete("/users/2").set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(401);
    });

    it ("DELETE /users/:id  with valid token should delete a user", async () => {
        const response = await request.delete("/users/1").set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(1);
        expect(response.body.firstname).toBe("first1");
        expect(response.body.lastname).toBe("last1");
    });
    
});