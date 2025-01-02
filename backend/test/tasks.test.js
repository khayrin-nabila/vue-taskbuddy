process.env.NODE_ENV = "test";

import chaiHttp from "chai-http";
import { initializeServer } from '../src/server-initialize.js';
import * as chai from "chai";
import { connectToDatabase } from '../src/database.js';
import { config } from "dotenv";
config();
const expect = chai.expect;
const use = chai.use;
const request = use(chaiHttp).request.execute;

describe("Task API Tests", () => {
    let app;
    let token;
  
    before(async () => {
      app = await initializeServer();
    });

    after(async () => {
      const db = await connectToDatabase();
      await db.collection('users').deleteOne({ email: "test@example.com" });
    });

    describe("POST /api/signup", () => {
      it("should successfully sign up a user", (done) => {
        request(app)
          .post("/api/signup")
          .send({ email: "test@example.com", password: "test123", name: "Test User" })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("name", "Test User");
            done();
          });
      });
  
      it("should fail to sign up with an existing email", (done) => {
        request(app)
          .post("/api/signup")
          .send({ email: "test@example.com", password: "test123", name: "Test User" })
          .end((err, res) => {
            expect(res).to.have.status(409);
            done();
          });
      });
    });
  
    describe("POST /api/login", () => {
      it("should successfully log in with valid credentials and retrieve userId", (done) => {
        request(app)
          .post("/api/login")
          .send({ email: "test@example.com", password: "test123" })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("token");
            token = res.body.token;
            done();
          });
      });
  
      it("should fail to log in with incorrect password", (done) => {
        request(app)
          .post("/api/login")
          .send({ email: "test@example.com", password: "wrongpassword" })
          .end((err, res) => {
            expect(res).to.have.status(401);
            done();
          });
      });
    });
  
    describe("GET /api/tasks", () => {
        it("should fetch tasks for authenticated user", async () => {
            const res = await request(app)
              .get("/api/tasks")
              .set("Cookie", `token=${token}`);
            expect(res).to.have.status(200);
          });          
  
      it("should return 401 for unauthorized access", async () => {
        const res = await request(app).get("/api/tasks");
        expect(res).to.have.status(401);
      });
    });
});