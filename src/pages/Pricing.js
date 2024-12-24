import { useState } from "react";
import "../styles/PricingPage.css";
import { cashfree } from "../services/cashfree";
import axios from "axios";

const Pricing = () => {
  const [selectedCreditPlan, setSelectedCreditPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreditPlanChange = (event) => {
    setSelectedCreditPlan(event.target.value);
  };

  const getSessionId = async () => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/payment");
      setLoading(false);
      console.log("Session ID:", response.data); // Debugging
      return response.data; // Return session ID
    } catch (error) {
      setLoading(false);
      console.error(
        "Error generating session ID:",
        error.response?.data || error.message
      );
      throw new Error("Failed to generate payment session ID");
    }
  };

  const handlePaymentRedirect = async (e) => {
    e.preventDefault();
    try {
      const sessionId = await getSessionId(); // Await session ID
      if (!sessionId) {
        throw new Error("Session ID is undefined");
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
        console.log("Redirection successful");
      }
    } catch (error) {
      console.error("Payment redirect failed:", error);
      alert("An error occurred during the payment process.");
    }
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
            <option value="100 credits - ₹99">100 credits - ₹99</option>
            <option value="300 credits - ₹279">300 credits - ₹279</option>
            <option value="500 credits - ₹449">500 credits - ₹449</option>
          </select>
          {!loading ? (
            <button className="plan-button" onClick={handlePaymentRedirect}>
              Top Up Credits
            </button>
          ) : (
            <button className="plan-button" disabled>
              Processing...
            </button>
          )}
        </div>
      </div>

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
