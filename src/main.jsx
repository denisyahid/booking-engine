import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './pages/App.jsx';
import BookingPage from './pages/Booking/index.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginPage from './pages/Login/index.jsx';
import RegisterPage from './pages/Register/index.jsx';
import BlogPage from './pages/Blog/index.jsx';
import DestinationPage from './pages/Destination/index.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },
    {
        path: '/:slug',
        element: <App />,
    },
    {
        path: '/:slug/destination',
        element: <DestinationPage />,
    },
    {
        path: '/:slug/blog',
        element: <BlogPage />,
    },
    {
        path: '/booking/:id',
        element: <BookingPage />,
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/register',
        element: <RegisterPage />,
    },
]);

const googleClientId = '75152243320-pp231slblh9pv152qg733h3t9vklov00.apps.googleusercontent.com';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <GoogleOAuthProvider clientId={googleClientId}>
            <RouterProvider router={router}></RouterProvider>
        </GoogleOAuthProvider>
    </StrictMode>,
);
