import Categories from "../../../components/Home/Categories/Categories";
import FeaturedProducts from "../../../components/home/FeaturedProducts/FeaturedProducts";
import Hero from "../../../components/Home/Hero/Hero";
import LatestProducts from "../../../components/home/LatestProducts/LatestProducts";
import Newsletter from "../../../components/home/Newsletter/Newsletter";
import ServiceFeatures from "../../../components/home/ServiceFeatures/ServiceFeatures";
import styles from "./HomePage.module.css";

const HomePage = () => {
  return (
    <main className={styles.homePage}>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <LatestProducts />
      <ServiceFeatures />
      <Newsletter />
    </main>
  );
};

export default HomePage;
