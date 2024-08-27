import { useState, useEffect } from 'react';
import axios from 'axios';
import SupplicationList from './components/SupplicationList';
import SupplicationForm from './components/SupplicationForm';

const App = () => {
  const [supplications, setSupplications] = useState([]);
  const [currentSupplication, setCurrentSupplication] = useState(null);

  useEffect(() => {
    fetchSupplications();
  }, []);

  // Function to fetch all supplications
  const fetchSupplications = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/supplications');
      setSupplications(response.data);
    } catch (error) {
      console.error('Error fetching supplications:', error);
    }
  };

  // Function to handle saving a new or updated supplication
  const handleSaveSupplication = async (supplication) => {
    try {
      if (supplication._id) {
        // Update existing supplication
        await axios.put(`http://localhost:5000/api/supplications/${supplication._id}`, supplication);
      } else {
        // Add new supplication
        await axios.post('http://localhost:5000/api/supplications/add', supplication); // Updated path for adding a new supplication
      }
      fetchSupplications();
      setCurrentSupplication(null);
    } catch (error) {
      console.error('Error saving supplication:', error.response ? error.response.data : error.message);
    }
  };

  // Function to handle editing a supplication
  const handleEditSupplication = (supplication) => {
    setCurrentSupplication(supplication);
  };

  // Function to handle deleting a supplication
  const handleDeleteSupplication = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/supplications/${id}`);
      fetchSupplications();
    } catch (error) {
      console.error('Error deleting supplication:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="App container mt-4">
      <SupplicationForm
        currentSupplication={currentSupplication}
        onSave={handleSaveSupplication}
        onCancel={() => setCurrentSupplication(null)}
      />
      <SupplicationList
        supplications={supplications}
        onDelete={handleDeleteSupplication}
        onEdit={handleEditSupplication}
      />
    </div>
  );
};

export default App;
