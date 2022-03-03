import React, { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Search } from "./views/Search";
import { Home } from "./views/Home";

export const Router: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
};
