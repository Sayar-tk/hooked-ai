import { useState } from "react";
import "../styles/PricingPage.css";
import { cashfree } from "../services/cashfree";
import axios from "axios";

const Pricing = () => {
  const [selectedCreditPlan, setSelectedCreditPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    customer_id: "CID" + Date.now(),
    customer_name: "",
    customer_email: "",
    customer_phone: "",
  });

  const creditPlans = {
    "100 credits - ₹99": 99,
    "300 credits - ₹279": 279,
    "500 credits - ₹449": 449,
  };

  const handleCreditPlanChange = (event) => {
    setSelectedCreditPlan(event.target.value);
  };

  const handleCustomerDetailsChange = (e) => {
    setCustomerDetails({
      ...customerDetails,
      [e.target.name]: e.target.value,
    });
  };

  const openModal = () => {
    if (!selectedCreditPlan) {
      alert("Please select a credit plan first.");
      return;
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getSessionId = async () => {
    if (!selectedCreditPlan || !creditPlans[selectedCreditPlan]) {
      throw new Error("Invalid credit plan selected.");
    }

    try {
      setLoading(true);
      console.log("Order amount:", creditPlans[selectedCreditPlan]);
      const response = await axios.post("http://localhost:5000/api/payment", {
        ...customerDetails,
        order_amount: creditPlans[selectedCreditPlan], // Dynamically set order amount
      });
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      console.error(
        "Error generating session ID:",
        error.response?.data || error.message
      );
      throw new Error("Failed to generate payment session ID.");
    }
  };

  const handlePaymentRedirect = async (e) => {
    e.preventDefault();
    try {
      const sessionId = await getSessionId();
      if (!sessionId) {
        throw new Error("Session ID is undefined.");
      }

      const checkoutOptions = {
        paymentSessionId: sessionId,
        returnUrl: "http://localhost:3000/yt-outlier",
      };

      const result = await cashfree.checkout(checkoutOptions);
      if (result.error) {
        console.error("Cashfree Checkout Error:", result.error.message);
        alert(result.error.message);
      } else if (result.redirect) {
        console.log("Redirection successful.");
      }
    } catch (error) {
      console.error("Payment redirect failed:", error);
      alert("An error occurred during the payment process.");
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (
      !customerDetails.customer_name ||
      !customerDetails.customer_email ||
      !customerDetails.customer_phone
    ) {
      alert("Please fill out all customer details.");
      return;
    }

    closeModal();
    handlePaymentRedirect(e);
  };

  return (
    <div className="pricing-container">
      <h1 className="pricing-title">Flexible Pricing for All Users</h1>
      <p className="pricing-subtitle">
        Pay only for what you use. Get started with free monthly credits, and
        upgrade anytime with our credit packs.
      </p>

      <div className="pricing-plans">
        {/* Free Plan */}
        <div className="plan-card">
          <h2 className="plan-title">Free Plan</h2>
          <p className="plan-price">Free</p>
          <ul className="plan-features">
            <li>20 credits/month</li>
            <li>Basic feature access</li>
            <li>Limited API calls</li>
          </ul>
          <button className="plan-button">Get Started</button>
        </div>

        {/* Credit Packs */}
        <div className="plan-card">
          <h2 className="plan-title">Credit Packs</h2>
          <ul className="plan-features">
            <li>100 credits: ₹99</li>
            <li>300 credits: ₹279</li>
            <li>500 credits: ₹449</li>
          </ul>
          <select
            className="credit-plan-dropdown"
            value={selectedCreditPlan}
            onChange={handleCreditPlanChange}
          >
            <option value="" disabled>
              Select a credit plan
            </option>
            {Object.keys(creditPlans).map((plan) => (
              <option key={plan} value={plan}>
                {plan}
              </option>
            ))}
          </select>
          {!loading ? (
            <button className="plan-button" onClick={openModal}>
              Top Up Credits
            </button>
          ) : (
            <button className="plan-button" disabled>
              Processing...
            </button>
          )}
        </div>
      </div>

      {/* Modal for Customer Details */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Enter Your Details</h2>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                name="customer_name"
                placeholder="Name"
                value={customerDetails.customer_name}
                onChange={handleCustomerDetailsChange}
                required
              />
              <input
                type="email"
                name="customer_email"
                placeholder="Email"
                value={customerDetails.customer_email}
                onChange={handleCustomerDetailsChange}
                required
              />
              <input
                type="tel"
                name="customer_phone"
                placeholder="Phone"
                value={customerDetails.customer_phone}
                onChange={handleCustomerDetailsChange}
                required
              />
              <button type="submit" className="plan-button">
                Proceed to Pay
              </button>
            </form>
            <button className="close-button" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Why Choose Credits Section */}
      <div className="why-credits">
        <h2>Why Choose Credits?</h2>
        <ul>
          <li>Pay-as-you-go flexibility</li>
          <li>No commitment</li>
          <li>Credits never expire</li>
        </ul>
      </div>
    </div>
  );
};

export default Pricing;
