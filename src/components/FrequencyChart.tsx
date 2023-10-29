import React, { useEffect } from 'react';
import { Chart} from 'chart.js/auto';

type FrequencyChartProps = {
  frequencies: number[];
};

const FrequencyChart: React.FC<FrequencyChartProps> = ({ frequencies }) => {
  useEffect(() => {
    let myChart: Chart<'line'> | undefined;

    const amplitude: number = 5;
    const frequency: number = 0.1;
    const phase: number = 0;

    const createChart = () => {
      const ctx = document.getElementById('frequencyChart') as HTMLCanvasElement | null;

      if (!ctx) return;

      const context = ctx.getContext('2d');

      if (!context) return;

      if (myChart) {
        myChart.destroy();
      }

      myChart = new Chart(context, {
        type: 'line',
        data: {
          labels: frequencies.map((_, index) => `${index + 1}`), // Using string labels for 'category' scale
          datasets: [{
            label: 'Frequency',
            data: frequencies.map((_, index) => frequencies[index] + amplitude * Math.sin(frequency * index + phase)),
            borderColor: 'orange',
            borderWidth: 3
          }]
        },
        options: {
          animation: {
            duration: 1000,
            easing: 'easeInOutElastic',
            loop: false
          }
        }
      });
    };

    createChart();

    const handleResize = () => createChart();

    // Handle window resize to recreate the chart
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (myChart) {
        myChart.destroy();
      }
    };
  }, [frequencies]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '300px' }}>
      <canvas id="frequencyChart" style={{ width: '100%', height: '100%' }}></canvas>
    </div>
  );
};

export default FrequencyChart;
