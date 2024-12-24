const creditPlans = {
  "100 credits - ₹99": 99,
  "300 credits - ₹279": 279,
  "500 credits - ₹449": 449,
};

export const PricingPlans = ({
  selectedCreditPlan,
  onPlanChange,
  onOpenModal,
  loading,
}) => (
  <div className="pricing-plans">
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
        onChange={onPlanChange}
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
        <button className="plan-button" onClick={onOpenModal}>
          Top Up Credits
        </button>
      ) : (
        <button className="plan-button" disabled>
          Processing...
        </button>
      )}
    </div>
  </div>
);
