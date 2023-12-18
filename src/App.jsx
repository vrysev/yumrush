import "./scss/app.scss";
import Header from "./components/Header/Header.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Hero from "./components/Hero/Hero.jsx";
import Categories from "./components/Categories/Categories.jsx";
function App() {
  return (
    <>
      <Navbar />
      <div className="wrapper">
        <Header />
        <Hero />
        <Categories />
      </div>
    </>
  );
}

export default App;
