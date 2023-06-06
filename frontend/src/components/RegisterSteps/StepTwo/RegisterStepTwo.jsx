import "./registersteptwo.css";
import { useState } from "react";
import folkeskoler from "../../../data/folkeskoler.json";
import gymnasier from "../../../data/gymnasier.json";
import vidergående from "../../../data/vidergående.json";
import Pagination from "../../.././components/Pagination/Paginations";
import School from "../../.././components/Schools/School";
import { Book, ChildCareOutlined } from "@material-ui/icons";
import { DirectionsBikeOutlined } from "@material-ui/icons";

export default function RegisterStepTwo({
  nextStep,
  prevStep,
  handleChange,
  user,
  chooseSchool,
  step,
}) {
  const [data, setData] = useState(gymnasier);
  const [loading, setLoading] = useState(false);
  const [chosenValue, setChosenValue] = useState("");
  const [educationValue, setEducationValue] = useState("");
  const [currentPage, setcurrentPage] = useState(1);
  const [itemsPerPage, setitemsPerPage] = useState(5);

  const [pageNumberLimit, setpageNumberLimit] = useState(5);
  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
  const [keyword, setKeyword] = useState("");
  const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const newData = data?.filter((data) => {
    if (keyword == null) return data;
    else if (data.Navn.toLowerCase().includes(keyword.toLowerCase())) {
      return data;
    }
  });

  const pages = [];
  for (let i = 1; i <= Math.ceil(newData.length / itemsPerPage); i++) {
    pages.push(i);
  }
  const handleClick = (event) => {
    setcurrentPage(Number(event.target.id));
  };

  const renderPageNumbers = pages.map((number) => {
    if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
      return (
        <li
          key={number}
          id={number}
          onClick={handleClick}
          className={currentPage == number ? "active" : null}
        >
          {number}
        </li>
      );
    } else {
      return null;
    }
  });

  const handleNextbtn = () => {
    setcurrentPage(currentPage + 1);

    if (currentPage + 1 > maxPageNumberLimit) {
      setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  };

  const handlePrevbtn = () => {
    setcurrentPage(currentPage - 1);

    if ((currentPage - 1) % pageNumberLimit == 0) {
      setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  };

  let pageIncrementBtn = null;
  if (pages.length > maxPageNumberLimit) {
    pageIncrementBtn = <li onClick={handleNextbtn}> &hellip; </li>;
  }

  let pageDecrementBtn = null;
  if (minPageNumberLimit >= 1) {
    pageDecrementBtn = <li onClick={handlePrevbtn}> &hellip; </li>;
  }

  const handleLoadMore = () => {
    setitemsPerPage(itemsPerPage + 5);
  };

  //creating error state for validation
  const [error, setError] = useState(false);

  // after form submit validating the form data using validator
  const submitFormData = (e) => {
    e.preventDefault();

    if (!user.school) {
      setError(true);
    } else {
      nextStep();
    }
  };

  const changeSchool = (value) => {
    switch (value) {
      case "folkeskole":
        setEducationValue("vidergående");
        setChosenValue("folkeskole");
        setData(folkeskoler);
        console.log("folkeskole");
        break;
      case "gymnasium":
        setEducationValue("gymnasium");
        setChosenValue("gymnasium");
        console.log("gymnasie");
        setData(gymnasier);
        break;
      case "vidergående":
        setEducationValue("vidergående");
        setChosenValue("vidergående");
        setData(vidergående);
        break;
    }
  };

  return (
    <div className="regContainer h-100 align-items-center">
      <div className="registerContainer">
        <div className="formContainerRegister">
          <div className="registerText">
            <span className="step">Step {step}/5</span>
            <h1>Hvilken skole går du på?</h1>
            <p>Søg efter den skole du går på.</p>

            <div className="line"></div>
          </div>

          <div className="registerAuto">
            <div className="options mt-3 mb-3">
              <div className="option">
                <ChildCareOutlined
                  style={{ cursor: "pointer" }}
                  onClick={() => changeSchool("folkeskole")}
                />
                <p>Folkeskole/Efterskole</p>
              </div>
              <div className="option">
                <DirectionsBikeOutlined
                  style={{ cursor: "pointer" }}
                  onClick={() => changeSchool("gymnasium")}
                />
                <p>Gymnasium</p>
              </div>

              <div className="option">
                <Book
                  style={{ cursor: "pointer" }}
                  onClick={() => changeSchool("vidergående")}
                />
                <p>Uni/Erhversuddanelse</p>
              </div>
            </div>

            <div className="searchInputCont">
              <label>Søg på skole</label>
              <input
                type="text"
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Niels Bro..."
                className="register-input"
              />
            </div>

            <School
              schools={newData.slice(indexOfFirstItem, indexOfLastItem)}
              loading={loading}
              error={error}
              chooseSchool={chooseSchool}
              education={educationValue}
            />
            <Pagination
              data={newData}
              handleClick={handleClick}
              itemsPerPage={itemsPerPage}
              pageDecrementBtn={pageDecrementBtn}
              handlePrevbtn={handlePrevbtn}
              renderPageNumbers={renderPageNumbers}
              pageIncrementBtn={pageIncrementBtn}
              handleNextbtn={handleNextbtn}
              currentPage={currentPage}
              handleLoadMore={handleLoadMore}
              pages={pages}
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
