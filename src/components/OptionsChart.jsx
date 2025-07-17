import { useEffect, useRef, useState } from 'react';
import { createOptionsChart, LineSeries, LineType, LastPriceAnimationMode, LineStyle } from 'lightweight-charts';
import io from 'socket.io-client';

const OptionsChart = ({ height = 400, className = '' }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const lineSeries = useRef(null);
  const isInitialized = useRef(false);
  const [chartData, setChartData] = useState([]);
  const socketRef = useRef(null);
  const lastUpdateTime = useRef(0);
  const lastTimestamp = useRef(0);
   const resizeObserver = useRef<ResizeObserver | null>(null);

  const websocketCryptoUrl = process.env.HL_CRYPTO_v1_WS_SERVER;
  const apiCryptoUrl = process.env.HL_API_v1_SERVER;

  useEffect(() => {
    if (chartRef.current && !isInitialized.current) {
      try {
        console.log('Creating chart with ref:', chartRef.current);
        const chartOptions = {
            layout: {
              background: { color: '#1D293D' }, 
              textColor: '#90A1B9',
              fontSize: 15,
              attributionLogo: false
            },
            grid: { vertLines: { color: '#25293a' }, horzLines: { color: '#2d324d' } },
        };
        chartInstance.current = createOptionsChart(chartRef.current, chartOptions);

        if (chartInstance.current && typeof chartInstance.current.addSeries === 'function') {

          const seriesOptions = {
            lineWidth: 1.8,
            lineType: LineType.Curved,
            LineStyle: LineStyle.Dotted,
            color: '#c4fa02',
            priceRange: {
              minValue: 0.00001,
              maxValue: 0.1,
            },
            // margins: {
            //   above: 10,
            //   below: 10,
            //   left: 10
            // },

            // priceFormat : { type: 'price', precision: 5, minMove: 0.00001 },
            lastPriceAnimation: LastPriceAnimationMode.OnDataUpdate,

            priceScale: {
              right: {
                mode: 0,
              },
            },

            // timeScale: {
            //   leftOffset: 20, // Add 10 "bars" of empty space to the right
            //   // Adjust this number based on how much padding you need.
            // }

          }

          lineSeries.current = chartInstance.current.addSeries(LineSeries, seriesOptions);
          console.log('Line series added:', lineSeries.current);
        } else {
          throw new Error('addSeries is not a function on chart instance');
        }

        isInitialized.current = true;
      } catch (error) {
        console.error('Chart initialization error:', error);
      }

      //
      // Set up resize observer
      resizeObserver.current = new ResizeObserver((entries) => {
        if (entries[0] && chartInstance.current) {
          const { width, height } = entries[0].contentRect;
          chartInstance.current.resize(width, height);
        }
      });

      if (chartRef.current) {
        resizeObserver.current.observe(chartRef.current);
      }
      //

      return () => {
        if (chartInstance.current) {
          chartInstance.current.remove();
          chartInstance.current = null;
          lineSeries.current = null;
          isInitialized.current = false;
        }

        //
        if (resizeObserver.current && chartRef.current) {
          resizeObserver.current.unobserve(chartRef.current);
          resizeObserver.current.disconnect();
        }
        //
      };
    }
  }, []);

  useEffect(() => {
    if (!isInitialized.current || !chartInstance.current || !lineSeries.current) return;

    const initializeChart = async () => {
      try {
        const fetchHistoricalData = async () => {
          const currentTimeMs = Date.now();
          const endTime = currentTimeMs - 1;
          const startTime = endTime - 1500;
          const response = await fetch(`${apiCryptoUrl}/binance/historical?symbol=BTCUSDT&startTime=${startTime}&endTime=${endTime}&limit=300`);
          console.log(await response.json())
          if (!response.ok) throw new Error('Failed to fetch historical data');
          const candles = await response.json();
          return candles.map(candle => ({
            time: candle.close_time / 1000,
            value: candle.close,
          })) // Increased historical limit to 200
        };

        const historicalData = await fetchHistoricalData();
        let initialData = historicalData.length > 0 ? historicalData : [{ time: Math.floor(Date.now() / 1000) - 100, value: 96741 }];
        initialData = initialData.filter(d => typeof d.time === 'number' && !isNaN(d.time) && typeof d.value === 'number' && !isNaN(d.value));
        initialData = [...new Map(initialData.map(item => [item.time, item])).values()].sort((a, b) => a.time - b.time);
        console.log('Initial data:', initialData);
        setChartData(initialData);

        if (initialData.length > 0) {
          lineSeries.current.setData(initialData);
        }
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initializeChart();
  }, [isInitialized, chartInstance, lineSeries]);

  useEffect(() => {
    if (!isInitialized.current || !chartInstance.current || !lineSeries.current || chartData.length === 0) return;

    const validChartData = chartData.filter(d => typeof d.time === 'number' && !isNaN(d.time) && typeof d.value === 'number' && !isNaN(d.value));
    const uniqueValidData = [...new Map(validChartData.map(item => [item.time, item])).values()].sort((a, b) => a.time - b.time);
    //console.log('Updated data:', uniqueValidData);

    lineSeries.current.setData(uniqueValidData);
  }, [chartData, isInitialized, chartInstance, lineSeries]);

  useEffect(() => {
    if (!isInitialized.current || !chartInstance.current || !lineSeries.current) return;

    const setupWebSocket = () => {
      socketRef.current = io(`${websocketCryptoUrl}/hl_price`, {
        transports: ['websocket'],
        reconnectionAttempts: 5,
        reconnectionDelay: 5000,
      });

      socketRef.current.on('connect', () => {});
      socketRef.current.on('tradeUpdate', (data) => {
        if (!data || typeof data.value !== 'number') return;

        const price = data.value;
        let currentTime = Math.floor(Date.now() / 1000);
        if (currentTime <= lastTimestamp.current) currentTime = lastTimestamp.current + 1;
        lastTimestamp.current = currentTime;

        const newPoint = { time: currentTime, value: price };

        const now = Date.now();
        if (now - lastUpdateTime.current < 1000) return;

        lastUpdateTime.current = now;
        setChartData(prevData => {
          const newData = [...prevData, newPoint].sort((a, b) => a.time - b.time);
          const limitedData = newData.slice(-300); // Increased to 200 ticks
          //const limitedData = newData;

          const uniqueLimitedData = [...new Map(limitedData.map(item => [item.time, item])).values()].sort((a, b) => a.time - b.time);

          if (lineSeries.current && chartInstance.current) {
            lineSeries.current.setData(uniqueLimitedData);
          }

          return uniqueLimitedData;
        });
      });

      socketRef.current.on('connect_error', (error) => console.error('WebSocket connection error:', error.message));
      socketRef.current.on('disconnect', () => console.log('WebSocket disconnected'));

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    };

    const cleanup = setupWebSocket();
    return cleanup;
  }, [isInitialized, chartInstance, lineSeries]);

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div
        ref={chartRef}
        className={`w-full ${className}`}
        style={{ height }}
      />
    </div>
  );
};

export default OptionsChart;