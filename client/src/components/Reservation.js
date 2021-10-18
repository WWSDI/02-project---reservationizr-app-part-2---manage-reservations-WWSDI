import { useParams } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import "./Reservation.css";

const Reservation = ({restaurant}) => {
  const { id } = useParams();

  

  return (
    <>
      <h1>Reserve </h1>
     
    </>
  );
};

export default Reservation;
