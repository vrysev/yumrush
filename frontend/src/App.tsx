import '@styles/main.scss';
import Header from '@components/common/Header/Header';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="wrapper">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
