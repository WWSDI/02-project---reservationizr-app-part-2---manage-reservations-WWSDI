import DatePicker from "react-datepicker";
import { useParams, useHistory } from "react-router-dom";
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
  const [restaurantName, setRestaurantName] = useState("");
  const history = useHistory();
  const { getAccessTokenSilently } = useAuth0();
  const [invalidKeys, setInvalidKeys] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/restaurants/${restaurantId}`)
      .then((res) => res.json())
      .then((data) => {
        setRestaurantName(data.name);
      });
  }, [restaurantId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newReservation = {
      date: startDate,
      partySize,
      restaurantName,
    };

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
      if (response.ok) {
        history.push("/reservations");
      } else if (response.status === 400) {
        const data = await response.json();
        setInvalidKeys(data.validation.body.keys);
      }
    })();
  };

  return (
    <>
      {/* Display warning message for invalid input */}
      {invalidKeys.includes("partySize") && (
        <p
          style={{ color: "deepred", backgroundColor: "gold", padding: "1rem" }}
        >
          ⛔️ You have entered a wrong <strong>Number of Guests</strong>. Please
          make sure you enter an <strong>integer</strong> number between{" "}
          <strong>1 and 30</strong>.
        </p>
      )}
      {invalidKeys.includes("date") && (
        <p
          style={{ color: "deepred", backgroundColor: "gold", padding: "1rem" }}
        >
          ⛔️ You have entered a wrong <strong>Date</strong>. Please make sure
          the reservation date is at least <strong>15 mins</strong> from now.
        </p>
      )}
      
      {/* Display create reservation form */}
      <h1>Reserve {restaurantName}</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="numGuest">Number of guests</label>
        <input
          id="numGuest"
          className="input-field"
          type="number"
          value={partySize}
          onChange={(e) => {
            setInvalidKeys([]);
            setPartySize(Number(e.target.value));
          }}
        />
        <label htmlFor="id">Date</label>
        <DatePicker
          id="date"
          className="input-field"
          selected={startDate}
          onChange={(date) => {
            setInvalidKeys([]);
            setStartDate(date);
          }}
          showTimeSelect
          dateFormat="Pp"
        />
        <button className="reservation-submit btn">Submit</button>
      </form>
    </>
  );
};

export default CreateReservation;
