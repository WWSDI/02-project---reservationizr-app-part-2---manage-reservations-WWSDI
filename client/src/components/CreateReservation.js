import DatePicker from "react-datepicker";
import { useParams, useHistory, useLocation } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "./CreateReservation.css";
import { useState } from "react";

const CreateReservation = () => {
  const { restaurantId } = useParams();
  const [partySize, setPartySize] = useState('');
  // set default date to be 24hrs from now
  const [startDate, setStartDate] = useState(
    new Date(Date.now() + 1000 * 60 * 60 * 24),
  );
  const history = useHistory();
  const {
    state: { restaurantName },
  } = useLocation();
  // console.log("🌸", state);

  const mockUserId = "mockUser123";

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
      const response = await fetch("http://localhost:5000/reservations", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReservation),
      });
      const data = await response.json();
      console.log("🌸🌸", response, data);
      if (response.ok) {
        history.push("/reservations");
      }
    })();
  };

  return (
    <>
      <h1>Reserve {restaurantName}</h1>
      {/* <h2>DEL: {restaurantId}</h2> */}
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
