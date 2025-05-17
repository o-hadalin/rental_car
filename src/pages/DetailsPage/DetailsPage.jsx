import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loader from '../../components/Loader/Loader';
import axios from 'axios';
import css from './DetailsPage.module.css';

import BookingForm from '../../components/BookingForm/BookingForm.jsx';
import CarDetailsInfo from '../../components/CarDetailsInfo/CarDetailsInfo.jsx';

const DetailsPage = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axios.get(
          `https://car-rental-api.goit.global/cars/${id}`
        );
        setCar(response.data);
      } catch (error) {
        console.error('Error fetching car details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  if (loading)
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}
      >
        <Loader />
      </div>
    );
  if (!car) return <div>Car not found</div>;

  return (
    <main className={css.container}>
      <div className={css.leftColumn}>
        <img
          src={car.img}
          alt={`${car.make} ${car.model}`}
          className={css.carImage}
        />
        <BookingForm carTitle={`${car.make} ${car.model}`} />
      </div>

      <div className={css.rightColumn}>
        <CarDetailsInfo car={car} />
      </div>
    </main>
  );
};

export default DetailsPage;
