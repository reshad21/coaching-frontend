
import React, { useState } from 'react';

const AdmissionPayment = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    course: '',
    fee: '',
    paymentMethod: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted Admission Form:', formData);
    // You can send formData to your backend API here
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Student Admission Fee Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-600">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full border rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-600">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-600">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full border rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-600">Course Selected</label>
          <select
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
            className="w-full border rounded px-4 py-2"
          >
            <option value="">-- Select a Course --</option>
            <option value="math">Mathematics</option>
            <option value="science">Science</option>
            <option value="english">English</option>
            <option value="computer">Computer</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-gray-600">Admission Fee (USD)</label>
          <input
            type="number"
            name="fee"
            value={formData.fee}
            onChange={handleChange}
            required
            min="0"
            className="w-full border rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-600">Payment Method</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
            className="w-full border rounded px-4 py-2"
          >
            <option value="">-- Select Payment Method --</option>
            <option value="cash">Cash</option>
            <option value="cash">DBBL</option>
            <option value="card">Bkash</option>
            <option value="upi">Nogod</option>
          </select>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Submit Admission
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdmissionPayment;
