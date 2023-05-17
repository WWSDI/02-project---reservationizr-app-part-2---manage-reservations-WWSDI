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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/reservations`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setReservations(data);
    })();
  }, [getAccessTokenSilently]);

  if (reservations.length === 0) {
    return (
      <>
        <h1>Upcoming reservations</h1>
        <p>You don't have any reservations.</p>
        <Link className="reservation-link" to="/">
          View the restaurants
        </Link>
      </>
    );
  }

  return (
    <>
      <h1>Upcoming reservations</h1>
      <div className="reservationList-container">
        {reservations.map((reservation) => {
          return (
            <div className="reservation-container" key={reservation.id}>
              <h2 className="reservation-name">{reservation.restaurantName}</h2>
              <p className="reservation-date">{formatDate(reservation.date)}</p>
              <Link
                className="reservation-link"
                to={`/reservations/${reservation.id}`}
              >
                View details →
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ReservationList;
