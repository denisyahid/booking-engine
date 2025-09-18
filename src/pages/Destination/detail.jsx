import {  useParams } from 'react-router-dom';


const DestinationDetail = () => {
    const { slug } = useParams();
    return(
        <h1>{slug}</h1>
    )
};

export default DestinationDetail;
