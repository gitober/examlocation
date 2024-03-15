const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/userModel");
const Location = require("../models/locationModel");

// Sample test locations
const locations = [
  {
    name: "Central Park",
    address: "New York, NY",
    latitude: 40.785091,
    longitude: -73.968285
  },
  {
    name: "Times Square",
    address: "New York, NY",
    latitude: 40.7580,
    longitude: -73.9855
  }
];

let token = null;

beforeAll(async () => {
  // Clear user collection and register a user to obtain token
  await User.deleteMany({});
  const result = await api
    .post("/api/users/signup")
    .send({ email: "mattiv@matti.fi", password: "R3g5T7#gh" });
  token = result.body.token;
});

describe("Location Routes", () => {
  beforeEach(async () => {
    // Clear location collection and add test locations
    await Location.deleteMany({});
    await Promise.all(locations.map(location =>
      api
        .post("/api/location")
        .set("Authorization", "bearer " + token)
        .send(location)
    ));
  });

  it("should return all locations as JSON when GET /api/location is called", async () => {
    await api
      .get("/api/location")
      .set("Authorization", "bearer " + token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should create one location when POST /api/location is called", async () => {
    const newLocation = {
      name: "Test Location",
      address: "Test Address",
      latitude: 1.2345,
      longitude: -5.6789
    };
    await api
      .post("/api/location")
      .set("Authorization", "bearer " + token)
      .send(newLocation)
      .expect(201);
  });
  
  it("should return one location by ID when GET /api/location/:id is called", async () =>  {
    const location = await Location.findOne();
    await api
      .get("/api/location/" + location._id)
      .set("Authorization", "bearer " + token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should update one location by ID when PUT /api/location/:id is called", async () => {
    const location = await Location.findOne();
    const updatedLocation = {
      name: "Updated Location",
      address: "Updated Address",
      latitude: 10.1234,
      longitude: -50.5678
    };
    await api
      .put("/api/location/" + location._id)
      .set("Authorization", "bearer " + token)
      .send(updatedLocation)
      .expect(200);
    const updatedLocationCheck = await Location.findById(location._id);
    expect(updatedLocationCheck.toJSON()).toEqual(expect.objectContaining(updatedLocation));
  });

  it("should delete one location by ID when DELETE /api/location/:id is called", async () => {
    const location = await Location.findOne();
    await api
      .delete("/api/location/" + location._id)
      .set("Authorization", "bearer " + token)
      .expect(200);
    const locationCheck = await Location.findById(location._id);
    expect(locationCheck).toBeNull();
  });
});

afterAll(async () => {
  // Close database connection after all tests are done
  await mongoose.connection.close();
});
