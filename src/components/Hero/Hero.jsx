import styles from "./Hero.module.scss";
function Hero() {
  return (
    <div className="hero">
      <div className={styles.container}>
        <div className={styles.section}>
          <div className={styles.block}>
            <div className={styles.title}>
              Make Your First Order and Get 15%
            </div>
            <div className={styles.text}>
              In publishing and graphic design, Lorem ipsum is a placeholder
              text commonly used to demonstrate the visual form of a document or
              a typeface without.
            </div>
            <div className={styles.btn}>Order Now</div>
          </div>
          <div className={styles.sectionImage}></div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
