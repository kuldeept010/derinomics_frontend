
import "bootstrap/dist/css/bootstrap.min.css";
import 'antd/dist/reset.css';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Root from "./Root";
import LiveCalendar from "./app/features/live-calendar/LiveCalendar";
import AllEvents from "./app/features/all-events/AllEvents";
import Home from "./app/features/home/Home";
import EventDetails from "./app/features/live-calendar/EventDetails";
import LiveCalendarContainer from "./app/features/live-calendar/LiveCalendarContainer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [{
      index: true,
      element: <Home />
    }, {
      path: "live-calendar",
      element: <LiveCalendarContainer />,
      children: [
        {
          index: true,
          element: <LiveCalendar />
        }, {
          path: ":eventId",
          element: <EventDetails />
        }]
    },
    {
      path: "all-events",
      element: <AllEvents />
    }]
  },

]);


function App() {
  return (
    <div>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
