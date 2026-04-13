import { useParams } from 'react-router-dom';
import DestinationNavbar from '../../components/Fragments/DestinationNavbar';
import DestinationInfo from '../../components/Fragments/DestinationInfo';
import { useEffect, useState } from 'react';
import axios from 'axios';
import DestinationDescription from '../../components/Fragments/DestinationDescription';
import ExperiencesSection from '../../components/Fragments/ExperiencesSection';
import GuestPhotos from '../../components/Fragments/GuestPhotos';
import GeneralInfo from '../../components/Elements/GeneralInfo';
import SectionNav from '../../components/Elements/SectionNav';
import FAQ from '../../components/Fragments/FAQ';
import DestinationFaq from '../../components/Elements/DestinationFaq';
import Footer from '../../components/Fragments/Footer';

const DestinationDetail = () => {
    const { slug } = useParams();
    const [destination, setDestination] = useState({});
    const [destinationImages, setDestinationImages] = useState([]);
    const [destinationReviews, setDestinationReviews] = useState([]);
    const [nearbyDestinations, setNearbyDestinations] = useState([]);
    const [guestPhotos, setGuestPhotos] = useState([]);
    const [destinationFacilities,setDestinationFacilities] = useState([]);
    const [destinationFaqs,setDestinationFaqs] = useState([]);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/destination/${slug}`).then((res) => {
            setDestination(res.data);
            console.log(res.data)
        });
    }, []);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/destination/image/${slug}`).then((res) => {
            const images = res.data.map((data) => data.image);
            setDestinationImages(images);
        });
    }, []);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/destination/review/${slug}`).then((res) => {
            setDestinationReviews(res.data);
        });
    }, []);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/destination/nearby/${slug}`).then((res) => {
            setNearbyDestinations(res.data);
        });
    }, []);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/destination/guest/${slug}`).then((res) => {
            setGuestPhotos(res.data);
        });
    }, []);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/destination/facility/${slug}`)
        .then((res) => {
            setDestinationFacilities(res.data)
        })
    },[])

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/destination/faq/${slug}`)
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
