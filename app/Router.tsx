import React, { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Active } from "./views/Active";
import { Created } from "./views/Created";
import { Explore } from "./views/Explore";
import { Home } from "./views/Home";
import { Play } from "./views/Play";
import { Nav } from "./components/Nav";

export const Router: FC = () => {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/created" element={<Created />} />
        <Route path="/active" element={<Active />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/play" element={<Play />} />
      </Routes>
    </BrowserRouter>
  );
};
