import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './pages/App.jsx';
import BookingPage from './pages/Booking/index.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

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
        path: '/booking/:id',
        element: <BookingPage />,
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
