import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useForm from '../../hooks/useForm';
import { createUser, getCountries, getCities } from '../../api/userApi';
import Input from '../common/Input';
import Select from '../common/Select';
import type { FormValues, SelectOption, Country } from '../../types';

const INITIAL_VALUES: FormValues = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  email: '',
  country: '',
  city: '',
};

interface UserFormProps {
  onUserCreated: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const UserForm: React.FC<UserFormProps> = ({ onUserCreated, showToast }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleFormSubmit = async (values: FormValues): Promise<void> => {
    try {
      await createUser(values);
      showToast('User profile created successfully!', 'success');
      resetForm();
      setSelectedDate(null);
      setCities([]);
      onUserCreated();
    } catch (error: unknown) {
      let message = 'Failed to create user. Please try again.';
      if (
        error &&
        typeof error === 'object' &&
        'response' in error
      ) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          message = axiosError.response.data.message;
        }
      }
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
      } catch {
        showToast('Failed to load countries', 'error');
      }
    };
    loadCountries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!values.country) { setCities([]); return; }
    const loadCities = async () => {
      setLoadingCities(true);
      try {
        const response = await getCities(values.country);
        setCities(response.data);
      } catch { setCities([]); }
      finally { setLoadingCities(false); }
    };
    loadCities();
    setFieldValue('city', '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.country]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    handleChange('dateOfBirth', date ? date.toISOString().split('T')[0] : '');
  };

  const countryOptions: SelectOption[] = countries.map((c) => ({ value: c.code, label: c.name }));
  const cityOptions: SelectOption[] = cities.map((city) => ({ value: city, label: city }));

  return (
    <div className="bg-surface border border-border rounded-[20px] p-9 shadow-lg mb-10 max-md:p-6 max-md:rounded-2xl">
      {/* Card Header */}
      <div className="flex items-center gap-3.5 mb-8">
        <div className="w-11 h-11 bg-gradient-to-br from-accent to-[#06b6d4] rounded-xl flex items-center justify-center shadow-[0_4px_12px_var(--color-accent-glow)]">
          <svg className="w-[22px] h-[22px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
        </div>
        <div>
          <h2 className="text-[1.3rem] font-bold text-text-primary tracking-[-0.02em]">Create User Profile</h2>
          <p className="text-[0.85rem] text-text-muted mt-0.5">Fill in the details to add a new user</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
          <Input id="firstName" label="First Name" placeholder="Enter first name" value={values.firstName} onChange={(val) => handleChange('firstName', val)} onBlur={() => handleBlur('firstName')} error={touched.firstName && errors.firstName} required />
          <Input id="lastName" label="Last Name" placeholder="Enter last name" value={values.lastName} onChange={(val) => handleChange('lastName', val)} onBlur={() => handleBlur('lastName')} error={touched.lastName && errors.lastName} required />

          {/* Date Picker */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="dateOfBirth" className="text-[0.8rem] font-semibold text-text-secondary uppercase tracking-[0.05em]">
              Date of Birth<span className="text-error ml-0.5">*</span>
            </label>
            <DatePicker
              id="dateOfBirth"
              selected={selectedDate}
              onChange={handleDateChange}
              onBlur={() => handleBlur('dateOfBirth')}
              dateFormat="MM/dd/yyyy"
              maxDate={new Date()}
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              placeholderText="Select date of birth"
              className={`
                w-full px-4 py-3 border-2 rounded-xl bg-input-bg text-text-primary text-[0.95rem]
                font-sans transition-all duration-300 outline-none
                focus:border-accent focus:shadow-[0_0_0_4px_var(--color-accent-glow)]
                ${touched.dateOfBirth && errors.dateOfBirth
                  ? 'border-error shadow-[0_0_0_4px_rgba(239,68,68,0.1)]'
                  : 'border-border'
                }
              `}
              autoComplete="off"
            />
            {touched.dateOfBirth && errors.dateOfBirth && (
              <div className="flex items-center gap-1.5 text-[0.8rem] text-error animate-[slideDown_0.2s_ease]">
                <svg className="shrink-0 w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errors.dateOfBirth}</span>
              </div>
            )}
          </div>

          <Input id="email" label="Email Address" type="email" placeholder="user@domain.com" value={values.email} onChange={(val) => handleChange('email', val)} onBlur={() => handleBlur('email')} error={touched.email && errors.email} required />

          {/* Location Row */}
          <div className="col-span-full grid grid-cols-2 gap-6 max-md:grid-cols-1">
            <Select id="country" label="Country" value={values.country} onChange={(val) => handleChange('country', val)} onBlur={() => handleBlur('country')} error={touched.country && errors.country} options={countryOptions} placeholder="Select country" required />
            <Select id="city" label="City" value={values.city} onChange={(val) => handleChange('city', val)} onBlur={() => handleBlur('city')} error={touched.city && errors.city} options={cityOptions} placeholder={loadingCities ? 'Loading cities...' : 'Select city'} disabled={!values.country || loadingCities} required />
          </div>

          {/* Submit Button */}
          <div className="col-span-full flex justify-end pt-2">
            <button
              id="submit-profile"
              type="submit"
              className="
                group relative inline-flex items-center gap-2.5 px-8 py-3.5
                bg-gradient-to-br from-accent to-[#06b6d4] text-white border-none rounded-xl
                text-[0.95rem] font-semibold font-sans cursor-pointer
                transition-all duration-300 shadow-[0_4px_16px_var(--color-accent-glow)]
                overflow-hidden
                hover:not-disabled:-translate-y-0.5 hover:not-disabled:shadow-[0_8px_24px_var(--color-accent-glow)]
                active:not-disabled:translate-y-0
                disabled:opacity-60 disabled:cursor-not-allowed
              "
              disabled={isSubmitting}
            >
              <span className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent opacity-0 group-hover:not-disabled:opacity-100 transition-opacity duration-300" />
              {isSubmitting ? (
                <>
                  <span className="relative z-10 w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-[spin_0.6s_linear_infinite]" />
                  <span className="relative z-10">Creating...</span>
                </>
              ) : (
                <>
                  <svg className="relative z-10 w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  <span className="relative z-10">Save Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
