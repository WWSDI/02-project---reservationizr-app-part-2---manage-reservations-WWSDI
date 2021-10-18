import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import "./Reservation.css";

const Reservation = () => {
  const [reservation, setReservation] = useState({});
  const { restaurantName, date, partySize } = reservation;
  const { id } = useParams();
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    (async () => {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`http://localhost:5000/reservations/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setReservation(data);
    })();
  }, [id, getAccessTokenSilently]);

  return (
    <>
      <h1>{restaurantName}</h1>
      <p>{date ? formatDate(date) : date}</p>
      <p>
        <strong>Party size: </strong>
        {partySize}
      </p>

      <hr />

      <Link to="/reservations">← Back to reservations</Link>
    </>
  );
};

export default Reservation;
