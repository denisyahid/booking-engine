import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import './index.css';
import App from './pages/App.jsx';
import BookingPage from './pages/Booking/index.jsx';

const router = createBrowserRouter([{
    path: '/',
    element: <App />
},{
    path: '/booking',
    element: <BookingPage />
}]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} ></RouterProvider>
    </StrictMode>,
);
