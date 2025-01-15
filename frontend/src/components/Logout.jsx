import "../App.css";
import MyButton from "./FormElements/MyButton";
import { SmmApi } from "../SmmApi.jsx";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () =>{
        SmmApi.logout();
        sessionStorage.clear();
        navigate("");
    };

  return (
    <MyButton label={"logout"} onClick={handleLogout} variant="text" 
    />
  );
};

export default Logout;