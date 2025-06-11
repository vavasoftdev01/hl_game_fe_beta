// import { useEffect, useRef, useState } from 'react';
// import { createChart, AreaSeries, LineType, LastPriceAnimationMode, LineStyle, createTextWatermark, createSeriesMarkers } from 'lightweight-charts';
// import io from 'socket.io-client';

// // Log the version of lightweight-charts to verify compatibility
// import pkg from 'lightweight-charts/package.json';
// console.log('Lightweight Charts version:', pkg.version);

// const BaselineChart = ({ height = 400, className = '' }) => {
//   const chartRef = useRef(null);
//   const chartInstance = useRef(null);
//   const areaSeries = useRef(null);
//   const isInitialized = useRef(false);
//   const [chartData, setChartData] = useState([]);
//   const [markers, setMarkers] = useState([]); // State to store markers
//   const socketRef = useRef(null);
//   const renderSync = useRef(0);
//   const lastUpdateTime = useRef(0);
//   const lastTimestamp = useRef(0);
//   const textWatermark = useRef(null); // Ref to store watermark for reference

//   const TOTAL_TIME_SPAN_S = 1; // 1 second historical range
//   const SENSITIVITY = '.100'; // Zoomed-in sensitivity
//   const TICK_INTERVAL_MS = 500; // 600ms throttle for updates
//   const VISIBLE_TICKS = 50; // Number of visible ticks
//   const VISIBLE_DATA = -100; // Last 30 points

//   const backendApiUrl = 'http://localhost:3000';
//   const websocketUrl = 'http://localhost:8080/hl_price';

//   const resize = () => {
//     if (chartInstance.current && chartRef.current) {
//       chartInstance.current.resize(chartRef.current.offsetWidth, height);
//     }
//   };

//   const addMarker = () => {
//     if (areaSeries.current && chartInstance.current && chartData.length > 0) {
//       const latestData = chartData[chartData.length - 1];
//       const newMarker = {
//         time: latestData.time, // Set marker time to the latest tick's timestamp
//         position: 'inBar', // Centered position within the bar
//         color: '#fff',
//         shape: 'square',
//         text: `Price: ${latestData.value.toFixed(2)} 🏳️🏳️🏳️ `,
//       };
//       // Append the new marker to the existing ones
//       setMarkers((prevMarkers) => {
//         const updatedMarkers = [...prevMarkers, newMarker];
//         return updatedMarkers;
//       });
//       console.log('Marker added at latest tick time:', latestData.time, 'with price:', latestData.value);
//     } else {
//       console.warn('Cannot add marker: No series, chart instance, or data available');
//     }
//   };

//   const clearMarkers = () => {
//     if (areaSeries.current) {
//       setMarkers([]); // Reset markers state to empty array
//       console.log('Markers cleared from state');
//     } else {
//       console.warn('Cannot clear markers: No series available');
//     }
//   };

//   // Effect to sync markers with the chart
//   useEffect(() => {
//     if (areaSeries.current && markers.length === 0 && chartInstance.current) {
//       createSeriesMarkers(areaSeries.current, []); // Clear markers when state is empty
//       console.log('Markers cleared from chart');
//     } else if (areaSeries.current && markers.length > 0 && chartInstance.current) {
//       createSeriesMarkers(areaSeries.current, markers); // Update chart with current markers
//       console.log('Markers updated on chart:', markers.length);
//     }
//   }, [markers, areaSeries.current, chartInstance.current]);

//   useEffect(() => {
//     if (chartRef.current && !isInitialized.current && chartRef.current.offsetWidth > 0) {
//       try {
//         chartInstance.current = createChart(chartRef.current, {
//           width: chartRef.current.offsetWidth,
//           height,
//           layout: { background: { color: '#25293a' }, textColor: '#e0e0e0' },
//           grid: { vertLines: { color: '#2d324d' }, horzLines: { color: '#2d324d' } },
//           timeScale: {
//             timeVisible: true,
//             rightOffset: 20,
//             barSpacing: 10,
//             fixLeftEdge: true,
//             autoScale: true,
//           },
//           priceScale: {
//             autoScale: true,
//             position: 'right',
//             barSpacing: 20
//           },
//           handleScroll: true,
//           handleScale: true,
//         });

