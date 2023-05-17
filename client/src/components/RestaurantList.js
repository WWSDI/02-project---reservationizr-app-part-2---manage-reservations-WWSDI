import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./RestaurantList.css";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loadingState, setLoadingState] = useState("idle");

  useEffect(() => {
    (async () => {
      console.log("😍", `${process.env.REACT_APP_API_URL}`);
      setLoadingState("pending");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/restaurants`
      );
      const data = await response.json();
      setRestaurants(data);
      setLoadingState("success");
    })();
  }, []);

  return loadingState === "pending" ? (
    <div
      className="warning"
      style={{ textAlign: "left", margin: "auto", width: "20rem" }}
    >
      <div>
        <div className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div style={{ fontSize: "large" }}>
        <p>Loading data.</p>
        <p>
          It may take <strong>up to 40 seconds</strong> due to slow response of <em>Free
          Tier Server</em>.
        </p>
      </div>
    </div>
  ) : (
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
            <Link
              className="restaurant-btn btn"
              to={{
                pathname: `/restaurants/${id}/reserve`,
                // state: { restaurantName: name },
              }}
            >
              Reserve now →
            </Link>
          </div>
        );
      })}
    </>
  );
};

export default RestaurantList;
