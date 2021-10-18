const request = require("supertest");
const app = require("./app");

describe("app", () => {
  // ✅ 1 status code: 200
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

  // ✅ 3 status code: 200, 400, 404
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
          expect(res.body).toEqual({ message: "id is invalid" });
        });
    });
    test("return 404 error code when given a valid but non-existent id", async () => {
      const nonexistentValidId = "616005e26d59890f8f100000";
      await request(app)
        .get(`/restaurants/${nonexistentValidId}`)
        .expect(404)
        .expect((res) => {
          expect(res.body).toEqual({ message: "id does not exist" });
        });
    });
  });

  // 2 status code: 200, 401
  describe.only("get all reservations route", () => {
    test("should return all reservations", async () => {
      const allReservations = [
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
        {
          date: "2023-12-03T07:00:00.000Z",
          id: "61679189b54f48aa6599a7fd",
          partySize: 2,
          restaurantName: "Green Curry",
          userId: "another-user-id",
        },
      ];

      await request(app)
        .get("/reservations")
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject(allReservations);
        });
    });
    test("should return 404 error code when user is unauthorized", async () => {
      await request(app)
        .get("/reservations")
        .set("Authorization", "fake-access-token")
        .expect(401)
        .expect((res) => {
          expect(res.text).toBe(
            "UnauthorizedError: No authorization token was found",
          );
        });
    });
  });

  // 5 status code: 200, 400, 401, 403, 404
  describe("get a single reservation route", () => {});

  // 3 status code: 201, 400, 401
  describe.skip("create a new reservation route", () => {
    const newReservation = {
      partySize: 3,
      date: new Date(),
      restaurantId: "",
    };

    test("request body should contain partySize", async () => {
      await request(app).post("/reservations").send();
    });
  });
});
