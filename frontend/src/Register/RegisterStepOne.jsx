import './registerstepone.css'
import logo from '../logo.png';
import RegisterStepper from './RegisterStepper'

export default function RegisterStepOne({nextStep,prevStep,handleChange,user,step, changeAge}) {
    console.log(user);
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
    <h1>Lad os starte med dit navn</h1>
    <p>Indtast dit navn og alder.</p>
    
    <div className="line"></div>
    </div>
    
    <div className="registerInput">
        
    <label>Indtast dit navn</label>
    <input type="text" className="register-input" onChange={handleChange('name')}/>

    <label>Indtast din fødseldsdato</label>
    <input type="date" className="register-input" onChange={changeAge}/>

    
    <button className="registerButton" onClick={() => nextStep()}>Videre</button>
    </div>
    
    
    </div>
            </div>
            </div>
            </div>
    )
}
