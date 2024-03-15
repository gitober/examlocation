
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/userModel");
const Location = require("../models/locationModel");
const locations = [
  {
    "name": "Central Park",
    "address": "New York, NY",
    "latitude": 40.785091,
    "longitude": -73.968285
  },
  {
    "name": "Central Park",
    "address": "New York, NY",
    "latitude": 40.785091,
    "longitude": -73.968285
  }
];

let token = null;

beforeAll(async () => {
  await User.deleteMany({});
  const result = await api
    .post("/api/users/signup")
    .send({ email: "mattiv@matti.fi", password: "R3g5T7#gh" });
  token = result.body.token;
});

describe("Given there are initially some locations saved", () => {
  beforeEach(async () => {
    await Location.deleteMany({});
    await api
      .post("/api/locations")
      .set("Authorization", "bearer " + token)
      .send(locations[0])
      .send(locations[1]);
  });

  it("should return all locations as JSON when GET /api/locations is called", async () => {
    await api
      .get("/api/locations")
      .set("Authorization", "bearer " + token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should create one location when POST /api/locations is called", async () => {
    const newLocation = {
      name: "testname",
      address: "testaddress",
      laditude: "testladitude",
      longitude: "testlongitude",
    };
    await api
      .post("/api/locations")
      .set("Authorization", "bearer " + token)
      .send(newLocation)
      .expect(201);
  });
  
  it("should return one location by ID when GET /api/locations/:id is called", async () =>  {
    const location = await Location.findOne();
    await api
      .get("/api/locations/" + location._id)
      .set("Authorization", "bearer " + token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should update one location by ID when PUT /api/locations/:id is called", async () => {
    const location = await Location.findOne();
    const updatedLocation = {
      name: "testname",
      address: "testaddress",
      laditude: "testladitude",
      longitude: "testlongitude",
    };
    await api
      .put("/api/locations/" + location._id)
      .set("Authorization", "bearer " + token)
      .send(updatedLocation)
      .expect(200);
    const updatedLocationCheck = await Location.findById(location._id);
    expect(updatedLocationCheck.toJSON()).toEqual(expect.objectContaining(updatedLocation));
  });

  it("should delete one location by ID when DELETE /api/locations/:id is called", async () => {
    const location = await Location.findOne();
    await api
      .delete("/api/locations/" + location._id)
      .set("Authorization", "bearer " + token)
      .expect(200);
    const locationCheck = await Location.findById(location._id);
    expect(locationCheck).toBeNull();
  });
 
});

afterAll(() => {
  mongoose.connection.close();
});
