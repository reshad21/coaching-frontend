// const PaymentStatus = () => {
//   return <div>PaymentStatus</div>;
// };

// export default PaymentStatus;


import React, { useState } from 'react';

// Mock payment data
const mockPayments = [
  {
    id: 'S001',
    name: 'Alice Johnson',
    month: 'March',
    amount: 120,
    date: '2025-03-05',
    method: 'cash',
    status: 'Paid',
  },
  {
    id: 'S002',
    name: 'Bob Smith',
    month: 'March',
    amount: 120,
    date: '2025-03-08',
    method: 'upi',
    status: 'Paid',
  },
  {
    id: 'S003',
    name: 'Charlie Brown',
    month: 'March',
    amount: 120,
    date: '',
    method: '',
    status: 'Unpaid',
  },
];

const PaymentStatus = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  const filteredPayments = mockPayments.filter(payment => {
    const searchMatch =
      payment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase());

    const filterMatch = paymentFilter
      ? payment.method.toLowerCase() === paymentFilter.toLowerCase()
      : true;

    return searchMatch && filterMatch;
  });

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Payment Status</h2>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Student Name or ID"
          className="border px-4 py-2 rounded w-full md:w-1/2"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <select
          className="border px-4 py-2 rounded w-full md:w-1/4"
          value={paymentFilter}
          onChange={e => setPaymentFilter(e.target.value)}
        >
          <option value="">All Payment Methods</option>
          <option value="cash">Cash</option>
          <option value="upi">UPI</option>
          <option value="card">Card</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border px-4 py-2">Student ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Month</th>
              <th className="border px-4 py-2">Amount (USD)</th>
              <th className="border px-4 py-2">Payment Date</th>
              <th className="border px-4 py-2">Method</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment, index) => (
                <tr key={index} className="text-center">
                  <td className="border px-4 py-2">{payment.id}</td>
                  <td className="border px-4 py-2">{payment.name}</td>
                  <td className="border px-4 py-2">{payment.month}</td>
                  <td className="border px-4 py-2">${payment.amount}</td>
                  <td className="border px-4 py-2">{payment.date || 'N/A'}</td>
                  <td className="border px-4 py-2 capitalize">{payment.method || 'N/A'}</td>
                  <td
                    className={`border px-4 py-2 font-semibold ${
                      payment.status === 'Paid' ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {payment.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentStatus;
