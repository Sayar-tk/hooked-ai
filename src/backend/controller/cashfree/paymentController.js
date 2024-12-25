const axios = require("axios");

const newOrderId = async (req, res) => {
  try {
    const options = {
      method: "POST",
      url: "https://api.cashfree.com/pg/orders",
      headers: {
        accept: "application/json",
        "x-api-version": "2023-08-01",
        "content-type": "application/json",
        "x-client-id": process.env.CASHFREE_CLIENT_ID,
        "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
      },
      data: {
        customer_details: {
          customer_id: req.body.customer_id,
          customer_email: req.body.customer_email,
          customer_phone: req.body.customer_phone,
          customer_name: req.body.customer_name,
        },
        order_meta: {
          // return_url: "http://localhost:3000/payment-success",
          notify_url:
            "https://webhook.site/0fd25cd0-935d-4071-ad59-15ce2e71f1ae",
          payment_methods: "cc,dc,upi",
        },
        order_id: "ORID665456" + Date.now(),
        order_amount: req.body.order_amount, // Use dynamic value
        order_currency: "INR",
        order_note: "Test order",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("Cashfree API Response:", response.data); // Log full response
        // console.log(response.data.payment_session_id);
        return res.status(200).send(response.data.payment_session_id);
      })
      .catch(function (error) {
        console.error("Error from Cashfree API:", error);
      });
  } catch (error) {
    // Axios-specific error handling
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error("Axios error response:", error.response.data);
      return res.status(error.response.status).send({
        message:
          error.response.data.message ||
          "An error occurred while processing the payment.",
        success: false,
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error("Axios error request:", error.request);
      return res.status(503).send({
        message:
          "No response received from the payment gateway. Please try again later.",
        success: false,
      });
    } else {
      // Something else caused the error
      console.error("Axios error:", error.message);
      return res.status(500).send({
        message: "An unexpected error occurred.",
        success: false,
      });
    }
  }
};

const checkStatus = async (req, res) => {
  const orderid = req.params.orderid;
  console.log(orderid);
  try {
    const options = {
      method: "GET",
      url: `https://api.cashfree.com/pg/orders/${orderid}`,
      headers: {
        accept: "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": process.env.CASHFREE_CLIENT_ID,
        "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        if (response.data.order_status === "PAID") {
          return res.redirect(
            `http://localhost:3000/payment-success/${orderid}`
          );
        } else if (response.data.order_status === "ACTIVE") {
          return res.redirect(
            `http://localhost:3000/pricing/${response.data.payment_session_id}`
          );
        } else {
          return res.redirect("http://localhost:3000/payment-failure");
        }
      })
      .catch(function (error) {
        return console.error(error);
      });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};

module.exports = {
  newOrderId,
  checkStatus,
};
