import React from "react";
import "./loading.css";

export default function LoadingLogin() {
  return (
    <div className="spinner-container-submit">
      <div className="spinner"></div>
      <div className="spinner-message">Please login then add the product</div>
    </div>
  );
}
