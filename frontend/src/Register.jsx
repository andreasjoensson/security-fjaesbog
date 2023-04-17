import './register.css'
import {uploadImage} from './firebase/index';
import {useState} from 'react';
import RegisterStepOne from './Register/RegisterStepOne';
import RegisterStepTwo from './Register/RegisterStepTwo';
import RegisterStepThree from './Register/RegisterStepThree';
import RegisterStepFour from './Register/RegisterStepFour';
import RegisterStepFive from './Register/RegisterStepFive';

function Register() {

const [user, setUser] = useState({
step:1,
name: '',
age: null,
school: '',
profilePic:'',
coverPic: '',
email: '',
phone: '',
password: '',
confirmPassword:''
})



const changeAge = e => {
setUser(prevState => ({
  ...prevState,
  age: e.target.value ? e.target.value : ''
}))
}

 // Proceed to next step
 const nextStep = () => {
    const { step } = user;
    setUser(prevState => ({
        ...prevState,
        step: step + 1
    }));
  };

  // Go back to prev step
  const prevStep = () => {
    const { step } = user;
    setUser(prevState => ({
        ...prevState,
        step: step - 1
    }));
  };

  const chooseSchool = school => {
    console.log(school)
    setUser(prevState => ({
      ...prevState,
      school:school
  }));
  }


  const changeProfilePic = pic => {
    setUser(prevState => ({
      ...prevState,
      profilePic: pic
    }))
  }

  const changeProfileCover = pic => {
    setUser(prevState => ({
      ...prevState,
      coverPic: pic
    }))
  }

  // Handle fields change
  const handleChange = input => e => {
    setUser(prevState => ({
        ...prevState,
        [input]: e.target.value
    }));
  };

const {step} = user;        
    switch (step) {
        case 1:
          return (
            <RegisterStepOne
              nextStep={nextStep}
              handleChange={handleChange}
              prevStep={prevStep}
              changeAge={changeAge}
              user={user}
              step={step}
            />
          );
        case 2:
          return (
             <RegisterStepTwo nextStep={nextStep} handleChange={handleChange} prevStep={prevStep}
             chooseSchool={chooseSchool} user={user} step={step}/>
          )
        case 3:
          return (
              <RegisterStepThree nextStep={nextStep} changeProfilePic={changeProfilePic} changeProfileCover={changeProfileCover} prevStep={prevStep}
              user={user} step={step}/>
          )
        case 4: 
        return(
            <RegisterStepFour nextStep={nextStep} handleChange={handleChange} prevStep={prevStep}
            user={user} step={step}/> 
        ) 
        case 5:
            return(
                <RegisterStepFive nextStep={nextStep} handleChange={handleChange} prevStep={prevStep}
                user={user} step={step}/>
            )
        default:
          (console.log('This is a multi-step form built with React.'))
    }
    
    }

export default Register
