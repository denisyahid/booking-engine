import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '../src/context/AuthContext';
import './globals.css';

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '75152243320-pp231slblh9pv152qg733h3t9vklov00.apps.googleusercontent.com';
const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'Mid-client-cQqzSIU_MlHwk_6V';

export const metadata = {
    title: 'Najjo Hotels',
    description: 'Najjo Hotels Booking Engine',
};

export default function RootLayout({ children }) {
    return (
        <html lang='en'>
            <head>
                <link rel='icon' type='image/svg+xml' href='/vite.svg' />
                <script
                    src='https://app.sandbox.midtrans.com/snap/snap.js'
                    data-client-key={midtransClientKey}
                    async
                />
            </head>
            <body>
                <AuthProvider>
                    <GoogleOAuthProvider clientId={googleClientId}>{children}</GoogleOAuthProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
