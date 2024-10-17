import { View, allViews } from "~/views/Views";
import logo from "./logo.svg";
import styles from "./Navigation.module.css";

type NavigationProps = {
  currentView: View;
  onNavigate: (view: View) => void;
};

export default function Navigation(props: NavigationProps) {
  function handleNavigation(view: View) {
    props.onNavigate(view);
  }

  return (
    <nav>
      <img
        src={logo}
        className={styles.logo}
        alt="Logo"
        width={32}
        height={39}
      />
      <div className={styles.tablist} role="tablist">
        {Object.keys(allViews).map((key) => (
          <button
            key={key}
            className={key === props.currentView ? styles.active : ""}
            onClick={() => handleNavigation(key)}
            role="tab"
            aria-selected={key === props.currentView}
          >
            {allViews[key].title}
          </button>
        ))}
      </div>
    </nav>
  );
}
