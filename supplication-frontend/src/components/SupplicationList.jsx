import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './style.css';

const SupplicationList = ({ supplications, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const filteredSupplications = supplications.filter((supplication) => {
    const searchString = searchTerm.toLowerCase();
    return (
      supplication.text.toLowerCase().includes(searchString) ||
      supplication.type.toLowerCase().includes(searchString) ||
      supplication.description.kurdish.toLowerCase().includes(searchString) ||
      supplication.description.arabic.toLowerCase().includes(searchString) ||
      supplication.description.english.toLowerCase().includes(searchString)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSupplications = filteredSupplications.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = (id) => {
    if (window.confirm('ئايە دڵنیایت بۆ سڕینەوەی داواکردنەکە؟')) {
      onDelete(id);
      toast.success('داواکردنەکە بە سەرکەوتووی سڕدرایەوە');
    }
  };

  return (
    <div className="container-fluid my-4" dir="rtl"> {/* Changed to container-fluid for more width */}
      <h2 className="text-center mb-4">لیستی دەقەکان</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="گەڕان بە ناوی دەق، جۆر، یان ڕونکردنەوە..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="table-responsive"> {/* Added for horizontal scrolling on small screens */}
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>دەق</th>
              <th>جۆر</th>
              <th>کوردی</th>
              <th>عەرەبی</th>
              <th>ئینگلیزی</th>
              <th>کردارەکان</th>
            </tr>
          </thead>
          <tbody>
            {currentSupplications.map((supplication, index) => (
              <tr key={supplication._id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td className='custom-font'>{supplication.text}</td>
                <td>{supplication.type}</td>
                <td>{supplication.description.kurdish}</td>
                <td className='custom-font'>{supplication.description.arabic}</td>
                <td>{supplication.description.english}</td>
                <td className='text-center'>
                  <tr>                  <button
                    className="btn btn-primary btn-sm mb-1"
                    onClick={() => onEdit(supplication)}
                  >
                    <FaEdit /> 
                  </button></tr>
                  <tr>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(supplication._id)}
                  >
                    <FaTrash /> 
                  </button>

                  </tr>


                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3">
        <p>کۆی گشتی: {filteredSupplications.length}</p>
      </div>
      <nav>
        <ul className="pagination justify-content-center">
          {Array.from(
            { length: Math.ceil(filteredSupplications.length / itemsPerPage) },
            (_, index) => (
              <li
                key={index + 1}
                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
              >
                <button onClick={() => paginate(index + 1)} className="page-link">
                  {index + 1}
                </button>
              </li>
            )
          )}
        </ul>
      </nav>
      <ToastContainer autoClose={3000} hideProgressBar />
    </div>
  );
};

SupplicationList.propTypes = {
  supplications: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default SupplicationList;