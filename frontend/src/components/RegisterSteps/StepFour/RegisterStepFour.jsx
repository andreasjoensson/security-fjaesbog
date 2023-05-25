import "./registerstepfour.css";
import { useState } from "react";
import validator from "validator";

export default function RegisterStepFour({
  nextStep,
  prevStep,
  handleChange,
  user,
  step,
}) {
  //creating error state for validation
  const [error, setError] = useState(false);

  // after form submit validating the form data using validator
  const submitFormData = (e) => {
    e.preventDefault();

    // checking if value of first name and last name is empty show error else take to step 2
    if (validator.isEmpty(user.phone) || validator.isEmpty(user.email)) {
      console.log("fejl");
      setError(true);
    } else {
      console.log("all good");
      nextStep();
    }
  };

  return (
    <div className="regContainer h-100 align-items-center">
      <div className="registerContainer">
        <div className="formContainerRegister">
          <div className="registerText">
            <span className="step">Step {step}/5</span>
            <h1>E-mail og tlf nummer</h1>
            <p>Indtast venligst dit nummer og email</p>

            <div className="line"></div>
          </div>

          <div className="registerInput">
            <label>E-mail</label>
            <input
              style={{ border: error ? "2px solid red" : "" }}
              type="text"
              className="register-input"
              placeholder="Indtast en email.."
              onChange={handleChange("email")}
              value={user.email}
            />

            <label>Telefon</label>
            <input
              style={{ border: error ? "2px solid red" : "" }}
              type="text"
              className="register-input"
              placeholder="Indtast dit telefonnummer.."
              onChange={handleChange("phone")}
              value={user.phone}
            />

            <div className="button-container d-flex justify-content-end">
              <button className="registerButton red" onClick={() => prevStep()}>
                Tilbage
              </button>
              <button
                className="registerButton ms-3"
                onClick={(e) => submitFormData(e)}
              >
                Videre
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
