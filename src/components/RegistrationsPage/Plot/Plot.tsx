import React, { lazy } from 'react';
import { Line } from 'react-chartjs-2';

// const ChartJS = lazy(() => import('react-chartjs-2'));

const data = {
  datasets: [
    {
      backgroundColor: "rgba(75,192,192,0.4)",
      borderCapStyle: "butt",
      borderColor: "rgba(75,192,192,1)",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      data: [65, 59, 80, 81, 56, 55, 40, 56, 4, 23, 67, 67, 56],
      fill: false,
      label: "My First dataset",
      lineTension: 0.1,
      pointBackgroundColor: "#fff",
      pointBorderColor: "rgba(75,192,192,1)",
      pointBorderWidth: 1,
      pointHitRadius: 10,
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointHoverRadius: 5,
      pointRadius: 1
    }
  ],
  labels: ["January", "February", "March", "April", "May", "June", "July"]
};

const Plot = () => {
  return (
    <div>
      <Line data={data} />
    </div>
  );
};

export default Plot;
