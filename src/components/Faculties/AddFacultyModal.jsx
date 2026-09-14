import React, { useEffect, useState } from 'react';
import styles from './AddFacultyModal.module.css';
import cities from './cities.json';
const AddFacultyModal = ({ isOpen, onClose, onSave, facultyToBeUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: '',
    region: '',
    city: '',
    address: '',
    email: '',
    phoneNumber: '',
    establishedYear: ''
  });

  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState('basic');
  useEffect(()=>{
    if(facultyToBeUpdated != null){
      const {name, code, type, region, city, address, email, phoneNumber, establishedYear} = facultyToBeUpdated;
      setFormData({name, code, type, region, city, address, email, phoneNumber, establishedYear});
    }
  },[]);
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Faculty name is required';
        } else {
          delete newErrors.name;
        }
        break;

      case 'code':
        if (!value.trim()) {
          newErrors.code = 'Faculty code is required';
        } else {
          delete newErrors.code;
        }
        break;

      case 'type':
        if (!value) {
          newErrors.type = 'Faculty type is required';
        } else {
          delete newErrors.type;
        }
        break;

      case 'city':
        if (!value) {
          newErrors.city = 'City is required';
        } else {
          delete newErrors.city;
        }
        break;
      
      case 'region':
        if (!value) {
          newErrors.region = 'Region is required';
        } else {
          delete newErrors.region;
        }
        break;

      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        }
        else if (value && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          newErrors.email = 'Invalid email format';
        } else {
          delete newErrors.email;
        }
        break;

        case 'address':
          if (!value.trim()) {
            newErrors.address = 'Address  is required';
        } else {
          delete newErrors.address;
        }
        break;

      case 'establishedYear':
        if (value && (value < 1800 || value > new Date().getFullYear())) {
          newErrors.establishedYear = 'Please enter a valid year';
        } else {
          delete newErrors.establishedYear;
        }
        break;

      case 'phoneNumber':
        if (value && !/^\+?[0-9]{1,4}?[-.\s()]?(\d{1,15}([-\s()]?\d{1,15})*)$/.test(value)) {
          newErrors.phoneNumber = 'Invalid phoneNumber format';
        } else {
          delete newErrors.phoneNumber;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation
    if (errors[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    // Validate all required fields
    const requiredFields = ['name', 'code', 'type', 'city', 'region', 'address', 'email'];
    const newErrors = {};
    
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    if (formData.email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare data for submission
    const submissionData = {
      ...formData,
      phoneNumber: formData.phoneNumber || null,
      establishedYear: formData.establishedYear ? parseInt(formData.establishedYear) : null
    };

    await onSave(submissionData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      code: '',
      type: '',
      region: '',
      city: '',
      address: '',
      email: '',
      phoneNumber: '',
      establishedYear: ''
    });
    setErrors({});
    setActiveSection('basic');
    onClose();
  };

  const isFormValid = () => {
    const requiredFields = ['name', 'code', 'type', 'city', 'region' ,'address', 'email'];
    return requiredFields.every(field => formData[field].trim()) && 
           Object.keys(errors).length === 0;
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{facultyToBeUpdated === null ? "Create New Faculty" : "Update Faculty"}</h2>
          <button 
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className={styles.sectionTabs}>
          <button
            className={`${styles.tab} ${activeSection === 'basic' ? styles.activeTab : ''}`}
            onClick={() => setActiveSection('basic')}
          >
            👤 Basic Information
          </button>
          <button
            className={`${styles.tab} ${activeSection === 'additional' ? styles.activeTab : ''}`}
            onClick={() => setActiveSection('additional')}
          >
            📋 Additional Information
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formContent}>
            {/* Basic Information Section */}
            {activeSection === 'basic' && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Essential Details</h3>
                <p className={styles.sectionDescription}>
                  {facultyToBeUpdated === null ?
                  "Fill in the required information to create a new faculty.":
                  "Review and update the faculty information as needed."}
                </p>

                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Faculty Name <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    placeholder="e.g., Faculty of Sciences Ben M'Sik"
                  />
                  {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
                  <div className={styles.helperText}>
                    Official name of the faculty as it appears in documents
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="code" className={styles.label}>
                      Faculty Code <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`${styles.input} ${errors.code ? styles.inputError : ''}`}
                      placeholder="e.g., FSBM"
                      maxLength="10"
                    />
                    {errors.code && <span className={styles.errorMessage}>{errors.code}</span>}
                    <div className={styles.helperText}>
                      Unique identifier, max 10 characters
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="type" className={styles.label}>
                      Type <span className={styles.required}>*</span>
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`${styles.select} ${errors.type ? styles.inputError : ''}`}
                    >
                      <option value="">Select type</option>
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                    {errors.type && <span className={styles.errorMessage}>{errors.type}</span>}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="city" className={styles.label}>
                      City <span className={styles.required}>*</span>
                    </label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={styles.select}
                    >
                      <option value="">Select city</option>
                      {cities.map((item,index)=>(
                            <option value={item.names.en} key={index}>{item.names.en}</option>
                        ))}
                    </select>
                    {errors.city && <span className={styles.errorMessage}>{errors.city}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="region" className={styles.label}>
                      Region <span className={styles.required}>*</span>
                    </label>
                    <select
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={styles.select}
                    >
                      <option value="">Select region</option>
                      <option value="casablanca/settat">Casablanca-Settat</option>
                      <option value="rabat/sale/kenitra">Rabat-Salé-Kénitra</option>
                      <option value="marrakech/safi">Marrakech-Safi</option>
                      <option value="fes/meknes">Fès-Meknès</option>
                      <option value="tangier/tetouan/alhoceima">Tanger-Tétouan-Al Hoceïma</option>
                      <option value="beni_mellal/khenifra">Béni Mellal-Khénifra</option>
                      <option value="daraa/tafilalet">Drâa-Tafilalet</option>
                      <option value="souss/massa">Souss-Massa</option>
                      <option value="guelmim/oued_noun">Guelmim-Oued Noun</option>
                      <option value="laayoune/sakia_el_hamra">Laâyoune-Sakia El Hamra</option>
                      <option value="dakhla/oued_ed_dahab">Dakhla-Oued Ed-Dahab</option>
                    </select>
                    {errors.region && <span className={styles.errorMessage}>{errors.region}</span>}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="address" className={styles.label}>
                    📍 Address <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${errors.address ? styles.inputError : ''}`}
                    placeholder="e.g., Moulay Rachid, Casablanca"
                  />
                  {errors.address && <span className={styles.errorMessage}>{errors.address}</span>}
                  <div className={styles.helperText}>
                    Full physical address of the faculty
                  </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>
                      📧 Email <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                      placeholder="e.g., fsbm@gmail.com"
                    />
                    {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                  </div>
              </div>
            )}

            {/* Additional Information Section */}
            {activeSection === 'additional' && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Additional Details</h3>
                <p className={styles.sectionDescription}>
                  Optional information that can be added later.
                </p>

                

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="phoneNumber" className={styles.label}>
                      ☎️ Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={styles.input}
                      placeholder="e.g., +212 522-123456"
                    />
                    {errors.phoneNumber && <span className={styles.errorMessage}>{errors.phoneNumber}</span>}
                  </div>

          <div className={styles.formGroup}>
                  <label htmlFor="establishedYear" className={styles.label}>
                    📅 Established Year
                  </label>
                  <input
                    type="number"
                    id="establishedYear"
                    name="establishedYear"
                    value={formData.establishedYear}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${errors.establishedYear ? styles.inputError : ''}`}
                    placeholder="e.g., 1975"
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                  {errors.establishedYear && (
                    <span className={styles.errorMessage}>{errors.establishedYear}</span>
                  )}
                  <div className={styles.helperText}>
                    Year when the faculty was established
                  </div>
                </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className={styles.formActions}>
            <div className={styles.navigationButtons}>
              {activeSection === 'additional' && (
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => setActiveSection('basic')}
                >
                  ← Back to Basic Info
                </button>
              )}
              {activeSection === 'basic' && (
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => setActiveSection('additional')}
                >
                  Additional Info →
                </button>
              )}
            </div>

            <div className={styles.actionButtons}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={!isFormValid()}
              >
                ✅ Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFacultyModal;