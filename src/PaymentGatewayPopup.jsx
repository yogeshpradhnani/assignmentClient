import React from "react";

export default function PaymentGatewayPopup({ onClose }) {
  // Closes the popup if clicking the overlay
  const handleOverlayClick = (e) => {
    if (e.target.id === "payment-overlay") {
      onClose();
    }
  };

  const handlePayNow = () => {
    alert("Payment Successful (Dummy)!");
    onClose(); // close the payment popup
  };

  return (
    <div
      id="payment-overlay"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full relative z-50">
        <h2 className="text-2xl font-bold mb-2">Dummy Payment Gateway</h2>
        <p className="text-gray-600 mb-4">Enter your payment details below:</p>

        {/* Card Number */}
        <input
          type="text"
          placeholder="Card Number"
          className="border p-2 w-full mb-2 rounded"
        />
        {/* Card Holder Name */}
        <input
          type="text"
          placeholder="Card Holder Name"
          className="border p-2 w-full mb-2 rounded"
        />
        {/* Expiry Date */}
        <input
          type="text"
          placeholder="Expiry Date (MM/YY)"
          className="border p-2 w-full mb-2 rounded"
        />
        {/* CVV */}
        <input
          type="text"
          placeholder="CVV"
          className="border p-2 w-full mb-2 rounded"
        />

        <div className="mt-4 flex justify-between">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handlePayNow}>
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}
