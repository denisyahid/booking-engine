import { redirect } from 'next/navigation';

export default function HomePage() {
    // Redirect to hotels page
    redirect('/hotels');
}
