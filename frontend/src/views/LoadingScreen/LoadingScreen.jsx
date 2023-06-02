import React from "react";
import "./loadingscreen.css";

export default function LoadingScreen() {
  return (
    <div className="h-100 w-100 d-flex justify-content-center align-items-center">
      <div className="loadingContainer">
        <div class="spinner-border large-loading" role="status"></div>
      </div>
    </div>
  );
}
