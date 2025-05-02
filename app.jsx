import { useState, useEffect } from 'react';
import axios from 'axios';

function AadharForm() {
  const [name, setName] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [address, setAddress] = useState('');
  const [details, setDetails] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Update existing aadhar
        await axios.put(`http://localhost:5000/aadhars/${editingId}`, {
          name,
          aadharNumber,
          address
        });
        setEditingId(null);
      } else {
        // Create new aadhar
        await axios.post('http://localhost:5000/aadhars', {
          name,
          aadharNumber,
          address
        });
      }

      setName('');
      setAadharNumber('');
      setAddress('');
      fetchDetails();
    } catch (err) {
      console.error('Error:', err);
      alert('Something went wrong');
    }
  };

  const fetchDetails = async () => {
    try {
      const res = await axios.get('http://localhost:5000/aadhars');
      setDetails(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setName(item.name);
    setAadharNumber(item.aadharNumber);
    setAddress(item.address);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/aadhars/${id}`);
      fetchDetails();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Aadhar Details</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Aadhar Number"
          className="w-full p-2 border"
          value={aadharNumber}
          onChange={(e) => setAadharNumber(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Address"
          className="w-full p-2 border"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">
          {editingId ? 'Update' : 'Submit'}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Submitted Details</h2>
        {details.map((item) => (
          <div key={item._id} className="border p-2 mb-2 flex justify-between items-center">
            <div>
              <p><strong>Name:</strong> {item.name}</p>
              <p><strong>Aadhar Number:</strong> {item.aadharNumber}</p>
              <p><strong>Address:</strong> {item.address}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="bg-yellow-400 text-white px-2 py-1"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="bg-red-500 text-white px-2 py-1"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AadharForm;
