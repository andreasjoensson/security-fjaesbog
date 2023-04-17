import './registerstepper.css';
import { ContactPhoneOutlined, FaceOutlined, ImageOutlined, LockOutlined,LocationCityOutlined } from '@material-ui/icons';

export default function RegisterStepper({step}) {
    return (
<div className="progressContainer">
<ul className="progressList">

<li className={`progressItem ${step === 1 ? 'selected' : ''}`}>
<div className="progressText">
<p>Din info</p>
<span>Navn og alder</span>
</div>
<div className="progressIcon">
<FaceOutlined className="progressLogo"  fontSize="large"/>
</div>
</li>

<li className={`progressItem ${step === 2 ? 'selected' : ''}`}>
<div className="progressText">
<p>Din lokation</p>
<span>Land og skole</span>
</div>
<div className="progressIcon">
<LocationCityOutlined className="progressLogo"  fontSize="large"/>
</div>
</li>


<li className={`progressItem ${step === 3 ? 'selected' : ''}`}>
<div className="progressText">
<p>Billede</p>
<span>Profilbillede og cover</span>
</div>
<div className="progressIcon">
<ImageOutlined className="progressLogo"  fontSize="large"/>
</div>
</li>

<li className={`progressItem ${step === 4 ? 'selected' : ''}`}>
<div className="progressText">
<p>Kontakt</p>
<span>E-mail og tlf</span>
</div>
<div className="progressIcon">
<ContactPhoneOutlined className="progressLogo"  fontSize="large"/>
</div>
</li>

<li className={`progressItem ${step === 5 ? 'selected' : ''}`}>
<div className="progressText">
<p>Adgangskode</p>
<span>Indtast sikker adgangskode</span>
</div>
<div className="progressIcon">
<LockOutlined className="progressLogo"  fontSize="large"/>
</div>
</li>
</ul>
</div>
    )
}
