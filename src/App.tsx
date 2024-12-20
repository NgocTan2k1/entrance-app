import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

// routes
import { privateRoutes, publicRoutes } from './routers/routes';

function App() {
    const isLogged = false;
    useEffect(() => {
        // console.log('===== Mouted App.tsx =====');
        return () => {
            // console.log('===== Unmouted App.tsx component =====');
        };
    }, []);

    return (
        <div className="wrapper__app h-[100%] w-[100%]">
            <Routes>
                {publicRoutes?.map((routes) => {
                    const router = routes.path.map((route, index) => {
                        return <Route key={routes.id + index} path={route} Component={routes.Component} />;
                    });
                    return router;
                })}

                {isLogged &&
                    privateRoutes?.map((routes) => {
                        const router = routes.path.map((route, index) => {
                            return <Route key={routes.id + index} path={route} Component={routes.Component} />;
                        });
                        return router;
                    })}
            </Routes>
        </div>
    );
}

export default App;
