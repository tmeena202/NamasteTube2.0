import React from "react";

const SearchFilters = ({ order, videoDuration, onOrderChange, onDurationChange }) => {
  return (
    <div className="flex gap-4">
      <div>
        <label htmlFor="orderBy" className="sr-only">
          Order By
        </label>
        <select
          id="orderBy"
          className="border border-gray-300 rounded-md px-3 py-1.5 text-gray-700 focus:outline-none focus:ring focus:border-blue-300 bg-white cursor-pointer"
          value={order}
          onChange={(e) => onOrderChange(e.target.value)}
        >
          <option value="relevance">Sort by: Relevance</option>
          <option value="viewCount">Sort by: View Count</option>
          <option value="date">Sort by: Upload Date</option>
          <option value="rating">Sort by: Rating</option>
          <option value="title">Sort by: Title</option>
        </select>
      </div>
      <div>
        <label htmlFor="videoDuration" className="sr-only">
          Video Duration
        </label>
        <select
          id="videoDuration"
          className="border border-gray-300 rounded-md px-3 py-1.5 text-gray-700 focus:outline-none focus:ring focus:border-blue-300 bg-white cursor-pointer"
          value={videoDuration}
          onChange={(e) => onDurationChange(e.target.value)}
        >
          <option value="any">Duration: Any</option>
          <option value="short">Duration: Short (&lt; 4 min)</option>
          <option value="medium">Duration: Medium (4-20 min)</option>
          <option value="long">Duration: Long (&gt; 20 min)</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilters;




