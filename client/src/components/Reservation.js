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
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`http://localhost:5000/reservations/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setReservation(data);
      } else if (response.status === 404) {
        console.log("NOT FOUND 404");
        setNotFound(true);
      }
    })();
  }, [id, getAccessTokenSilently]);

  if (notFound) {
    return (
      <>
        <p style={{ color: "red", fontWeight: "bold" }}>
          Sorry! We can't find that reservation
        </p>
        <Link
          className="reservation-back-btn btn"
          style={{ color: "black" }}
          to="/reservations"
        >
          ← Back to reservations
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="reservation-title">{restaurantName}</h1>
      <p>{date ? formatDate(date) : date}</p>
      <p>
        <strong>Party size: </strong>
        {partySize}
      </p>

      <hr />

      <Link
        className="reservation-back-btn btn"
        style={{ color: "black" }}
        to="/reservations"
      >
        ← Back to reservations
      </Link>
    </>
  );
};

export default Reservation;
