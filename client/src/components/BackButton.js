import { Link } from "react-router-dom";

const BackButton = () => {
  return (
    <Link to="/reservations" className="btn">
      &larr; Back to reservations
    </Link>
  );
};

export default BackButton;
