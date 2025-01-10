import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
    return (
        <div className="layout-container">
            {/* This is where you would put a sidebar, header, footer or any static components across the entire page */}
            <main className="content">
                <Outlet /> {/* This will render the nested route content */}
            </main>
        </div>
    );
};

export default Layout;
