import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const isMenuOpen = useSelector((store) => store.app.isMenuOpen);
  const subscriptions = useSelector((store) => store.subscriptions || []);
  const isLoggedIn = useSelector((store) => store.auth?.isLoggedIn);
  const location = useLocation();

  const activeClass = "bg-gray-100 font-medium";

  return (
    <div
      className={`fixed top-14 left-0 h-[calc(100vh-56px)] bg-white border-r border-gray-200 overflow-y-auto transition-transform duration-300 z-50 w-64 px-3 py-3
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Note: I removed the {isMenuOpen && ...} wrapper. 
          For a smooth overlap animation, the content should stay rendered 
          while the container slides out of view.
      */}
      <>
        {/* HOME */}
        <ul>
          <li>
            <Link
              to="/"
              className={`flex items-center gap-4 px-3 py-2 rounded-lg cursor-pointer ${
                location.pathname === "/" ? activeClass : "hover:bg-gray-100"
              }`}
            >
              <span className="text-xl">🏠</span>
              <span>Home</span>
            </Link>
          </li>
        </ul>

        <hr className="my-3 border-gray-200" />

        {/* YOU */}
        <h1 className="px-3 text-sm font-semibold text-gray-600 mb-2">You</h1>
        <ul className="space-y-2">
          <li>
            <Link
              to="/history"
              className={`flex items-center gap-4 px-3 py-2 rounded-lg cursor-pointer ${
                location.pathname === "/history"
                  ? activeClass
                  : "hover:bg-gray-100"
              }`}
            >
              <span className="text-lg">🕒</span>
              <span className="text-sm">History</span>
            </Link>
          </li>

          <li>
            <Link
              to="/liked"
              className={`flex items-center gap-4 px-3 py-2 rounded-lg cursor-pointer ${
                location.pathname === "/liked"
                  ? activeClass
                  : "hover:bg-gray-100"
              }`}
            >
              <span className="text-lg">❤️</span>
              <span className="text-sm">Liked Videos</span>
            </Link>
          </li>

          <li>
            <Link
              to="/playlists"
              className={`flex items-center gap-4 px-3 py-2 rounded-lg cursor-pointer ${
                location.pathname === "/playlists"
                  ? activeClass
                  : "hover:bg-gray-100"
              }`}
            >
              <span className="text-lg">📁</span>
              <span className="text-sm">Playlists</span>
            </Link>
          </li>
        </ul>

        <hr className="my-3 border-gray-200" />

        {/* SUBSCRIPTIONS */}
        <h1 className="px-3 text-sm font-semibold text-gray-600 mb-2">
          Subscriptions
        </h1>

        {!isLoggedIn && (
          <p className="px-3 text-sm text-gray-500">
            Sign in to see your subscriptions
          </p>
        )}

        {isLoggedIn && subscriptions.length > 0 && (
          <ul className="space-y-2">
            {subscriptions.map((sub) => {
              const title =
                typeof sub.snippet?.title === "string"
                  ? sub.snippet.title
                  : sub.snippet?.title?.name || "Unknown Channel";

              const thumbnail =
                sub.snippet?.thumbnails?.default?.url ||
                "https://via.placeholder.com/24";

              return (
                <li
                  key={sub.id || title}
                  className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 cursor-pointer"
                >
                  <img
                    src={thumbnail}
                    alt={title}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm truncate">{title}</span>
                </li>
              );
            })}
          </ul>
        )}

        <hr className="my-3 border-gray-200" />

        {/* SETTINGS */}
        <ul className="space-y-2">
          {["Settings", "Report history", "Help", "Send feedback"].map(
            (item, index) => (
              <li
                key={index}
                className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <span className="text-lg">⚙</span>
                <span className="text-sm">{item}</span>
              </li>
            )
          )}
        </ul>

        <hr className="my-3 border-gray-200" />

        {/* FOOTER */}
        <div className="text-xs text-gray-600 px-3 space-y-2">
          <p>About Press Copyright</p>
          <p>Contact Us Creators Advertise</p>
          <p>Developers</p>
          <p className="mt-2">Terms Privacy Policy & Safety</p>
          <p>How YouTube works</p>
          <p>Test new features</p>
          <p className="mt-2">© 2025 Google LLC</p>
        </div>
      </>
    </div>
  );
};

export default Sidebar;
