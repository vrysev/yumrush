import '@styles/main.scss';
import Navbar from '@components/common/Navbar/Navbar.tsx';
import { Outlet } from 'react-router-dom';
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
