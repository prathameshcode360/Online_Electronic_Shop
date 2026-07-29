import styles from "./SearchBar.module.css";

const SearchBar = () => {
  return (
    <form className={styles.searchBar}>
      <input
        type="text"
        placeholder="Search for products..."
        className={styles.searchInput}
      />

      <button type="submit" className={styles.searchButton}>
        Search
      </button>
    </form>
  );
};

export default SearchBar;
