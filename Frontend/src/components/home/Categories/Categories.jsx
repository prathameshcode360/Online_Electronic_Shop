import CategoryCard from "./CategoryCard";
import styles from "./Categories.module.css";

// Dummy Images
import laptopImage from "../../../assets/images/categories/laptops.jpg";
import mobileImage from "../../../assets/images/categories/mobiles.jpg";
import headphonesImage from "../../../assets/images/categories/headphones.jpg";
import smartwatchImage from "../../../assets/images/categories/smartwatches.jpg";
import cameraImage from "../../../assets/images/categories/cameras.jpg";
import accessoriesImage from "../../../assets/images/categories/accessories.jpg";

const Categories = () => {
  // Temporary static data
  const categories = [
    {
      _id: 1,
      name: "Laptops",
      description: "Powerful laptops for work and gaming.",
      image: laptopImage,
    },
    {
      _id: 2,
      name: "Mobiles",
      description: "Latest smartphones from top brands.",
      image: mobileImage,
    },
    {
      _id: 3,
      name: "Headphones",
      description: "Wireless and noise-cancelling headphones.",
      image: headphonesImage,
    },
    {
      _id: 4,
      name: "Smartwatches",
      description: "Track your fitness and stay connected.",
      image: smartwatchImage,
    },
    {
      _id: 5,
      name: "Cameras",
      description: "Capture every moment with high-quality cameras.",
      image: cameraImage,
    },
    {
      _id: 6,
      name: "Accessories",
      description: "Essential electronic accessories and gadgets.",
      image: accessoriesImage,
    },
  ];

  return (
    <section className={styles.categories}>
      <div className={styles.sectionHeader}>
        <h2>Shop by Categories</h2>
        <p>Browse products by your favorite categories.</p>
      </div>

      <div className={styles.categoriesGrid}>
        {categories.map((category) => (
          <CategoryCard key={category._id} category={category} />
        ))}
      </div>
    </section>
  );
};

export default Categories;
