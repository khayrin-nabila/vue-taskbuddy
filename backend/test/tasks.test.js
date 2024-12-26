process.env.NODE_ENV = "test";

import chaiHttp from "chai-http";
import { initializeServer } from '../src/server-initialize.js';
import * as chai from "chai";
const should = chai.should();
const expect = chai.expect;
const use = chai.use;

const request = use(chaiHttp).request.execute;
describe('/First Test Collection', () => {
    let app;

    before(async () => {
        app = await initializeServer();
    });

    // Test task route with cookie-based authentication
    it('should return 200 with valid authentication', (done) => {
        request(app)
            .post('/api/login')
            .send({ email: "test@gmail.com", password: "test123" })
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});