import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import toast from 'react-hot-toast';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './BookingForm.module.css';

const BookingSchema = Yup.object().shape({
  name: Yup.string().min(3, 'Min 3 characters').required('Required'),
  email: Yup.string()
    .required('Required')
    .email('Invalid email')
    .test('domain', 'Invalid email domain', value => {
      if (!value) return false;
      const domain = value.split('@')[1];
      return domain && domain.includes('.');
    }),
});

const BookingForm = () => {
  const [bookingDate, setBookingDate] = useState(null);

  return (
    <div className={styles.wrapper}>
      <div className={styles.textBlock}>
        <p className={styles.title}>Book your car now</p>
        <p className={styles.subtitle}>
          Stay connected! We are always ready to help you.
        </p>
      </div>

      <Formik
        initialValues={{ name: '', email: '', date: '', comment: '' }}
        validationSchema={BookingSchema}
        onSubmit={(values, actions) => {
          toast.success('Booking request sent!');
          actions.resetForm();
          setBookingDate(null);
        }}
      >
        {({ setFieldValue }) => (
          <Form className={styles.form}>
            <div>
              <Field
                id="name"
                name="name"
                placeholder="Name*"
                autoComplete="name"
                className={styles.input}
              />
              <ErrorMessage
                name="name"
                component="div"
                className={styles.error}
              />

              <Field
                id="email"
                name="email"
                placeholder="Email*"
                autoComplete="email"
                className={styles.input}
              />
              <ErrorMessage
                name="email"
                component="div"
                className={styles.error}
              />

              <DatePicker
                id="bookingDate"
                name="date"
                autoComplete="off"
                selected={bookingDate}
                onChange={date => {
                  setBookingDate(date);
                  setFieldValue('date', date);
                }}
                placeholderText="Booking date"
                className={styles.input}
                calendarClassName={styles.calendar}
              />
              <ErrorMessage
                name="date"
                component="div"
                className={styles.error}
              />

              <Field
                as="textarea"
                id="comment"
                name="comment"
                autoComplete="off"
                placeholder="Comments"
                className={styles.textarea}
              />
            </div>

            <button type="submit" className={styles.button}>
              Send
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BookingForm;
