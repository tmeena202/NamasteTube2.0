import "./App.css";
import Head from "./components/Head";
import Body from "./components/Body";
import store from "./utils/store";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainContainer from "./components/MainContainer";
import WatchPage from "./components/WatchPage";
import SearchResults from "./components/SearchResults";
import History from "./components/History";
import LikedVideosPage from "./components/LikedVideosPage";
import Playlists from "./components/Playlists";
import PlaylistDetail from "./components/PlaylistDetail";
import GeminiPage from "./components/GeminiPage"; // ⭐ NEW

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Body />,
    children: [
      {
        path: "/",
        element: <MainContainer />,
      },
      {
        path: "/watch",
        element: <WatchPage />,
      },
      {
        path: "/results",
        element: <SearchResults />,
      },
      {
        path: "/history",
        element: <History />,
      },
      {
        path: "/liked",
        element: <LikedVideosPage />,
      },
      {
        path: "/playlists",
        element: <Playlists />,
      },
      {
        path: "/playlist/:id",
        element: <PlaylistDetail />,
      },
      {
        path: "/gemini", // ⭐ NEW ROUTE
        element: <GeminiPage />,
      },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <RouterProvider router={appRouter} />
      </div>
    </Provider>
  );
}

export default App;
