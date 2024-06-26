import "./App.css";
import Login from "./components/Login";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import PrivateRoutes from "./utils/privateRoutes";
import SwimMeetDisplay from "./SwimMeet/SwimMeetDisplay";

function App() {
  const NotFound = () => {
    return <h1>The requested URL was not found</h1>;
  };

  const H1 = () => {
    return <h1>Hello from home</h1>;
  };

  const menuOptions = [
    { id: 1, path: "/swim-meet", label: "Swim Meet", icon: "" },
  ];

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="*" element={<NotFound />} />
      <Route element={<PrivateRoutes />}>
        <Route element={<NavBar menuOptions={menuOptions} />}>
          <Route path="/swim-meet" element={<SwimMeetDisplay />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
