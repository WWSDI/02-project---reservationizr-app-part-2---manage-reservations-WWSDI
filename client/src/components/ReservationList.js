import "./ReservationList.css";
import { formatDate } from "../utils/formatDate";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    (async () => {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch("http://localhost:5000/reservations", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setReservations(data);
    })();
  }, [getAccessTokenSilently]);

  return (
    <>
      <h1>Upcoming reservations</h1>
      {reservations.map((reservation) => {
        return (
          <div key={reservation.id}>
            <h2>{reservation.restaurantName}</h2>
            <p>{formatDate(reservation.date)}</p>
            <Link to={`/reservations/${reservation.id}`}>View details →</Link>
          </div>
        );
      })}
    </>
  );
};

export default ReservationList;
