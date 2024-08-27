import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SupplicationForm = ({ currentSupplication, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    text: '',
    type: 'zikr', // Default to 'zikr'
    description: { kurdish: '', arabic: '', english: '' },
  });

  useEffect(() => {
    if (currentSupplication) {
      setFormData(currentSupplication);
    }
  }, [currentSupplication]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('description.')) {
      const descKey = name.split('.')[1];
      setFormData((prevData) => ({
        ...prevData,
        description: { ...prevData.description, [descKey]: value },
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.text || !formData.type) {
      toast.error('تکایە هەموو خانەکان پڕ بکەوە');
      return;
    }

    onSave(formData);
    toast.success(currentSupplication ? 'داواکردنەکە نوێکرایەوە' : 'داواکردنە نوێەکە زیادکرا');
    setFormData({
      text: '',
      type: 'zikr', // Reset to default 'zikr' after saving
      description: { kurdish: '', arabic: '', english: '' },
    });
  };

  return (
    <div className="container my-4" dir="rtl">
      <h2 className="text-center mb-4">
        {currentSupplication ? 'دەستکاریکردنی داواکردن' : 'زیادکردنی داواکردنی نوێ'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">دەق:</label>
          <input
            type="text"
            className="form-control"
            name="text"
            value={formData.text}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">جۆر:</label>
          <select
            className="form-control"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="zikr">زیکر</option>
            <option value="hadith">حدیث</option>
            <option value="aya">ئایە</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">پەسنی کوردی:</label>
          <textarea
            type="text"
            className="form-control"
            name="description.kurdish"
            value={formData.description.kurdish}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">پەسنی عەرەبی:</label>
          <textarea
            type="text"
            className="form-control"
            name="description.arabic"
            value={formData.description.arabic}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">پەسنی ئینگلیزی:</label>
          <textarea
            type="text"
            className="form-control"
            name="description.english"
            value={formData.description.english}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-success me-2">
          {currentSupplication ? 'نوێکردنەوە' : 'زیادکردن'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          پاشگەزبوونەوە
        </button>
      </form>
      <ToastContainer /> {/* Add ToastContainer for notifications */}
    </div>
  );
};

SupplicationForm.propTypes = {
  currentSupplication: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default SupplicationForm;
