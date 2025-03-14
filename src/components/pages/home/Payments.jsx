import React from "react";
import { PaystackButton } from "react-paystack";

const config = {
  reference: new Date().getTime().toString(),
  email: "user@example.com",
  amount: 20000,
  publicKey: "pk_test_964844708948f6e10481cf3c2dc475e48c0e0e11",
};

function Payments() {
  // you can call this function anything
  const handlePaystackSuccessAction = (reference) => {
    // Implementation for whatever you want to do with reference and after success call.
    console.log(reference);
  };

  // you can call this function anything
  const handlePaystackCloseAction = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    console.log("closed");
  };

  const componentProps = {
    ...config,
    text: "Paystack Button Implementation",
    onSuccess: (reference) => handlePaystackSuccessAction(reference),
    onClose: handlePaystackCloseAction,
  };

  return (
    <div className="App">
      <button className="px-5 py-2 bg-green-500 text-white">
        <PaystackButton {...componentProps} />
      </button>
    </div>
  );
}

export default Payments;
