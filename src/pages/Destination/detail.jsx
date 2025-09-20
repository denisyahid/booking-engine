import { useParams } from 'react-router-dom';
import DestinationNavbar from '../../components/Fragments/DestinationNavbar';
import DestinationInfo from '../../components/Fragments/DestinationInfo';
import { useEffect, useState } from 'react';
import axios from 'axios';
import DestinationDescription from '../../components/Fragments/DestinationDescription';
import ExperiencesSection from '../../components/Fragments/ExperiencesSection';
import GuestPhotos from '../../components/Fragments/GuestPhotos';
import GeneralInfo from '../../components/Elements/GeneralInfo';

const DestinationDetail = () => {
    const { slug } = useParams();
    const [destination,setDestination] = useState({});
    const [destinationImages,setDestinationImages] = useState([]);
    const [destinationReviews,setDestinationReviews] = useState([]);
    const [nearbyDestinations,setNearbyDestinations] = useState([]);
    const [guestPhotos,setGuestPhotos] = useState([]);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/destination/${slug}`)
        .then((res) => {
            setDestination(res.data);
        })
    },[])

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/destination/image/${slug}`)
        .then((res) => {
            const images = res.data.map((data) => data.image);
            setDestinationImages(images);
        })
    },[])

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/destination/review/${slug}`)
        .then((res) => {
            setDestinationReviews(res.data);
        })
    },[])

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/destination/nearby/${slug}`)
        .then((res) => {
            setNearbyDestinations(res.data);
        })
    },[])
    
    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/destination/guest/${slug}`)
        .then((res) => {
            setGuestPhotos(res.data);
        })
    },[])

const formatRupiah = (num) => 'IDR ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return (
        <>
            <DestinationNavbar  />
            <DestinationInfo destination={destination} destinationImages={destinationImages} />
            <DestinationDescription formatRupiah={formatRupiah} destination={destination} reviews={destinationReviews}/>
            <GuestPhotos guestPhotos={guestPhotos} />
            <GeneralInfo destination={destination} formatRupiah={formatRupiah} />
            <ExperiencesSection destinations={nearbyDestinations}  />
        </>
    );
};

export default DestinationDetail;