//         const seriesOptions = {
//           topLineColor: '#ce03fc',
//           topFillColor1: 'rgba(206, 3, 252, 0.8)',
//           topFillColor2: 'rgba(206, 3, 252, 0.2)',
//           bottomLineColor: 'rgba(206, 3, 252, 0.1)',
//           bottomFillColor1: 'rgba(206, 3, 252, 0.05)',
//           bottomFillColor2: 'rgba(206, 3, 252, 0)',
//           lineWidth: 2,
//           lineType: LineType.Curved,
//           lastPriceAnimation: LastPriceAnimationMode.OnDataUpdate,
//           lineStyle: LineStyle.Solid,
//         };

//         // Add watermark to the first pane if it exists
//         if (chartInstance.current.panes().length > 0) {
//           textWatermark.current = createTextWatermark(chartInstance.current.panes()[0], {
//             horzAlign: 'center',
//             vertAlign: 'center',
//             lines: [
//               {
//                 text: 'KBCGAME - BTCUSDT',
//                 color: 'rgba(245, 241, 243, 0.1)',
//                 fontSize: 35,
//               },
//             ],
//           });
//           console.info('Watermark added:', textWatermark.current);
//         } else {
//           console.warn('No panes available for watermark');
//         }

//         areaSeries.current = chartInstance.current.addSeries(AreaSeries, seriesOptions);
//         console.log('Area series added with options:', seriesOptions);

//         // Force a redraw to ensure watermark renders
//         chartInstance.current.resize(chartRef.current.offsetWidth, height);
//         chartInstance.current.timeScale().fitContent();

//         window.addEventListener('resize', resize);

//         isInitialized.current = true;
//         console.log('Chart initialization complete');
//       } catch (error) {
//         console.error('Chart initialization error:', error);
//       }

//       return () => {
//         console.log('Cleaning up chart...');
//         window.removeEventListener('resize', resize);
//         if (chartInstance.current) {
//           // chart.remove() should clean up the watermark automatically
//           chartInstance.current.remove();
//           console.log('Chart and watermark cleaned up');
//           chartInstance.current = null;
//           areaSeries.current = null;
//           textWatermark.current = null; // Clear reference
//           isInitialized.current = false;
//         }
//       };
//     }
//   }, [height]);

//   useEffect(() => {
//     if (!isInitialized.current || !chartInstance.current || !areaSeries.current) {
//       console.log('Waiting for chart to be initialized...', {
//         isInitialized: isInitialized.current,
//         chartInstance: !!chartInstance.current,
//         areaSeries: !!areaSeries.current,
//       });
//       return;
//     }

//     const initializeChart = async () => {
//       try {
//         const fetchHistoricalData = async () => {
//           const currentTimeMs = Date.now();
//           const endTime = currentTimeMs - 1;
//           const startTime = endTime - (TOTAL_TIME_SPAN_S * 1000);

//           console.log(`Fetching historical data: start=${startTime}, end=${endTime}`);

//           const response = await fetch(
//             `${backendApiUrl}/binance/historical?symbol=BTCUSDT&startTime=${startTime}&endTime=${endTime}&limit=100`
//           );
//           if (!response.ok) throw new Error('Failed to fetch historical data');
//           const candles = await response.json();

//           console.log('Historical data:', candles);

//           const mappedData = candles.map(candle => ({
//             time: candle.close_time / 1000,
//             value: candle.close * SENSITIVITY,
//           }));

//           return mappedData.slice(-20);
//         };

//         const historicalData = await fetchHistoricalData();
//         const timeWindowStart = Math.min(...historicalData.map(d => d.time));

//         let initialData = historicalData.length > 0 ? historicalData : [{ time: Math.floor(Date.now() / 1000) - 100, value: 96741 * SENSITIVITY }];
//         initialData = initialData.filter(d => typeof d.time === 'number' && !isNaN(d.time) && typeof d.value === 'number' && !isNaN(d.value));
//         if (initialData.length === 0) {
//           console.warn('No valid historical data, using fallback');
//           //initialData = [{ time: Math.floor(Date.now() / 1000) - 100, value: 96741 * SENSITIVITY }];
//         }

