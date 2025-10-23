import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Toaster } from "react-hot-toast";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Toaster />
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
