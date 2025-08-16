"use client";

import CardPopularProducts from "./CardPopularProducts";
import SalesReport from "./SalesReport";
import LowInventoryReport from "./LowInventoryReport";

const Dashboard = () => {
  return (
    <div className="space-y-8 pb-4">
      {/* Existing Dashboard Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 xl:overflow-auto gap-10 custom-grid-rows">
        <CardPopularProducts />
      </div>

      {/* New Reports Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <SalesReport />
        <LowInventoryReport />
      </div>
    </div>
  );
};

export default Dashboard;