import "./scss/app.scss";
import Header from "./components/Header/Header.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
function App() {
  return (
    <>
      <Navbar />
      <div className="wrapper">
        <Header />
        <div className="hero">
          <div className="container">
            <div className="hero__section">
              <div className="hero__section--title">
                Make Your First Order and Get
              </div>
              <div className="hero__section--text">
                In publishing and graphic design, Lorem ipsum is a placeholder
                text commonly used to demonstrate the visual form of a document
                or a typeface without.
              </div>
              <div className="hero__section--button">Order Now</div>
              <div className="hero__section--img">
                <img src="" alt="" className={"hero__section--img"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
