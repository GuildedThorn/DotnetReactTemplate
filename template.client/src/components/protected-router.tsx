import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/check', {
                    method: 'GET',
                    credentials: 'include', // Include cookies with request
                });
                if (response.ok) {
                    setIsAuthenticated(response.ok); // Set to true if 200, false if 401
                }
            } catch {
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, []);

    // If still loading authentication status, return null or a loading spinner
    if (isAuthenticated === null) {
        return null; // or <LoadingSpinner />
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If authenticated, render the component
    return element;
};

export default ProtectedRoute;
