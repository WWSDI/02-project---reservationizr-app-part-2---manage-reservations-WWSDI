import { useEffect, useState } from "react";
import "./RestaurantList.css";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await fetch("http://localhost:5000/restaurants");
      const data = await response.json();
      setRestaurants(data);
    })();
  }, []);

  return (
    <>
      <h1>Restaurants</h1>
      {restaurants.map(({ id, image: imgURL, name, description }) => {
        return (
          <div key={id}>
            <img src={imgURL} alt="restaurant"></img>
            <h2>{name}</h2>
            <div>{description}</div>
          </div>
        );
      })}
    </>
  );
};

export default RestaurantList;
