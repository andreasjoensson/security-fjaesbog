import "./school.css";
import { useState } from "react";
import schoollogo from "../../assets/schoolicon.png";

export default function School({
  schools,
  loading,
  education,
  chooseSchool,
  error,
}) {
  const [isSelected, setIsSelected] = useState(-1);

  if (loading) {
    return (
      <div className="lds-circle">
        <div></div>
      </div>
    );
  }

  const handleError = (event) => {
    event.target.onerror = null; // We must ensure to reset onError, to avoid an infinite loop if the fallback image doesn't load.
    event.target.src = schoollogo;
  };

  return (
    <div className="grid-container">
      {schools?.map((post, i) => (
        <li
          key={i}
          style={{ border: error ? "2px solid red" : "" }}
          onClick={() => {
            setIsSelected(i);
            chooseSchool({
              Navn: post.Navn,
              Logo:
                education == "vidergående"
                  ? post.Logo
                  : `https://elevpraktik.dk/${post.Logo}`,
            });
          }}
          className={`list-group-item p-3 ${
            i == isSelected ? "activeSchool" : "inactive"
          }`}
        >
          <img
            src={
              education == "vidergående"
                ? post.Logo
                : `https://elevpraktik.dk/${post.Logo}`
            }
            onError={handleError}
          />
          <p>{post.Navn}</p>
        </li>
      ))}
    </div>
  );
}
