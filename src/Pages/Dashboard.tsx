// import React from 'react'

// import DemoPage from "@/app/payments/page";
import { PieCharts } from "@/components/chart-pie-donut-text"
import { HeartbeatChart } from "@/components/hearbeat-chart";
import { LineCharts } from "@/components/line-charts";
import { RadialCharts } from "@/components/radial-charts"
// import { Tooltips } from "@/components/tooltip-charts"
import Layouts from "@/Layout/Layout"
import { ErrorBoundary } from "react-error-boundary";
const Dashboard = () => {
    return (
        <ErrorBoundary fallback={<div>Something went wrong!</div>}>
            <Layouts>
                <div className="p-6">
                    <HeartbeatChart />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6  p-6 ">
                    <PieCharts />
                    <RadialCharts />
                    <LineCharts />
                </div>

                {/* <DemoPage /> */}
            </Layouts>
        </ErrorBoundary>
    );
};


export default Dashboard
