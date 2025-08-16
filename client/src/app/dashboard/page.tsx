"use client";


import CardPopularProducts from "./CardPopularProducts";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 xl:overflow-auto gap-10 pb-4 custom-grid-rows">
      <CardPopularProducts />
    </div>
  );
};

export default Dashboard;