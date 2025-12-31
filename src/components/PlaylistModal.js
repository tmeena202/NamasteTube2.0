import React, { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

const PlaylistModal = ({ showModal, setShowModal, videoData }) => {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  // Load playlists from localStorage
  useEffect(() => {
    try {
      const savedPlaylists = JSON.parse(localStorage.getItem("playlists")) || [];
      // Data migration/cleanup: Ensure all names are strings
      const cleanedPlaylists = savedPlaylists.map((pl) => ({
        ...pl,
        name:
          typeof pl.name === "object" ? pl.name.name || "Untitled" : String(pl.name),
      }));
      setPlaylists(cleanedPlaylists);
    } catch (error) {
      console.error("Error parsing playlists from localStorage", error);
      setPlaylists([]);
    }
  }, []);

  // Toast Notification Timer
  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  const savePlaylists = (updated) => {
    setPlaylists(updated);
    localStorage.setItem("playlists", JSON.stringify(updated));
  };

  const createPlaylist = () => {
    const trimmedName = newPlaylistName.trim();
    if (!trimmedName) return;

    // Check for duplicate names
    if (
      playlists.some((pl) => pl.name.toLowerCase() === trimmedName.toLowerCase())
    ) {
      setToastMsg("Playlist with this name already exists!");
      return;
    }

    const newPlaylist = {
      id: Date.now().toString(),
      name: trimmedName,
      videos: [],
    };

    savePlaylists([...playlists, newPlaylist]);
    setNewPlaylistName("");
    setToastMsg(`Created playlist "${trimmedName}"`);
  };

  // Toggle logic (Add if missing, Remove if present)
  const toggleVideoInPlaylist = (playlistId) => {
    if (!videoData) return;

    const updatedPlaylists = playlists.map((pl) => {
      if (pl.id === playlistId) {
        const isAlreadyIn = pl.videos.some((v) => v.id === videoData.id);

        if (isAlreadyIn) {
          // Remove video
          setToastMsg(`Removed from "${pl.name}"`);
          return {
            ...pl,
            videos: pl.videos.filter((v) => v.id !== videoData.id),
          };
        } else {
          // Add video
          setToastMsg(`Added to "${pl.name}"`);
          return {
            ...pl,
            videos: [...pl.videos, videoData],
          };
        }
      }
      return pl;
    });

    savePlaylists(updatedPlaylists);
  };

  // Check if current video is in a specific playlist (for UI Checkbox)
  const isVideoInPlaylist = (playlist) => {
    return playlist.videos?.some((v) => v.id === videoData?.id);
  };

  if (!showModal) return null;

  return (
    <>
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg shadow-lg z-[60] transition-opacity">
          {toastMsg}
        </div>
      )}

      {/* Playlist Modal */}
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={() => setShowModal(false)}
      >
        <div
          className="bg-white rounded-xl shadow-2xl p-6 w-80 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Save to playlist</h2>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>
          </div>

          {/* Playlist List with Checkboxes */}
          <div className="space-y-1 max-h-60 overflow-y-auto mb-4">
            {playlists.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-2">
                No playlists yet.
              </p>
            )}
            {playlists.map((pl) => {
              const isSelected = isVideoInPlaylist(pl);
              return (
                <button
                  key={pl.id}
                  onClick={() => toggleVideoInPlaylist(pl.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded hover:bg-gray-100 transition-colors"
                >
                  <div
                    className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-blue-600 border-blue-600"
                        : "border-gray-400"
                    }`}
                  >
                    {isSelected && <Check size={14} className="text-white" />}
                  </div>
                  <span className="text-gray-800 font-medium truncate">
                    {pl.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Create New Playlist Input */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
              Create New
            </label>
            <div className="flex gap-2">
              <input
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Enter playlist name..."
                className="flex-1 border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
                onKeyDown={(e) => e.key === "Enter" && createPlaylist()}
              />
              <button
                onClick={createPlaylist}
                disabled={!newPlaylistName.trim()}
                className="bg-transparent text-blue-600 font-semibold px-3 py-2 rounded-lg text-sm hover:bg-blue-50 disabled:opacity-50 disabled:hover:bg-transparent"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaylistModal;

