
import React, { useState } from 'react';

const MonthlyPayment = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    month: '',
    amount: '',
    paymentDate: '',
    paymentMethod: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Monthly Fee Data:', formData);
    // Send this data to your backend or store it
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Monthly Fee Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block mb-1 text-gray-600">Student ID</label>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            required
            className="w-full border rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-600">Student Name</label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            required
            className="w-full border rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-600">Month</label>
          <select
            name="month"
            value={formData.month}
            onChange={handleChange}
            required
            className="w-full border rounded px-4 py-2"
          >
            <option value="">-- Select Month --</option>
            {[
              'January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December'
            ].map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-gray-600">Amount (USD)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="0"
            className="w-full border rounded px-4 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-600">Payment Date</label>
          <input
            type="date"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={handleChange}
            required
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
            <option value="card">Card</option>
            <option value="upi">UPI</option>
          </select>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Submit Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default MonthlyPayment;
