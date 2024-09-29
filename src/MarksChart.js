// src/components/MarksChart.js
import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

// Register all necessary components
Chart.register(...registerables);

const MarksChart = ({ students }) => {
  // Prepare data for the chart
  const chartData = {
    labels: students.map((student) => student.name),
    datasets: [
      {
        label: "Total Marks",
        data: students.map((student) => student.totalMarks),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: 500, // Assuming the total marks are out of 500
      },
    },
  };

  return (
    <div className="container mt-5">
      <h2>Student Marks Distribution</h2>
      <div style={{
        height: "500px",
        width: "700px",
        margin: "auto",
      }}> 
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default MarksChart;
