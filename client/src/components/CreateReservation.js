import DatePicker from "react-datepicker";
import { useParams, useHistory, useLocation } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "./CreateReservation.css";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const CreateReservation = () => {
  const { restaurantId } = useParams();
  const [partySize, setPartySize] = useState("");
  // set default date to be 24hrs from now
  const [startDate, setStartDate] = useState(
    new Date(Date.now() + 1000 * 60 * 60 * 24),
  );
  const [restaurantName, setRestaurantName] = useState(
    "testing-react-restaurant-name",
  );
  const history = useHistory();
  // const {
  //   state: { restaurantName },
  // } = useLocation();
  // console.log("🌸", state);
  const { getAccessTokenSilently } = useAuth0();
  const mockUserId = "mockUser123";

  // useEffect(() => {
  //   fetch(`http://localhost:5000/restaurants/${restaurantId}`)
  //     .then((res) => {
  //       res.json();
  //     })
  //     .then((data) => {
  //       setRestaurantName(data.name);
  //     });
  // });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newReservation = {
      userId: mockUserId,
      date: startDate,
      partySize,
      restaurantName,
    };
    console.log("🌸", newReservation, typeof newReservation);

    (async () => {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch("http://localhost:5000/reservations", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newReservation),
      });
      // const data = await response.json();
      console.log("🌸🌸", response);
      if (response.ok) {
        history.push("/reservations");
      }
    })();
  };

  return (
    <>
      <h1>Reserve {restaurantName}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Number of guests
          <input
            id="numGuest"
            type="number"
            value={partySize}
            onChange={(e) => setPartySize(Number(e.target.value))}
          />
        </label>
        <label>
          Date
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
            dateFormat="Pp"
          />
        </label>
        <button className="reservation-submit btn">Submit</button>
      </form>
    </>
  );
};

export default CreateReservation;
