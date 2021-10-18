const request = require("supertest");
const app = require("./app");

describe("app", () => {
  describe("get all restaurant route", () => {
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

  describe("create a new reservation route", ()=>{
    const newReservation={
      partySize: 3,
      date: new Date(),
      restaurantId: ''
    }

    test('request body should contain partySize', async()=>{
      await request(app).post("/reservations")
      .send()
    })
  })
});
