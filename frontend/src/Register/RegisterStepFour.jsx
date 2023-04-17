import './registerstepfour.css'
import RegisterStepper from './RegisterStepper'
import logo from '../logo.png';

export default function RegisterStepFour({nextStep,prevStep,handleChange,user,step}) {
    return (
        <div className="register">
        <div className="register-intro">
            <img src={logo}/>
        </div>
    <div className="regContainer">
        <RegisterStepper step={step}/>
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
    <input type="text" className="register-input" placeholder="Indtast en email.." onChange={handleChange('email')}/>

    <label>Telefon</label>
    <input type="text" className="register-input" placeholder="Indtast din alder.." onChange={handleChange('phone')}/>


    <button className="registerButton red" onClick={() => prevStep()}>Tilbage</button>
    <button className="registerButton" onClick={() => nextStep()}>Næste skrift</button>
    </div>
    
    
    </div>
            </div>
            </div>
            </div>
    )
}
