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
          <div key={id} className="restaurant-card">
            <img className="restaurant-img" src={imgURL} alt="restaurant"></img>
            <div className="restaurant-text">
              <h2 className="restaurant-name">{name}</h2>
              <p className="restaurant-description">{description}</p>

            </div>

            <div className="restaurant-btn btn">Reserve now →</div>
          </div>
        );
      })}
    </>
  );
};

export default RestaurantList;
