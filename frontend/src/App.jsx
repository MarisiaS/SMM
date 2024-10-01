import "./App.css";
import Login from "./components/Login";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import PrivateRoutes from "./utils/privateRoutes";
import SwimMeetDisplay from "./SwimMeet/SwimMeetDisplay";
import AddSwimMeet from "./SwimMeet/AddSwimMeet";
import MeetEventDisplay from "./Event/MeetEventDisplay";
import AddEvent from "./Event/AddEvent";
import TestTabPanel from "./Tests/TestTabPanel";
import TestItemPaginationBar from "./Tests/TestItemPaginationBar";
import TestExpandableTable from "./Tests/TestExpandableTable";
import TestConditionalRender from "./Tests/TestConditionalRender";
import TestSelectTable from "./Tests/TestSelectTable";

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
          <Route path="/add-swim-meet" element={<AddSwimMeet />} />
          <Route
            path="/swim-meet/:meetId/events"
            element={<MeetEventDisplay />}
          />
          <Route path="/add-event/:meetId" element={<AddEvent />} />
        </Route>
      </Route>
      // Routes for testing component behavior during development
      <Route path="/tests/test-tab-panel" element={<TestTabPanel />} />
      <Route path="/tests/test-item-pagination-bar" element={<TestItemPaginationBar />} />
      <Route path="/tests/test-expandable-table" element={<TestExpandableTable />} />
      <Route path="/tests/test-select-table" element={<TestSelectTable />} />
      <Route path="/tests/test-conditional-render" element={<TestConditionalRender />} />
    </Routes>
  );
}

export default App;
