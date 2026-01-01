import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "./Button";
import { YOUTUBE_CATEGORIES_API } from "../utils/constants";
import { saveCategories } from "../utils/categoryCacheSlice"; // updated slice name

const DEFAULT_CATEGORIES = [
  { id: "all", title: "All" },
  { id: "20", title: "Gaming" },
  { id: "10", title: "Music" },
  { id: "17", title: "Sports" },
  { id: "24", title: "Entertainment" },
  { id: "27", title: "Education" },
];

const EXCLUDED_CATEGORIES = ["Nonprofits & Activism", "People & Blogs"];
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24h

const ButtonList = ({ onCategoryChange }) => {
  const dispatch = useDispatch();
  const cached = useSelector((store) => store.categoryCache); // updated selector

  const [categories, setLocalCategories] = useState(DEFAULT_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      const now = new Date().getTime();

      if (
        cached.categories.length > 0 &&
        now - cached.timestamp < CACHE_EXPIRY
      ) {
        setLocalCategories(cached.categories);
        setIsLoading(false);
        return;
      }

      const res = await fetch(YOUTUBE_CATEGORIES_API);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (!data?.items?.length) throw new Error("No categories");

      const fetched = data.items
        .map((item) => ({ id: item.id, title: item.snippet.title }))
        .filter((cat) => !EXCLUDED_CATEGORIES.includes(cat.title))
        .slice(0, 10);

      const finalCategories = [{ id: "all", title: "All" }, ...fetched];

      // Save to Redux cache
      dispatch(saveCategories({ categories: finalCategories, timestamp: now }));

      setLocalCategories(finalCategories);
    } catch (error) {
      setHasError(true);
      setLocalCategories(DEFAULT_CATEGORIES);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category.title);
    onCategoryChange(category);
  };

  if (isLoading) {
    return (
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
        {[20, 24, 28, 20].map((w, i) => (
          <div
            key={i}
            className={`h-8 w-${w} rounded-full bg-gray-200 animate-pulse`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
      {categories.map((cat) => (
        <Button
          key={cat.id}
          name={cat.title}
          isActive={activeCategory === cat.title}
          onClick={() => handleCategoryClick(cat)}
        />
      ))}

      {hasError && (
        <span className="text-xs text-red-500 self-center ml-2">
          (Using fallback categories)
        </span>
      )}
    </div>
  );
};

export default ButtonList;
