export const CustomerDetailsModal = ({
  customerDetails,
  onChange,
  onSubmit,
  onClose,
}) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Enter Your Details</h2>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="customer_name"
          placeholder="Name"
          value={customerDetails.customer_name}
          onChange={onChange}
          required
        />
        <input
          type="email"
          name="customer_email"
          placeholder="Email"
          value={customerDetails.customer_email}
          onChange={onChange}
          required
        />
        <input
          type="tel"
          name="customer_phone"
          placeholder="Phone"
          value={customerDetails.customer_phone}
          onChange={onChange}
          required
        />
        <button type="submit" className="plan-button">
          Proceed to Pay
        </button>
      </form>
      <button className="close-button" onClick={onClose}>
        Cancel
      </button>
    </div>
  </div>
);
