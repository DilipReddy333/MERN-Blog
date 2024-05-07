import React from "react";
import { useSearchParams } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import AllUsers from "../components/AllUsers";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  // console.log(searchParams.get("tab"));
  const tab = searchParams.get("tab");
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      {/* side bar */}
      <div className='md:w-56'>
        <DashSidebar />
      </div>
      {/* profile */}
      {tab === "profile" && <DashProfile />}
      {/* DashPosts */}
      {tab === "posts" && <DashPosts />}
      {/* All Users */}
      {tab === "allusers" && <AllUsers />}
    </div>
  );
};

export default Dashboard;
