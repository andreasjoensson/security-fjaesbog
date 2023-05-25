import React, { Component } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { gql } from "@apollo/client";
import "./admindashboard.scss";
import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useState } from "react";

const AdminDashboard = () => {
  // GraphQL query
  const GET_DASHBOARD_STATS = gql`
    query GetDashboardStats {
      getDashboardStats {
        dailyNewUsers
        weeklyNewUsers
        totalUsers
        topCommunity {
          name
          members
        }
        bannedUsers {
          name
          reason
          profilepic
        }
      }
    }
  `;

  const [trafficOptions] = useState({
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true,
    },
    legend: false,
  });
  const { loading, error, data } = useQuery(GET_DASHBOARD_STATS);
  const [trafficData, setTrafficData] = useState({});

  useEffect(() => {
    if (data && data.getDashboardStats) {
      const newTrafficData = {
        datasets: [
          {
            data: data.getDashboardStats.topCommunity.map((community) => {
              console.log("community", community.members);
              return community.members;
            }),
            backgroundColor: ["red", "blue", "green", "yellow", "orange"],
          },
        ],
        labels: data.getDashboardStats.topCommunity.map((community) => {
          console.log("community", community.name);
          return community.name;
        }),
      };

      console.log("trafficData", trafficData);
      setTrafficData(newTrafficData);
      console.log("trafficData", trafficData);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div className="page-header mt-5">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-home"></i>
          </span>{" "}
          Admin panel{" "}
        </h3>
        <nav aria-label="breadcrumb">
          <ul className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              <span></span>Oversigt{" "}
              <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
            </li>
          </ul>
        </nav>
      </div>
      <div className="row mt-3">
        <div className="col-md-4 stretch-card grid-margin">
          <div className="card bg-gradient-danger card-img-holder text-white">
            <div className="card-body">
              <img
                src={require("../../assets/images/dashboard/circle.png")}
                className="card-img-absolute"
                alt="circle"
              />
              <h4 className="font-weight-normal mb-3">
                Dagligt nye brugere{" "}
                <i className="mdi mdi-chart-line mdi-24px float-right"></i>
              </h4>
              <h2 className="mb-5">{data.getDashboardStats.dailyNewUsers}</h2>
              <h6 className="card-text">Stigning med 30%</h6>
            </div>
          </div>
        </div>
        <div className="col-md-4 stretch-card grid-margin">
          <div className="card bg-gradient-info card-img-holder text-white">
            <div className="card-body">
              <img
                src={require("../../assets/images/dashboard/circle.png")}
                className="card-img-absolute"
                alt="circle"
              />
              <h4 className="font-weight-normal mb-3">
                Ugentligt nye brugere{" "}
                <i className="mdi mdi-bookmark-outline mdi-24px float-right"></i>
              </h4>
              <h2 className="mb-5">{data.getDashboardStats.weeklyNewUsers}</h2>
              <h6 className="card-text">Stigning med 20%</h6>
            </div>
          </div>
        </div>
        <div className="col-md-4 stretch-card grid-margin">
          <div className="card bg-gradient-success card-img-holder text-white">
            <div className="card-body">
              <img
                src={require("../../assets/images/dashboard/circle.png")}
                className="card-img-absolute"
                alt="circle"
              />
              <h4 className="font-weight-normal mb-3">
                Brugere i alt{" "}
                <i className="mdi mdi-diamond mdi-24px float-right"></i>
              </h4>
              <h2 className="mb-5">{data.getDashboardStats.totalUsers}</h2>
              <h6 className="card-text">Stigning med 20%</h6>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-7 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="clearfix">
                <h4 className="card-title float-left">Bannede brugere</h4>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th> Bruger </th>
                        <th> Grund </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.getDashboardStats.bannedUsers.length > 0 ? (
                        data.getDashboardStats.bannedUsers.map((user) => {
                          return (
                            <tr>
                              <td>
                                <img
                                  src={
                                    user.profilepic
                                      ? user.profilepic
                                      : require("../../assets/images/faces/face1.jpg")
                                  }
                                  className="mr-2 me-2"
                                  alt="face"
                                />{" "}
                                {user.name}{" "}
                              </td>
                              <td> {user.reason} </td>
                            </tr>
                          );
                        })
                      ) : (
                        <p>Der er ingen bannede brugere endnu.</p>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-5 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Communities</h4>
              <Doughnut data={trafficData} options={trafficOptions} />
              <div
                id="traffic-chart-legend"
                className="rounded-legend legend-vertical legend-bottom-left pt-4"
              >
                <ul>
                  {loading ? (
                    <p>loader...</p>
                  ) : (
                    data.getDashboardStats.topCommunity.map((label, index) => {
                      return (
                        <li key={index}>
                          <span className="legend-dots bg-primary"></span>
                          {label.name}
                          <span className="ms-2 float-right">
                            {label.members} medlemmer
                          </span>
                        </li>
                      );
                    })
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
