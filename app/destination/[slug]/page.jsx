'use client';

import { useEffect, useState, use } from 'react';
import { destinationAPI } from '../../../src/services/api';
import DestinationNavbar from '../../../components/Fragments/DestinationNavbar';
import DestinationInfo from '../../../components/Fragments/DestinationInfo';
import DestinationDescription from '../../../components/Fragments/DestinationDescription';
import ExperiencesSection from '../../../components/Fragments/ExperiencesSection';
import GuestPhotos from '../../../components/Fragments/GuestPhotos';
import GeneralInfo from '../../../components/Elements/GeneralInfo';
import SectionNav from '../../../components/Elements/SectionNav';
import DestinationFaq from '../../../components/Elements/DestinationFaq';
import Footer from '../../../components/Fragments/Footer';

const DestinationDetail = ({ params }) => {
    const resolvedParams = use(params);
    const slug = resolvedParams.slug;
    const [destination, setDestination] = useState({});
    const [destinationImages, setDestinationImages] = useState([]);
    const [destinationReviews, setDestinationReviews] = useState([]);
    const [nearbyDestinations, setNearbyDestinations] = useState([]);
    const [guestPhotos, setGuestPhotos] = useState([]);
    const [destinationFacilities,setDestinationFacilities] = useState([]);
    const [destinationFaqs,setDestinationFaqs] = useState([]);

    useEffect(() => {
        destinationAPI.detail(slug).then((res) => {
            setDestination(res.data);
            console.log(res.data)
        });
    }, []);

    useEffect(() => {
        destinationAPI.images(slug).then((res) => {
            console.log('🖼️ Destination images:', res.data);
            // Images are now full URLs from backend
            const images = res.data.map((data) => data.image);
            setDestinationImages(images);
        }).catch((err) => {
            console.error('❌ Error fetching images:', err);
            setDestinationImages([]);
        });
    }, [slug]);

    useEffect(() => {
        destinationAPI.reviews(slug).then((res) => {
            setDestinationReviews(res.data);
        });
    }, []);

    useEffect(() => {
        destinationAPI.nearby(slug).then((res) => {
            setNearbyDestinations(res.data);
        });
    }, []);

    useEffect(() => {
        destinationAPI.guestPhotos(slug).then((res) => {
            setGuestPhotos(res.data);
        });
    }, []);

    useEffect(() => {
        destinationAPI.facilities(slug)
        .then((res) => {
            setDestinationFacilities(res.data)
        })
    },[])

    useEffect(() => {
        destinationAPI.faq(slug)
        .then((res) => {
            setDestinationFaqs(res.data)
        })
    },[])

    const formatRupiah = (num) => 'IDR ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    const handleShare = async () => {
        const shareData = {
            title: destination?.name || 'Destination',
            text: `Yuk cek destinasi menarik: ${destination?.name}!`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                console.log('Berhasil share!');
            } catch (error) {
                console.error('Gagal share:', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareData.url);
                alert('Link telah disalin ke clipboard!');
            } catch (error) {
                console.error('Clipboard error:', error);
            }
        }
    };

    return (
        <div className='h-max'>
            <DestinationNavbar />
            <DestinationInfo destination={destination} destinationImages={destinationImages} />
            <SectionNav onShare={handleShare} />
            <DestinationDescription handleShare={handleShare} formatRupiah={formatRupiah} destination={destination} reviews={destinationReviews} facilities={destinationFacilities} />
            <GuestPhotos guestPhotos={guestPhotos} />
            <GeneralInfo destination={destination} formatRupiah={formatRupiah} />
            <ExperiencesSection destinations={nearbyDestinations} />
            <DestinationFaq faq={destinationFaqs} />
            <Footer hotel={destination} />
        </div>
    );
};

export default DestinationDetail;
