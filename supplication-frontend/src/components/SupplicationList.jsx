import PropTypes from 'prop-types'; // Ensure PropTypes is imported for prop validation
import { toast, ToastContainer } from 'react-toastify'; // Importing toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Importing toast styles

const SupplicationList = ({ supplications, onDelete, onEdit }) => {
  // Delete handler with confirmation
  const handleDelete = (id) => {
    if (window.confirm('ئايە دڵنیایت بۆ سڕینەوەی داواکردنەکە؟')) {
      onDelete(id);
      toast.success('داواکردنەکە بە سەرکەوتووی سڕدرایەوە');
    }
  };

  return (
    <div className="container my-4" dir="rtl">
      <h2 className="text-center mb-4">لیستی داواکردنەکان</h2>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>دەق</th>
            <th>جۆر</th>
            <th>پەسنی کوردی</th>
            <th>پەسنی عەرەبی</th>
            <th>پەسنی ئینگلیزی</th>
            <th>کردارەکان</th>
          </tr>
        </thead>
        <tbody>
          {supplications.map((supplication) => (
            <tr key={supplication._id}>
              <td>{supplication.text}</td>
              <td>{supplication.type}</td>
              <td>{supplication.description.kurdish}</td>
              <td>{supplication.description.arabic}</td>
              <td>{supplication.description.english}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => onEdit(supplication)}
                >
                  دەستکاریکردن
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(supplication._id)}
                >
                  سڕینەوە
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer /> {/* Add this line to render toast notifications */}
    </div>
  );
};

SupplicationList.propTypes = {
  supplications: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default SupplicationList;
