import DatePicker from "react-datepicker";
import { useParams, useHistory } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "./CreateReservation.css";
import { useState } from "react";

const CreateReservation = () => {
  const { restaurantId } = useParams();
  const [partySize, setPartySize] = useState(2);
  // set default date to be 24hrs from now
  const [startDate, setStartDate] = useState(
    new Date(Date.now() + 60 * 60 * 24 * 1000),
  );
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReservation = {
      // userId,
      startDate,
      partySize,
      // restaurantName,
    };
    console.log("🌸", newReservation, typeof newReservation);

    (async () => {
      const response = await fetch("http://localhost:5000/reservations", {
        header: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReservation),
      });
      const data = await response;

      if (data.ok) {
        history.push("/reservations");
      }
    })();
  };

  return (
    <>
      <h1>Reserve placerholdername</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Number of guests
          <input
            id="numGuest"
            type="number"
            value={partySize}
            onChange={(e) => setPartySize(e.target.value)}
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
