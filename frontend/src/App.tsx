import '@styles/main.scss';
import Navbar from '@components/common/Navbar/Navbar';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="wrapper">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
