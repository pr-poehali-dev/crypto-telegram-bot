import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

interface PriceChartProps {
  prices: number[];
  isPositive: boolean;
}

export default function PriceChart({ prices, isPositive }: PriceChartProps) {
  const labels = prices.map((_, i) => '');

  const data = {
    labels,
    datasets: [
      {
        data: prices,
        borderColor: isPositive ? 'rgba(74, 222, 128, 1)' : 'rgba(248, 113, 113, 1)',
        backgroundColor: isPositive
          ? 'rgba(74, 222, 128, 0.1)'
          : 'rgba(248, 113, 113, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: isPositive ? '#4ade80' : '#f87171',
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
        titleColor: '#fff',
        bodyColor: '#fff',
        displayColors: false,
        callbacks: {
          label: (context) => `$${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  return (
    <div className="w-full h-[200px] animate-fade-in">
      <Line data={data} options={options} />
    </div>
  );
}
