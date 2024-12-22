import "../styles/PricingPage.css";
const Pricing = () => {
  const freePlanFeatures = [
    "Save up to 5 videos",
    "Basic video playback",
    "Limited support (Email only)",
  ];

  const paidPlanFeatures = [
    "Unlimited saved videos",
    "HD video playback",
    "Priority customer support (Email & Chat)",
    "Advanced analytics for saved videos",
    "Early access to new features",
  ];

  return (
    <div className="pricing-container">
      <h1>Pricing Plans</h1>
      <div className="pricing-plans">
        {/* Free Plan */}
        <div className="pricing-plan">
          <h2>Free Plan</h2>
          <ul>
            {freePlanFeatures.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          <button className="subscribe-button" disabled>
            Current Plan
          </button>
        </div>

        {/* Paid Plan */}
        <div className="pricing-plan">
          <h2>Paid Plan</h2>
          <ul>
            {paidPlanFeatures.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          <button
            className="subscribe-button"
            onClick={() => window.alert("Redirecting to payment gateway...")}
          >
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
