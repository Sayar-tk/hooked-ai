import { useState, useEffect } from "react";
import "../styles/PricingPage.css";
import { cashfree } from "../services/cashfree";
import axios from "axios";
import { getDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { PricingPlans } from "../components/payment/PricingPlans";
import { CustomerDetailsModal } from "../components/payment/CustomerDetailsModal";
import { WhyChooseCredits } from "../components/payment/WhyChooseCredits";
import { updateCreditsWithExpiry } from "../services/firebase";

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
    "100 credits - ₹99": { credits: 100, price: 99 },
    "300 credits - ₹279": { credits: 300, price: 279 },
    "500 credits - ₹449": { credits: 500, price: 449 },
  };

  // Fetch user data from Firebase
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;

        if (!user) {
          console.error("User not authenticated.");
          return;
        }

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setCustomerDetails({
            ...customerDetails,
            customer_name: data.name || "",
            customer_email: data.email || "",
            customer_phone: data.phone || "",
          });
        } else {
          console.warn("No user data found in Firebase.");
        }
      } catch (error) {
        console.error("Error fetching user data from Firebase:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isModalOpen) fetchUserData();
  }, [isModalOpen]);

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
      alert("Please select a plan first.");
      return;
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getSessionId = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://urchin-app-iasht.ondigitalocean.app/api/payment",
        // "http://localhost:5000/api/payment",
        {
          ...customerDetails,
          order_amount: creditPlans[selectedCreditPlan]?.price,
        }
      );
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      console.error(
        "Error generating session ID:",
        error.response?.data || error.message
      );
      throw new Error("Failed to generate payment session ID");
    }
  };

  const handlePaymentRedirect = async () => {
    try {
      const sessionId = await getSessionId();
      if (!sessionId) {
        throw new Error("Session ID is undefined");
      }

      const checkoutOptions = {
        paymentSessionId: sessionId,
        returnUrl:
          "https://urchin-app-iasht.ondigitalocean.app/api/status/{order_id}",
        // "http://localhost:5000/api/status/{order_id}",
      };

      // Store selected credits in localStorage for use in PaymentSuccess
      localStorage.setItem(
        "selectedPlanCredits",
        creditPlans[selectedCreditPlan]?.credits || 0
      );

      const result = await cashfree.checkout(checkoutOptions);
      if (result.error) {
        console.error("Cashfree Checkout Error:", result.error.message);
        alert(result.error.message);
      } else if (result.redirect) {
        console.log("Redirection successful");

        // Add remaining credits to Firestore after successful payment
        await updateCreditsWithExpiry(
          creditPlans[selectedCreditPlan]?.credits,
          false
        );
      }
    } catch (error) {
      console.error("Payment redirect failed:", error);
      alert("An error occurred during the payment process.");
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
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
      <PricingPlans
        selectedCreditPlan={selectedCreditPlan}
        onPlanChange={handleCreditPlanChange}
        onOpenModal={openModal}
        loading={loading}
        creditPlans={creditPlans}
      />
      {isModalOpen && (
        <CustomerDetailsModal
          customerDetails={customerDetails}
          onChange={handleCustomerDetailsChange}
          onSubmit={handleFormSubmit}
          onClose={closeModal}
        />
      )}
      <WhyChooseCredits />
    </div>
  );
};
export default Pricing;
