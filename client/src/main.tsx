import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./theme/theme.module.css";
import { TrackProvider } from "./providers/TrackProvider/TrackProvider.tsx";
import { PlaylistProvider } from "./providers/PlaylistProvider/PlaylistProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PlaylistProvider>
      <TrackProvider>
        <App />
      </TrackProvider>
    </PlaylistProvider>
  </StrictMode>
);
