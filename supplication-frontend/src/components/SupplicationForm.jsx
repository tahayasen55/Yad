import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.css';

const SupplicationForm = ({ currentSupplication, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    text: '',
    type: 'zikr',
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

    if (!formData.text || !formData.type) {
      toast.dismiss(); // Dismiss any existing toasts
      toast.error('تکایە هەموو خانەکان پڕ بکەوە');
      return;
    }

    onSave(formData);
    toast.dismiss(); // Dismiss any existing toasts
    toast.success(currentSupplication ? 'داواکردنەکە نوێکرایەوە' : 'داواکردنە نوێەکە زیادکرا', {
      onClose: () => {
        setFormData({
          text: '',
          type: 'zikr',
          description: { kurdish: '', arabic: '', english: '' },
        });
      }
    });
  };

  return (
    <div className="container my-4" dir="rtl">
      <h2 className="text-center mb-4">
        {currentSupplication ? 'دەستکاریکردنی دەق' : 'زیادکردنی دەقی نوێ'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label ">دەق:</label>
          <textarea
            type="text"
            className="form-control custom-font"
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
            <option value="fiqh">فیقهی</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">ڕونکردنەوەی کوردی:</label>
          <textarea
            type="text"
            className="form-control"
            name="description.kurdish"
            value={formData.description.kurdish}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">ڕونکردنەوەی عەرەبی:</label>
          <textarea
            type="text"
            className="form-control custom-font"
            name="description.arabic"
            value={formData.description.arabic}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">ڕونکردنەوەی ئینگلیزی:</label>
          <textarea
            type="text"
            className="form-control"
            name="description.english"
            value={formData.description.english}
            onChange={handleChange}
          />
        </div>
        <div className='text-center'>
        <button type="submit" className="btn btn-success m-2" >
          {currentSupplication ? 'نوێکردنەوە' : 'زیادکردن'}
        </button>
        <button type="button" className="btn btn-secondary m-2" onClick={onCancel}>
          پاشگەزبوونەوە
        </button>
        </div>

      </form>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={1}
      />
    </div>
  );
};

SupplicationForm.propTypes = {
  currentSupplication: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default SupplicationForm;