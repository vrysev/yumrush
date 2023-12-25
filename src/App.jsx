import "./scss/app.scss";
import Navbar from "./components/Navbar/Navbar.jsx";
import { Outlet } from "react-router-dom";
function App() {
  return (
    <>
      <Navbar />
      <div className="wrapper">
        <Outlet />
      </div>
    </>
  );
}

export default App;
