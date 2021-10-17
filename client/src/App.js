import "./App.css";
import { Switch, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import ProtectedRoute from "./auth/ProtectedRoute";
import Header from "./components/Header";
import Reservation from "./components/Reservation";
import ReservationList from "./components/ReservationList";
import RestaurantList from "./components/RestaurantList";
import CreateReservation from "./components/CreateReservation";

const App = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <Header />
      <div className="container">
        <Switch>
          <Route path="/restaurants/:restaurantId/reserve">
            <CreateReservation />
          </Route>
          <Route path="/reservations/:id">
            <Reservation />
          </Route>
          <Route path="/reservations">
            <ReservationList />
          </Route>
          <Route path="/">
            <RestaurantList />
          </Route>
        </Switch>
      </div>
    </>
  );
};

export default App;
