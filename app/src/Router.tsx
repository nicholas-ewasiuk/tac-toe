import React, { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Providers from './Providers';
import { NewPage } from './components/pages/NewPage';
import { PendingPage } from './components/pages/PendingPage';
 
// TODO: add finalized view

export const Router: FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Providers />}>
                    <Route index element={<NewPage />} />
                    <Route path="pending" element={<PendingPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

