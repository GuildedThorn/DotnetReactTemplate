import "@/styles/Index.css";
import App from "@/routes/App.tsx";
import Layout from "@/components/layout.tsx";
import Login from "@/routes/Login.tsx";
import ProtectedRoute from "@/components/protected-router.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Route, Routes, BrowserRouter } from "react-router-dom";

const doc = document.getElementById('root')!;
createRoot(doc).render(
    <StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        {/* Protected Routes with Layout */}
                        <Route element={<Layout />}>
                            <Route path="/" element={<ProtectedRoute element={<App />} />} />
                        </Route>
                        {/* Catch-all for unknown routes */}
                        <Route path="*" element={<div>Page not Found</div>} />
                    </Routes>
            </BrowserRouter>
        </ThemeProvider>
    </StrictMode>
);