//         // Ensure initial data is sorted and unique
//         initialData = [...new Map(initialData.map(item => [item.time, item])).values()].sort((a, b) => a.time - b.time);

//         console.log('Setting initial data:', initialData);
//         setChartData(initialData);

//         const validInitialData = initialData.filter(
//           d => typeof d.time === 'number' && !isNaN(d.time) && typeof d.value === 'number' && !isNaN(d.value)
//         );

//         if (validInitialData.length > 0) {
//           console.log('Applying initial chart data:', validInitialData);
//           areaSeries.current.setData(validInitialData);
//           const totalTimeSpan = Math.max(...validInitialData.map(d => d.time)) - Math.min(...validInitialData.map(d => d.time)) || TOTAL_TIME_SPAN_S;
//           const tickInterval = totalTimeSpan / VISIBLE_TICKS;
//           chartInstance.current.timeScale().setVisibleRange({
//             from: Math.min(...validInitialData.map(d => d.time)),
//             to: Math.min(...validInitialData.map(d => d.time)) + (tickInterval * VISIBLE_TICKS),
//           });
//           renderSync.current += 1;
//         } else {
//           console.warn('No valid initial data to set on chart');
//         }
//       } catch (error) {
//         console.error('Initialization error:', error);
//       }
//     };

//     initializeChart();
//   }, [isInitialized, chartInstance, areaSeries]);

//   useEffect(() => {
//     if (!isInitialized.current || !chartInstance.current || !areaSeries.current || chartData.length === 0) {
//       console.log('Waiting for data to be applied...', {
//         isInitialized: isInitialized.current,
//         chartInstance: !!chartInstance.current,
//         areaSeries: !!areaSeries.current,
//         chartDataLength: chartData.length,
//       });
//       return;
//     }

//     const timeWindowStart = Math.min(...chartData.map(d => d.time));

//     try {
//       const validChartData = chartData.filter(
//         d => typeof d.time === 'number' && !isNaN(d.time) && typeof d.value === 'number' && !isNaN(d.value)
//       );

//       if (validChartData.length === 0) {
//         console.warn('No valid chart data to set');
//         return;
//       }

//       // Ensure data is sorted and unique
//       const uniqueValidData = [...new Map(validChartData.map(item => [item.time, item])).values()].sort((a, b) => a.time - b.time);

//       console.log('Applying chart data:', uniqueValidData);
//       areaSeries.current.setData(uniqueValidData);
//       const totalTimeSpan = Math.max(...uniqueValidData.map(d => d.time)) - Math.min(...uniqueValidData.map(d => d.time)) || TOTAL_TIME_SPAN_S;
//       const tickInterval = totalTimeSpan / VISIBLE_TICKS;
//       chartInstance.current.timeScale().setVisibleRange({
//         from: timeWindowStart,
//         to: timeWindowStart + (tickInterval * VISIBLE_TICKS),
//       });
//       renderSync.current += 1;
//     } catch (error) {
//       console.error('Error applying chart data:', error);
//     }
//   }, [chartData, isInitialized, chartInstance, areaSeries]);

//   useEffect(() => {
//     if (!isInitialized.current || !chartInstance.current || !areaSeries.current) return;

//     const setupWebSocket = () => {
//       socketRef.current = io(websocketUrl, {
//         transports: ['websocket'],
//         reconnectionAttempts: 5,
//         reconnectionDelay: 5000,
//       });

//       socketRef.current.on('connect', () => {
//         console.log('WebSocket connected successfully');
//       });

//       socketRef.current.on('tradeUpdate', (data) => {
//         console.log('Received tradeUpdate from WebSocket:', data);

//         if (!data || typeof data.value !== 'number') {
//           console.error('Invalid trade update:', data);
//           return;
//         }

//         const price = data.value;
//         const simulatedPremium = price * SENSITIVITY;
//         let currentTime = Math.floor(Date.now() / 1000);

