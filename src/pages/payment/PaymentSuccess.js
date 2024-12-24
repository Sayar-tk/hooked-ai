import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateCreditsWithExpiry } from "../../services/firebase";

const PaymentSuccess = () => {
  const { orderId } = useParams(); // Get orderId from the URL
  const navigate = useNavigate();

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {
        // Retrieve credits based on the plan using localStorage or pass as a query param
        const credits = parseInt(
          localStorage.getItem("selectedPlanCredits"),
          10
        );

        if (!credits) {
          throw new Error("Credits information is missing.");
        }

        // Update user's credits in Firestore
        await updateCreditsWithExpiry(credits, false);

        // Redirect after a delay
        setTimeout(() => {
          navigate("/yt-outlier");
        }, 5000);
      } catch (error) {
        console.error("Error updating credits:", error);
        alert(
          "An error occurred while updating your credits. Please contact support."
        );
        navigate("/pricing"); // Redirect to the pricing page on error
      }
    };

    handlePaymentSuccess();
  }, [navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Payment Successful!</h1>
        <p style={styles.text}>Your payment has been processed successfully.</p>
        <p style={styles.text}>
          <strong>Order ID:</strong> {orderId ? orderId : "Not Available"}
        </p>
        <p style={styles.text}>
          You will be redirected to the home page shortly. If not,{" "}
          <span style={styles.link} onClick={() => navigate("/yt-outlier")}>
            click here
          </span>
          .
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4f4f9",
    padding: "20px",
  },
  card: {
    maxWidth: "500px",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "30px",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    marginBottom: "15px",
    color: "#2d3748",
  },
  text: {
    fontSize: "16px",
    marginBottom: "10px",
    color: "#4a5568",
  },
  link: {
    color: "#3182ce",
    textDecoration: "underline",
    cursor: "pointer",
  },
};

export default PaymentSuccess;
