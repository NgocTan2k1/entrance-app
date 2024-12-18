import React from 'react';

// pages
import HomePage from '../pages/home/HomePage';
import EntrancePage from '../pages/entrance/EntrancePage';

export interface IRoute {
    id: string;
    name: string;
    path: string[];
    Component: React.FC;
}

export const publicRoutes: IRoute[] = [
    {
        id: 'HomePage',
        name: 'Home Page',
        path: ['/', '/home'],
        Component: HomePage,
    },
    {
        id: 'EntrancePage',
        name: 'Entrance Page',
        path: ['/entrance'],
        Component: EntrancePage,
    },
];
export const privateRoutes: IRoute[] = [];
