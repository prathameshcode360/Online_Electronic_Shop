import styles from "./FeaturedProducts.module.css";
import ProductCard from "../../ui/ProductCard/ProductCard";

// Dummy Images
import laptopImage from "../../../assets/images/products/laptop.jpg";
import mobileImage from "../../../assets/images/products/mobile.jpg";
import headphoneImage from "../../../assets/images/products/headphone.jpg";
import smartwatchImage from "../../../assets/images/products/smartwatch.jpg";

const FeaturedProducts = () => {
  // Temporary static data
  const featuredProducts = [
    {
      _id: 1,
      name: "Gaming Laptop",
      image: laptopImage,
      price: 89999,
      discountPrice: 79999,
      rating: 4.8,
    },
    {
      _id: 2,
      name: "Flagship Smartphone",
      image: mobileImage,
      price: 69999,
      discountPrice: 64999,
      rating: 4.7,
    },
    {
      _id: 3,
      name: "Wireless Headphones",
      image: headphoneImage,
      price: 14999,
      discountPrice: 11999,
      rating: 4.6,
    },
    {
      _id: 4,
      name: "Smart Watch",
      image: smartwatchImage,
      price: 19999,
      discountPrice: 16999,
      rating: 4.5,
    },
  ];

  return (
    <section className={styles.featuredProducts}>
      <div className={styles.sectionHeader}>
        <h2>Featured Products</h2>
        <p>Discover our handpicked collection of top-selling products.</p>
      </div>

      <div className={styles.productsGrid}>
        {featuredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
