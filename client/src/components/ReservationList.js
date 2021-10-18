import "./ReservationList.css";
import { formatDate } from "../utils/formatDate";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    (async () => {
      const accessToken = await getAccessTokenSilently();
      // console.log("ACCESSTOKEN", accessToken);
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
      {reservations.map(({ restaurantName, date }) => {
        return (
          <div>
            <h2>{restaurantName}</h2>
            <p>{formatDate(date)}</p>
          </div>
        );
      })}
    </>
  );
};

export default ReservationList;
