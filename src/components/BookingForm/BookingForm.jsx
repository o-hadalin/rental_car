import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import toast from 'react-hot-toast';
import { registerLocale } from 'react-datepicker';
import enGB from 'date-fns/locale/en-GB';
registerLocale('en-GB', enGB);
import '../../styles/reactDatepickerOverrides.css';
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
            <div className={styles.inputGroup}>
              <div className={styles.fieldWrapper}>
                <Field
                  id="name"
                  name="name"
                  placeholder="Name*"
                  autoComplete="name"
                  className={`${styles.input} ${styles.inputWithError}`}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className={styles.errorInline}
                />
              </div>
              <div className={styles.fieldWrapper}>
                <Field
                  id="email"
                  name="email"
                  placeholder="Email*"
                  autoComplete="email"
                  className={`${styles.input} ${styles.inputWithError}`}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className={styles.errorInline}
                />
              </div>
              <div
                className={`${styles.fieldWrapper} ${styles.datePickerWrapper}`}
              >
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
                  className={`${styles.input} ${styles.inputWithError}`}
                  calendarClassName="calendar"
                  minDate={new Date()}
                  dateFormat="dd.MM.yyyy"
                  locale="en-GB"
                />
                <ErrorMessage
                  name="date"
                  component="div"
                  className={styles.errorInline}
                />
              </div>
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
