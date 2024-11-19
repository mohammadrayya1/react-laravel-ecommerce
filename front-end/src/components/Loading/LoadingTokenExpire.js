import React from "react";
import "./loading.css";

export default function LoadingTokenExpire() {
  return (
    <div className="spinner-container-submit">
      <div className="spinner"></div>
      <div className="spinner-message">
        Session has expired. Redirecting to login...
      </div>
    </div>
  );
}
