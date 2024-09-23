import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  useGetAllBookingsQuery,
} from "../../slice/ownerSlice/ownerApiSlice";
import Loader from "../../components/userComponents/Loader";
import "chart.js/auto";

function Chart() {
  const { data: bookings = [], isLoading, error } = useGetAllBookingsQuery();
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    if (bookings.length) {
      const theaterCount = {};
      bookings.forEach((booking) => {
        const theatreName = booking.theatre?.name || "Unknown";
        if (theaterCount[theatreName]) {
          theaterCount[theatreName]++;
        } else {
          theaterCount[theatreName] = 1;
        }
      });

      const sortedTheaters = Object.entries(theaterCount).sort(
        (a, b) => b[1] - a[1]
      );

      const topTheaters = sortedTheaters.slice(0, 5);

      while (topTheaters.length < 5) {
        topTheaters.push(["Empty", 0]);
      }

      const labels = topTheaters.map(([theatre]) => theatre);
      const data = topTheaters.map(([, count]) => count);

      setChartData({
        labels,
        datasets: [
          {
            label: "Number of Bookings",
            data,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    }
  }, [bookings]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <p>Error loading data...</p>;
  }

  return (
    <div>
      <h3 className="text-center text-warning">Top 5 Most Booked Theatres</h3>
      {chartData && chartData.labels ? (
        <Bar
          data={chartData}
          options={{
            scales: {
              y: {
                beginAtZero: true,
              },
            },
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "Theatres by Booking Count",
              },
            },
          }}
        />
      ) : (
        <p>No bookings data available</p>
      )}
    </div>
  );
}

export default Chart;
