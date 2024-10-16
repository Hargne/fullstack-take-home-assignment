import { useState } from "react";
import Navigation from "./components/Navigation/Navigation";
import { View, allViews } from "./views/Views";
import styles from "./App.module.css";

function App() {
  function getViewFromURL(): View {
    const path = window.location.pathname.split("/").filter(Boolean)[0];
    const view = Object.keys(allViews).find(
      (view) => view.toLowerCase() === path
    );
    return (view as View) ?? "tracks";
  }

  const [currentView, setCurrentView] = useState<View>(getViewFromURL());

  function renderActiveView() {
    const { component: ActiveView } = allViews[currentView];
    return <ActiveView />;
  }

  return (
    <div className={styles.wrapper}>
      <Navigation currentView={currentView} onNavigate={setCurrentView} />
      <main>{renderActiveView()}</main>
    </div>
  );
}

export default App;
