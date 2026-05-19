import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useForm from '../../hooks/useForm';
import { createUser, getCountries, getCities } from '../../api/userApi';
import Input from '../common/Input';
import Select from '../common/Select';
import './UserForm.css';

const INITIAL_VALUES = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  email: '',
  country: '',
  city: '',
};

const UserForm = ({ onUserCreated, showToast }) => {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleFormSubmit = async (values) => {
    try {
      await createUser(values);
      showToast('User profile created successfully!', 'success');
      resetForm();
      setSelectedDate(null);
      setCities([]);
      onUserCreated();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create user. Please try again.';
      showToast(message, 'error');
      throw error;
    }
  };

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, resetForm, setFieldValue } = useForm(INITIAL_VALUES, handleFormSubmit);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const response = await getCountries();
        setCountries(response.data);
      } catch (error) {
        showToast('Failed to load countries', 'error');
      }
    };
    loadCountries();
  }, []);

  useEffect(() => {
    if (!values.country) { setCities([]); return; }
    const loadCities = async () => {
      setLoadingCities(true);
      try {
        const response = await getCities(values.country);
        setCities(response.data);
      } catch (error) { setCities([]); }
      finally { setLoadingCities(false); }
    };
    loadCities();
    setFieldValue('city', '');
  }, [values.country]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    handleChange('dateOfBirth', date ? date.toISOString().split('T')[0] : '');
  };

  const countryOptions = countries.map((c) => ({ value: c.code, label: c.name }));
  const cityOptions = cities.map((city) => ({ value: city, label: city }));

  return (
    <div className="user-form-card">
      <div className="card-header">
        <div className="card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
        </div>
        <div>
          <h2>Create User Profile</h2>
          <p>Fill in the details to add a new user</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <Input id="firstName" label="First Name" placeholder="Enter first name" value={values.firstName} onChange={(val) => handleChange('firstName', val)} onBlur={() => handleBlur('firstName')} error={touched.firstName && errors.firstName} required />
          <Input id="lastName" label="Last Name" placeholder="Enter last name" value={values.lastName} onChange={(val) => handleChange('lastName', val)} onBlur={() => handleBlur('lastName')} error={touched.lastName && errors.lastName} required />
          <div className="date-picker-wrapper">
            <label htmlFor="dateOfBirth">Date of Birth<span className="required">*</span></label>
            <DatePicker id="dateOfBirth" selected={selectedDate} onChange={handleDateChange} onBlur={() => handleBlur('dateOfBirth')} dateFormat="MM/dd/yyyy" maxDate={new Date()} showYearDropdown showMonthDropdown dropdownMode="select" placeholderText="Select date of birth" className={touched.dateOfBirth && errors.dateOfBirth ? 'error' : ''} autoComplete="off" />
            {touched.dateOfBirth && errors.dateOfBirth && (
              <div className="field-error">
                <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                <span>{errors.dateOfBirth}</span>
              </div>
            )}
          </div>
          <Input id="email" label="Email Address" type="email" placeholder="user@domain.com" value={values.email} onChange={(val) => handleChange('email', val)} onBlur={() => handleBlur('email')} error={touched.email && errors.email} required />
          <div className="location-row">
            <Select id="country" label="Country" value={values.country} onChange={(val) => handleChange('country', val)} onBlur={() => handleBlur('country')} error={touched.country && errors.country} options={countryOptions} placeholder="Select country" required />
            <Select id="city" label="City" value={values.city} onChange={(val) => handleChange('city', val)} onBlur={() => handleBlur('city')} error={touched.city && errors.city} options={cityOptions} placeholder={loadingCities ? 'Loading cities...' : 'Select city'} disabled={!values.country || loadingCities} required />
          </div>
          <div className="form-actions">
            <button id="submit-profile" type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? (<><div className="spinner" />Creating...</>) : (<><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>Save Profile</>)}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
