const request = require("supertest");
const app = require("./app");

describe("app", () => {
  describe("get all restaurants route", () => {
    test("should return a list of all restaurants", async () => {
      const allRestaurants = [
        {
          name: "Curry Place",
          description:
            "Bringing you the spirits of India in the form of best authentic grandma's recipe dishes handcrafted with love by our chefs!",
          image: "https://i.ibb.co/yftcRcF/indian.jpg",
          id: "616005cae3c8e880c13dc0b9",
        },
        {
          name: "Thai Isaan",
          description:
            "We offer guests a modern dining experience featuring the authentic taste of Thailand. Food is prepared fresh from quality ingredients and presented with sophisticated elegance in a stunning dining setting filled with all the richness of Thai colour, sound and art.",
          image: "https://i.ibb.co/HPjd2jR/thai.jpg",
          id: "616005e26d59890f8f1e619b",
        },
        {
          name: "Italian Feast",
          description:
            "From the Italian classics, to our one-of-a-kind delicious Italian favourites, all of our offerings are handcrafted from the finest, freshest ingredients available locally. Whether you're craving Italian comfort food like our Ravioli, Pappardelle or something with a little more Flavour like our famous Fettuccine Carbonara.",
          image: "https://i.ibb.co/0r7ywJg/italian.jpg",
          id: "616bd284bae351bc447ace5b",
        },
      ];

      await request(app)
        .get("/restaurants")
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(allRestaurants);
        });
    });
  });

  describe("get a single restaurant route", () => {
    // Happy path
    test("should return a single restaurant", async () => {
      const thaiIsaan = {
        name: "Thai Isaan",
        description:
          "We offer guests a modern dining experience featuring the authentic taste of Thailand. Food is prepared fresh from quality ingredients and presented with sophisticated elegance in a stunning dining setting filled with all the richness of Thai colour, sound and art.",
        image: "https://i.ibb.co/HPjd2jR/thai.jpg",
        id: "616005e26d59890f8f1e619b",
      };

      await request(app)
        .get(`/restaurants/${thaiIsaan.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(thaiIsaan);
        });
    });
    test("return 400 error code when given an invalid id", async () => {
      await request(app)
        .get("/restaurants/bad-id")
        .expect(400)
        .expect((res) => {
          expect(res.body).toEqual({ error: "invalid id provided" });
        });
    });
    test("return 404 error code when given a valid but non-existent id", async () => {
      const nonexistentValidId = "616005e26d59890f8f100000";
      await request(app)
        .get(`/restaurants/${nonexistentValidId}`)
        .expect(404)
        .expect((res) => {
          expect(res.body).toEqual({ error: "restaurant not found" });
        });
    });
  });

  describe("get all reservations route", () => {
    test("should return all reservations made by one user", async () => {
      const allMyReservations = [
        {
          date: "2023-11-17T06:30:00.000Z",
          id: "507f1f77bcf86cd799439011",
          partySize: 4,
          restaurantName: "Island Grill",
          userId: "mock-user-id",
        },
        {
          date: "2023-12-03T07:00:00.000Z",
          id: "614abf0a93e8e80ace792ac6",
          partySize: 2,
          restaurantName: "Green Curry",
          userId: "mock-user-id",
        },
      ];

      await request(app)
        .get("/reservations")
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject(allMyReservations);
        });
    });
    // ❌❌ not sure if it's even possible to write negative test for this route
    // test("should return 404 error code when user is unauthorized", async () => {
    //   await request(app)
    //     .get("/reservations")
    //     .set("Authorization", "fake-access-token")
    //     .expect(401)
    //     .expect((res) => {
    //       expect(res.text).toBe(
    //         "UnauthorizedError: No authorization token was found",
    //       );
    //     });
    // });
  });

  describe("get a single reservation route", () => {
    test("should return a single reservation", async () => {
      const reservation = {
        date: "2023-11-17T06:30:00.000Z",
        id: "507f1f77bcf86cd799439011",
        partySize: 4,
        restaurantName: "Island Grill",
        userId: "mock-user-id",
      };

      await request(app)
        .get("/reservations/507f1f77bcf86cd799439011")
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(reservation);
        });
    });
    test("should return 400 error code when invalid id is provided", async () => {
      await request(app)
        .get("/reservations/bad-id")
        .expect(400)
        .expect((res) => {
          expect(res.body).toEqual({ error: "invalid id provided" });
        });
    });
    test("should return 403 error when querying reservation created by another user", async () => {
      const reservationIdByAnotherUser = "61679189b54f48aa6599a7fd";

      const errorResponse = {
        error: "user does not have permission to access this reservation",
      };

      await request(app)
        .get("/reservations/" + reservationIdByAnotherUser)
        .expect(403)
        .expect((res) => {
          expect(res.body).toEqual(errorResponse);
        });
    });
    test("should return 404 when id cannot be found", async () => {
      const notFoundId = "616cd6f5ba429b5b92d1e613";

      await request(app)
        .get(`/reservations/${notFoundId}`)
        .expect(404)
        .expect((res) => {
          expect(res.body).toEqual({
            error: "not found",
          });
        });
    });
  });

  describe("create a new reservation route", () => {
    test("should create a new reservation", async () => {
      const newReservation = {
        partySize: 3,
        date: "2021-11-20T16:41:49.087Z",
        restaurantName: "Green Curry",
      };

      const expectedReservation = {
        partySize: 3,
        date: "2021-11-20T16:41:49.087Z",
        restaurantName: "Green Curry",
        userId: "mock-user-id",
      };

      await request(app)
        .post("/reservations")
        .send(newReservation)
        .expect(201)
        .expect((res) => {
          expect(res.body).toMatchObject(expectedReservation);
        });
    });

    test("should return 400 error when partySize is missing", async () => {
      const noPartySize = {
        date: new Date(Date.now() + 1000 * 60 * 60 * 48),
        restaurantName: "Green Curry",
      };
      const expectedError = {
        error: "Bad Request",
        message: "Validation failed",
        statusCode: 400,
        validation: {
          body: {
            keys: ["partySize"],
            message: '"partySize" is required',
            source: "body",
          },
        },
      };
      await request(app)
        .post("/reservations")
        .send(noPartySize)
        .expect(400)
        .expect((res) => {
          expect(res.body).toEqual(expectedError);
        });
    });
    test("should return 400 error when partySize exceeds 30", async () => {
      const badRequestBody = {
        partySize: 31,
        date: new Date(Date.now() + 1000 * 60 * 60 * 48),
        restaurantName: "Green Curry",
      };
      const expectedError = {
        error: "Bad Request",
        message: "Validation failed",
        statusCode: 400,
        validation: {
          body: {
            keys: ["partySize"],
            message: '"partySize" must be less than or equal to 30',
            source: "body",
          },
        },
      };
      await request(app)
        .post("/reservations")
        .send(badRequestBody)
        .expect(400)
        .expect((res) => {
          expect(res.body).toEqual(expectedError);
        });
    });
    test("should return 400 error when partySize smaller than 1", async () => {
      const badRequestBody = {
        partySize: -1,
        date: new Date(Date.now() + 1000 * 60 * 60 * 48),
        restaurantName: "Green Curry",
      };
      const expectedError = {
        error: "Bad Request",
        message: "Validation failed",
        statusCode: 400,
        validation: {
          body: {
            keys: ["partySize"],
            message: '"partySize" must be greater than or equal to 1',
            source: "body",
          },
        },
      };
      await request(app)
        .post("/reservations")
        .send(badRequestBody)
        .expect(400)
        .expect((res) => {
          expect(res.body).toEqual(expectedError);
        });
    });
    test("should return 400 error when date is less than an hour from now", async () => {
      const badRequestBody = {
        partySize: 1,
        date: "2021-10-18T17:53:50.265Z",
        restaurantName: "Green Curry",
      };
      const expectedError = {
        error: "Bad Request",
        message: "Validation failed",
        statusCode: 400,
        validation: {
          body: {
            keys: ["date"],
            source: "body",
          },
        },
      };
      await request(app)
        .post("/reservations")
        .send(badRequestBody)
        .expect(400)
        .expect((res) => {
          expect(res.body).toMatchObject(expectedError);
        });
    });
    test("should return 400 error when date is missing", async () => {
      const badRequestBody = {
        partySize: 1,
        restaurantName: "Green Curry",
      };
      const expectedError = {
        error: "Bad Request",
        message: "Validation failed",
        statusCode: 400,
        validation: {
          body: {
            keys: ["date"],
            source: "body",
          },
        },
      };
      await request(app)
        .post("/reservations")
        .send(badRequestBody)
        .expect(400)
        .expect((res) => {
          expect(res.body).toMatchObject(expectedError);
        });
    });
    test("should return 400 error when restaurantName is missing", async () => {
      const badRequestBody = {
        partySize: 1,
        date: new Date(Date.now() + 1000 * 60 * 60 * 48),
      };
      const expectedError = {
        error: "Bad Request",
        message: "Validation failed",
        statusCode: 400,
        validation: {
          body: {
            keys: ["restaurantName"],
            source: "body",
          },
        },
      };
      await request(app)
        .post("/reservations")
        .send(badRequestBody)
        .expect(400)
        .expect((res) => {
          expect(res.body).toMatchObject(expectedError);
        });
    });
    test("should return 400 error when restaurantName length is less than 2", async () => {
      const badRequestBody = {
        partySize: 1,
        date: new Date(Date.now() + 1000 * 60 * 60 * 48),
        restaurantName: "R",
      };
      const expectedError = {
        error: "Bad Request",
        message: "Validation failed",
        statusCode: 400,
        validation: {
          body: {
            keys: ["restaurantName"],
            source: "body",
          },
        },
      };
      await request(app)
        .post("/reservations")
        .send(badRequestBody)
        .expect(400)
        .expect((res) => {
          expect(res.body).toMatchObject(expectedError);
        });
    });
    test("should return 400 error when restaurantName is too long", async () => {
      const badRequestBody = {
        partySize: 1,
        date: new Date(Date.now() + 1000 * 60 * 60 * 48),
        restaurantName:
          "this is a very very very long restaurant name that is almost certainly longer than expected",
      };
      const expectedError = {
        error: "Bad Request",
        message: "Validation failed",
        statusCode: 400,
        validation: {
          body: {
            keys: ["restaurantName"],
            source: "body",
          },
        },
      };
      await request(app)
        .post("/reservations")
        .send(badRequestBody)
        .expect(400)
        .expect((res) => {
          expect(res.body).toMatchObject(expectedError);
        });
    });
  });
});
