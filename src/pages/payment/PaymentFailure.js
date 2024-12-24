import React, { useEffect } from "react";

const PaymentFailure = () => {
  useEffect(() => {}, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>Payment Failed. Please try again.</div>
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
};

export default PaymentFailure;
