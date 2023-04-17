import './school.css';
import {useState} from 'react';

export default function School({ schools, loading, education,chooseSchool}) {
  const [isSelected, setIsSelected] = useState(-1);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className="grid-container">
      {schools?.map((post,i)=> (
        <li key={i} onClick={()=>{ setIsSelected(i); chooseSchool({Navn: post.Navn, Logo: education == 'vidergående' ? post.Logo : `https://elevpraktik.dk/${post.Logo}`})}}   className={`list-group-item ${i == isSelected ? "activeSchool" : "inactive"}`}>
              <img src={education == 'vidergående' ? post.Logo : `https://elevpraktik.dk/${post.Logo}`}/>
          <p>{post.Navn}</p>
        </li>
      ))}
        </div>
    )
}
