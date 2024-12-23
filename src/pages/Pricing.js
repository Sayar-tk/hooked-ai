import React, { useState } from "react";
import "../styles/PricingPage.css";

const Pricing = () => {
  const [selectedCreditPlan, setSelectedCreditPlan] = useState("");

  const handleCreditPlanChange = (event) => {
    setSelectedCreditPlan(event.target.value);
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
          <button
            className="plan-button"
            onClick={() =>
              alert(`You selected: ${selectedCreditPlan || "No plan selected"}`)
            }
          >
            Top Up Credits
          </button>
        </div>

        {/* Subscription Plans */}
        {/* <div className="plan-card">
          <h2 className="plan-title">Pro Subscription</h2>
          <ul className="plan-features">
            <li>$15/month: 200 credits</li>
            <li>$30/month: 500 credits</li>
            <li>Priority support</li>
          </ul>
          <button className="plan-button">Subscribe Now</button>
        </div> */}
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
