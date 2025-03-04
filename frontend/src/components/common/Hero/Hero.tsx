import './Hero.scss';

function Hero() {
    function scrollToMenu() {
        
    }

  return (
    <div className="hero">
      <div className="container">
        <div className="hero__content">
          <div className="hero__info">
            <h2 className="hero__title">Make Your First Order and Get 15%</h2>
            <p className="hero__text">
              In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to
              demonstrate the visual form of a document or a typeface without.
            </p>
            <button className="hero__button">Order Now</button>
          </div>
          <div className="hero__image"></div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