//         // Ensure unique timestamp
//         if (currentTime <= lastTimestamp.current) {
//           currentTime = lastTimestamp.current + 1;
//         }
//         lastTimestamp.current = currentTime;

//         const newPoint = { time: currentTime, value: simulatedPremium };

//         const now = Date.now();
//         if (now - lastUpdateTime.current < TICK_INTERVAL_MS) {
//           console.log('Throttling update, waiting for next interval...', { elapsed: now - lastUpdateTime.current });
//           return;
//         }

//         lastUpdateTime.current = now;
//         setChartData(prevData => {
//           const timeWindowStart = Math.min(...prevData.map(d => d.time));
//           const newData = [...prevData, newPoint].sort((a, b) => a.time - b.time);

//           const limitedData = newData.slice(VISIBLE_DATA).filter(
//             d => d.time >= timeWindowStart && typeof d.time === 'number' && !isNaN(d.time)
//           );

//           if (limitedData.length === 0) {
//             console.warn('No filtered data, using fallback');
//             limitedData.push({ time: timeWindowStart, value: simulatedPremium });
//           }

//           const uniqueLimitedData = [...new Map(limitedData.map(item => [item.time, item])).values()].sort((a, b) => a.time - b.time);

//           console.log('Applying new chart data:', uniqueLimitedData);
//           if (areaSeries.current && chartInstance.current && renderSync.current > 0) {
//             try {
//               areaSeries.current.setData(uniqueLimitedData);
//               const totalTimeSpan = Math.max(...uniqueLimitedData.map(d => d.time)) - Math.min(...uniqueLimitedData.map(d => d.time)) || TOTAL_TIME_SPAN_S;
//               const tickInterval = totalTimeSpan / VISIBLE_TICKS;
//               chartInstance.current.timeScale().setVisibleRange({
//                 from: timeWindowStart,
//                 to: timeWindowStart + (tickInterval * VISIBLE_TICKS),
//               });

//               // Update markers to stay near the latest tick after new data is added
//               if (markers.length > 0) {
//                 const latestTime = uniqueLimitedData[uniqueLimitedData.length - 1].time;
//                 const updatedMarkers = markers.map((marker, index) => ({
//                   ...marker,
//                   time: latestTime + index, // Offset slightly to avoid overlap
//                 }));
//                 setMarkers(updatedMarkers);
//               }
//             } catch (error) {
//               console.error('Error applying chart data:', error);
//             }
//           }

//           return uniqueLimitedData;
//         });
//       });

//       socketRef.current.on('connect_error', (error) => {
//         console.error('WebSocket connection error:', error.message);
//       });

//       socketRef.current.on('disconnect', () => {
//         console.log('WebSocket disconnected');
//       });

//       return () => {
//         if (socketRef.current) {
//           console.log('Disconnecting WebSocket...');
//           socketRef.current.disconnect();
//           socketRef.current = null;
//         }
//       };
//     };

//     const cleanup = setupWebSocket();
//     return cleanup;
//   }, [isInitialized, chartInstance, areaSeries, websocketUrl]);

//   return (
//     <div style={{ position: 'relative' }}>
//       <div ref={chartRef} className={className} />
//       <div className='flex flex-row gap-2'>
//       <button
//         onClick={addMarker}
//         style={{
//           top: '10px',
//           left: '10px',
//           padding: '5px 10px',
//           backgroundColor: '#59ad05',
//           color: '#fff',
//           border: 'none',
//           borderRadius: '3px',
//           cursor: 'pointer',
//           zIndex: 10
//         }}
//       >
//         Add Marker
//       </button>
//       <button
//         onClick={clearMarkers}
//         style={{
//           top: '10px',
//           left: '10px',
//           padding: '5px 10px',
//           backgroundColor: '#ce03fc',
//           color: '#fff',
//           border: 'none',
//           borderRadius: '3px',
//           cursor: 'pointer',
//           zIndex: 10
//         }}
//       >
//         Clear
//       </button>
//       </div>
//     </div>
//   );
// };

// export default BaselineChart;