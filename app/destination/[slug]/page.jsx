import DestinationNavbar from '../../../components/Fragments/DestinationNavbar';
import DestinationInfo from '../../../components/Fragments/DestinationInfo';
import DestinationDescription from '../../../components/Fragments/DestinationDescription';
import ExperiencesSection from '../../../components/Fragments/ExperiencesSection';
import GuestPhotos from '../../../components/Fragments/GuestPhotos';
import GeneralInfo from '../../../components/Elements/GeneralInfo';
import SectionNav from '../../../components/Elements/SectionNav';
import DestinationFaq from '../../../components/Elements/DestinationFaq';
import Footer from '../../../components/Fragments/Footer';

export async function generateStaticParams() {
    try {
        const res = await fetch('http://10.108.118.71:8000/api/destination');
        const destinations = await res.json();
        return destinations.map((dest) => ({
            slug: dest.slug,
        }));
    } catch (error) {
        console.error('Error fetching destinations for static params:', error);
        return [];
    }
}

export default async function DestinationDetail({ params }) {
    const { slug } = await params;

    try {
        const [detailRes, imagesRes, reviewsRes, nearbyRes, guestRes, facilitiesRes, faqRes] = await Promise.all([
            fetch(`http://10.108.118.71:8000/api/destination/${slug}`),
            fetch(`http://10.108.118.71:8000/api/destination/image/${slug}`),
            fetch(`http://10.108.118.71:8000/api/destination/review/${slug}`),
            fetch(`http://10.108.118.71:8000/api/destination/nearby/${slug}`),
            fetch(`http://10.108.118.71:8000/api/destination/guest/${slug}`),
            fetch(`http://10.108.118.71:8000/api/destination/facility/${slug}`),
            fetch(`http://10.108.118.71:8000/api/destination/faq/${slug}`),
        ]);

        const destination = await detailRes.json();
        const destinationImages = (await imagesRes.json()).map(d => d.image);
        const destinationReviews = await reviewsRes.json();
        const nearbyDestinations = await nearbyRes.json();
        const guestPhotos = await guestRes.json();
        const destinationFacilities = await facilitiesRes.json();
        const destinationFaqs = await faqRes.json();

        return (
            <div className='h-max'>
                <DestinationNavbar />
                <DestinationInfo destination={destination} destinationImages={destinationImages} />
                <SectionNav destination={destination} />
                <DestinationDescription destination={destination} reviews={destinationReviews} facilities={destinationFacilities} />
                <GuestPhotos guestPhotos={guestPhotos} />
                <GeneralInfo destination={destination} />
                <ExperiencesSection destinations={nearbyDestinations} />
                <DestinationFaq faq={destinationFaqs} />
                <Footer hotel={destination} />
            </div>
        );
    } catch (error) {
        console.error('Error fetching destination data:', error);
        return (
            <div className='min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4'>
                <div className='max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center'>
                    <h1 className='text-2xl font-bold text-gray-800 mb-4'>Destination Not Found</h1>
                    <p className='text-gray-600 mb-6'>
                        The destination you&apos;re looking for doesn&apos;t exist or has been removed.
                    </p>
                </div>
            </div>
        );
    }
}
