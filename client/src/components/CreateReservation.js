import DatePicker from "react-datepicker";
import { useParams, useHistory } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "./CreateReservation.css";

const CreateReservation = () => {
  const { restaurantId } = useParams();

  return (
    <>
      <h1>Reserve Restaurant</h1>
    </>
  );
};

export default CreateReservation;
