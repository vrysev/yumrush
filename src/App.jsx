import "@styles/app.scss";
import Navbar from "./components/common/Navbar.jsx";
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
