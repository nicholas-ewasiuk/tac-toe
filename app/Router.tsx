import React, { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Body } from './Body';


export const Router: FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Body />}>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

