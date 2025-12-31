import React from "react";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import MainContainer from "./MainContainer";
import Head from "./Head";
import { Outlet } from "react-router-dom";

const Body = () => {
  const isMenuOpen = useSelector((store) => store.app.isMenuOpen);
  
  return (
    <>
      <Head />
      <div className="flex bg-gray-50 min-h-screen overflow-x-hidden">
        <Sidebar />
        <div className={`flex-1 transition-all duration-300 w-0 ${isMenuOpen ? "ml-64" : ""}`}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Body;
