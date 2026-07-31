import styles from "./Header.module.css";

import Logo from "../../common/Logo/Logo";
import SearchBar from "../../common/SearchBar/SearchBar";
import HeaderActions from "./HeaderActions";

const Header = () => {
  return (
    <header className={styles.header}>
      <Logo />
      <SearchBar />
      <HeaderActions />
    </header>
  );
};

export default Header;
