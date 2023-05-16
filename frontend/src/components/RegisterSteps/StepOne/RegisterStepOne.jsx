import "./registerstepone.css";
import { useState } from "react";
import validator from "validator";

export default function RegisterStepOne({
  nextStep,
  prevStep,
  handleChange,
  user,
  step,
  changeAge,
}) {
  //creating error state for validation
  const [error, setError] = useState(false);

  // after form submit validating the form data using validator
  const submitFormData = (e) => {
    e.preventDefault();

    // checking if value of first name and last name is empty show error else take to step 2
    if (validator.isEmpty(user.name) || validator.isEmpty(user.age)) {
      setError(true);
    } else {
      nextStep();
    }
  };

  return (
    <div className="regContainer h-100 align-items-center">
      <div className="registerContainer">
        <div className="formContainerRegister">
          <div className="registerText">
            <span className="step">Step {step}/5</span>
            <h1>Lad os starte med dit navn</h1>
            <p>Indtast dit navn og alder.</p>

            <div className="line"></div>
          </div>

          <div className="registerInput">
            <label>Indtast dit navn</label>
            <input
              type="text"
              style={{ border: error ? "2px solid red" : "" }}
              className="register-input"
              value={user.name}
              onChange={handleChange("name")}
            />

            <label>Indtast din fødseldsdato</label>
            <input
              type="date"
              style={{ border: error ? "2px solid red" : "" }}
              className="register-input"
              value={user.age}
              onChange={changeAge}
            />

            <div className="button-container d-flex justify-content-end">
              <button
                className="registerButton"
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
