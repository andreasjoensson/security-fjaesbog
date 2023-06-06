import "./search.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { gql, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

export default function Search() {
  const [keyword, setKeyword] = useState("");
  const [newData, setNewData] = useState([]);

  const getAllQuery = gql`
    query Query {
      getAll {
        user {
          name
          profilepic
        }
        community {
          name
          description
          profilepic
        }
      }
    }
  `;

  const { data, loading, error } = useQuery(getAllQuery);

  useEffect(() => {
    if (!loading && data) {
      const combinedData = [...data.getAll.user, ...data.getAll.community];
      const filteredData = combinedData.filter((item) =>
        item.name.toLowerCase().includes(keyword.toLowerCase())
      );
      setNewData(filteredData);
    }
  }, [data, loading, keyword]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  console.log(newData);
  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar currentPage={"search"} />
        <div className="searchContainer mt-5">
          <div className="searchIntro">
            <h2>Søg efter en person eller community her</h2>

            <input
              type="text"
              placeholder="Søg efter et forum eller en person.."
              className="searchInput"
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="col-9">
              <LoadingScreen />
            </div>
          ) : (
            <div className="search-items col-9">
              {newData.map((item, i) =>
                item.description == null ? (
                  <a
                    className="searchItem"
                    key={i}
                    href={`/profile/${item.name}`}
                  >
                    <img
                      alt="Profilbillede til søgning"
                      src={
                        item.profilepic.length > 0
                          ? item.profilepic
                          : "https://www.pudsprodukter.dk/wp-content/uploads/2016/08/facebook-default-no-profile-pic.jpg"
                      }
                      className="searchPic"
                    />
                    <p>{item.name}</p>
                  </a>
                ) : (
                  <a className="searchItem" href={`/profile/${item.name}`}>
                    <img
                      alt="Profilbillede til søgning"
                      src={
                        item.profilepic.length > 0
                          ? item.profilepic
                          : "https://www.pudsprodukter.dk/wp-content/uploads/2016/08/facebook-default-no-profile-pic.jpg"
                      }
                      className="searchPic"
                    />
                    <p>{item.name}</p>
                    <p>{item.description}</p>
                  </a>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
