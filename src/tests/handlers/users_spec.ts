import supertest from "supertest";
import app from "../../server";

const request = supertest(app);

describe("Test GET /users", () => {
  it("should return 200 OK", async () => {
    const response = await request.get("/orders");
    expect(response.status).toBe(200);
  });
});