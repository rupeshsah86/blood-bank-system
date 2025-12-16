import { useState } from 'react';
import { donorService } from './donorService';
import Loader from '../../components/Loader';
import FormField from '../../components/FormField';
import { showToast } from '../../components/ToastContainer';
import { useFormValidation, validators } from '../../utils/validation';
import './Donor.css';

const AddDonor = ({ onDonorAdded }) => {
  const initialValues = {
    name: '',
    email: '',
    phone: '',
    bloodGroup: '',
    city: '',
    age: ''
  };

  const validationRules = {
    name: [validators.required, validators.minLength(2)],
    email: [validators.required, validators.email],
    phone: [validators.required, validators.phone],
    bloodGroup: [validators.required, validators.bloodType],
    city: [validators.required, validators.minLength(2)],
    age: [validators.required, validators.age]
  };

  const { values, errors, handleChange, handleBlur, validateAll, reset } = useFormValidation(initialValues, validationRules);
  const [loading, setLoading] = useState(false);

  const bloodGroups = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ];



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAll()) {
      showToast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      await donorService.addDonor(values);
      showToast.success('Donor added successfully!');
      reset();
      if (onDonorAdded) onDonorAdded();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to add donor';
      showToast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-donor">
      <div className="section-header">
        <h2>Add New Donor</h2>
        <p>Register a new blood donor in the system</p>
      </div>

      <form onSubmit={handleSubmit} className="donor-form">
        <div className="form-row flex-responsive">
          <FormField
            label="Full Name"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.name}
            required
            placeholder="Enter full name"
            className="form-group"
          />
          
          <FormField
            label="Email"
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            required
            placeholder="Enter email address"
            className="form-group"
          />
        </div>

        <div className="form-row flex-responsive">
          <FormField
            label="Phone Number"
            type="tel"
            name="phone"
            value={values.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.phone}
            required
            placeholder="Enter phone number"
            className="form-group"
          />
          
          <FormField
            label="Blood Group"
            type="select"
            name="bloodGroup"
            value={values.bloodGroup}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.bloodGroup}
            required
            options={bloodGroups}
            className="form-group"
          />
        </div>

        <div className="form-row flex-responsive">
          <FormField
            label="City"
            name="city"
            value={values.city}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.city}
            required
            placeholder="Enter city"
            className="form-group"
          />
          
          <FormField
            label="Age"
            type="number"
            name="age"
            value={values.age}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.age}
            required
            placeholder="Enter age (18-65)"
            className="form-group"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <Loader /> : 'Add Donor'}
        </button>
      </form>
    </div>
  );
};

export default AddDonor;