import React, { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Providers from './Providers';
import { NewPage } from './views/NewPage';


export const Router: FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Providers />}>
                    <Route index element={<NewPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

