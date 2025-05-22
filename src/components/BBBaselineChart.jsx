import { useEffect, useRef, useState } from 'react';
import { createChart, BaselineSeries, LineType, LastPriceAnimationMode, LineStyle, createTextWatermark, createSeriesMarkers, PriceScaleMode, IChartBase, applyOptions, HistogramSeries } from 'lightweight-charts';
import io from 'socket.io-client';
import { useStore } from './../states/store';

const BBBaselineChart = ({ height = 400, className = '' }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const baselineSeries = useRef(null); // Renamed from areaSeries to baselineSeries
  const isInitialized = useRef(false);
  const [chartData, setChartData] = useState([]);
  const [markers, setMarkers] = useState([]); // State to store markers
  const socketRef = useRef(null);
  const renderSync = useRef(0);
  const lastUpdateTime = useRef(0);
  const lastTimestamp = useRef(0);
  const textWatermark = useRef(null); // Ref to store watermark for reference
  const volumeSeries = useRef(null);

  const TOTAL_TIME_SPAN_S = 1; // 1 second historical range
  const SENSITIVITY = 1; // Zoomed-in sensitivity
  const TICK_INTERVAL_MS = 600; // 600ms throttle for updates
  const VISIBLE_TICKS = 110; // Number of visible ticks
  const VISIBLE_DATA = -30; // Last 100 points

  const backendApiUrl = process.env.BACKEND_API_URL;
  const websocketUrl = process.env.WEBSOCKET_URL;

  const { betType, isBetPlaced, resetAfterPlaced } = useStore();

  const resize = () => {
    if (chartInstance.current && chartRef.current) {
      chartInstance.current.resize(chartRef.current.offsetWidth, height);
    }
  };

  const addMarker = () => {
    if (baselineSeries.current && chartInstance.current && chartData.length > 0) {
      let shape = (betType === 'UP') ? "arrowUp": "arrowDown";

      const latestData = chartData[chartData.length - 1];
      const newMarker = {
        time: latestData.time, // Set marker time to the latest tick's timestamp
        position: (betType === 'UP') ? "aboveBar": "belowBar", // Centered position within the bar
        color: '#e0dcde',
        shape: (betType === 'UP') ? "arrowUp": "arrowDown",
        text: `Price: ${latestData.value.toFixed(2)} 🏳️`,
      };

      console.log(newMarker)
      // Append the new marker to the existing ones
      setMarkers((prevMarkers) => {
        const updatedMarkers = [...prevMarkers, newMarker];
        return updatedMarkers;
      });
      //console.log('Marker added at latest tick time:', latestData.time, 'with price:', latestData.value);
    } else {
      //console.warn('Cannot add marker: No series, chart instance, or data available');
    }
  };

  const clearMarkers = () => {
    
    if (baselineSeries.current) {
      //setMarkers([]); // Reset markers state to empty array
      //console.log('Markers cleared from state');
    } else {
      //console.warn('Cannot clear markers: No series available');
    }
  };

  // Effect to sync markers with the chart
  useEffect(() => {
    if (baselineSeries.current && markers.length === 0 && chartInstance.current) {
      createSeriesMarkers(baselineSeries.current, []); // Clear markers when state is empty
      console.log('Markers cleared from chart');
      console.log(markers);
    } else if (baselineSeries.current && markers.length > 0 && chartInstance.current) {
      createSeriesMarkers(baselineSeries.current, markers); // Update chart with current markers
      console.log('Markers updated on chart:', markers.length);
      console.log(baselineSeries.current)
    }
  }, [markers, baselineSeries.current, chartInstance.current]);

  useEffect(() => {
    if (chartRef.current && !isInitialized.current && chartRef.current.offsetWidth > 0) {
      try {
        chartInstance.current = createChart(chartRef.current, {
          width: chartRef.current.offsetWidth,
          height,
          layout: { // Interface: LayoutOptions
            background: { 
              color: '#1D293D' 
            }, 
            textColor: '#90A1B9',
            fontSize: 15,
            attributionLogo: false
          },
          grid: { vertLines: { color: '#25293a' }, horzLines: { color: '#2d324d' } },
          timeScale: {
            timeVisible: true,
            fixLeftEdge: true,
            autoScale: false,
            minBarSpacing: 20,
            borderVisible: true
            // rightOffset: 5,
            // barSpacing: 10,
            //minimumHeight: 100,
            //ticksVisible: false,
            //visible: false
            //ignoreWhitespaceIndices: false,
            //shiftVisibleRangeOnNewBar: false,
          },
          
          handleScroll: true,
          handleScale: true,
          crosshair: {
            horzLine: {
              color: 'rgba(247, 191, 5, 0.5)',
              style: LineStyle.Dashed,
              width: 1
            },
            vertLine: {
              color: 'rgba(250, 245, 248, 0.1)',
              style: LineStyle.Solid,
              width: 7
            }
            
          },
          rightPriceScale: {
            mode: 1,
            minimumWidth: 10,
            // scaleMargins: {
            //   bottom: 0.3,
            //   top: 0.10
            // }
          },
        });

        // Interface
        const seriesOptions = {
          baseValue: { type: 'price', price: 10 }, // Set baseline at 0 (customizable)
          topLineColor: 'rgba(250, 245, 248, 0.7)', // white line color
          topFillColor1: 'rgba(4, 224, 85, 2)', // Top fill gradient
          topFillColor2: 'rgba(247, 5, 126, 0.8)',
          bottomLineColor: 'rgba(247, 5, 126, 0.1)',
          bottomFillColor1: 'rgba(247, 5, 126, 0.05)',
          bottomFillColor2: 'rgba(247, 5, 126, 0)',
          lineWidth: 2,
          lineType: LineType.Curved,
          lastPriceAnimation: LastPriceAnimationMode.OnDataUpdate,
          lineStyle: LineStyle.Solid,
          crosshairMarkerBackgroundColor: '#f7bf05',
          crosshairMarkerRadius: 5,
          //pointMarkersVisible: true,
          //relativeGradient: true
        };
        // Add watermark to the first pane if it exists
        if (chartInstance.current.panes().length > 0) {
          textWatermark.current = createTextWatermark(chartInstance.current.panes()[0], {
            horzAlign: 'center',
            vertAlign: 'center',
            lines: [
              {
                text: 'KBCGAME - BTCUSDT',
                color: 'rgba(245, 241, 243, 0.3)',
                fontSize: 25,
              },
            ],
          });
          //console.info('Watermark added:', textWatermark.current);
        } else {
          //console.warn('No panes available for watermark');
        }

        baselineSeries.current = chartInstance.current.addSeries(BaselineSeries, seriesOptions); // Changed to BaselineSeries
        //console.log('Baseline series added with options:', seriesOptions);

        // Force a redraw to ensure watermark renders
        chartInstance.current.resize(chartRef.current.offsetWidth, height);
        chartInstance.current.timeScale().fitContent();

        // ===================================
        console.log(chartInstance.current.timeScale().options())
        console.log(chartInstance.current.options())
        console.log(BaselineSeries)
        console.log(chartInstance.current.panes()[0])
        // ===================================

        window.addEventListener('resize', resize);

        isInitialized.current = true;
        //console.log('Chart initialization complete');
      } catch (error) {
        //console.error('Chart initialization error:', error);
      }

      return () => {
        //console.log('Cleaning up chart...');
        window.removeEventListener('resize', resize);
        if (chartInstance.current) {
          chartInstance.current.remove();
          //console.log('Chart and watermark cleaned up');
          chartInstance.current = null;
          baselineSeries.current = null;
          textWatermark.current = null;
          isInitialized.current = false;
        }
      };
    }
  }, [height]);

  useEffect(() => {
    if (!isInitialized.current || !chartInstance.current || !baselineSeries.current) {
      // console.log('Waiting for chart to be initialized...', {
      //   isInitialized: isInitialized.current,
      //   chartInstance: !!chartInstance.current,
      //   baselineSeries: !!baselineSeries.current,
      // });
      return;
    }

    const initializeChart = async () => {
      try {
        const fetchHistoricalData = async () => {
          const currentTimeMs = Date.now();
          const endTime = currentTimeMs - 1;
          const startTime = endTime - (TOTAL_TIME_SPAN_S * 1000);

          //console.log(`Fetching historical data: start=${startTime}, end=${endTime}`);

          const response = await fetch(
            `${backendApiUrl}/binance/historical?symbol=BTCUSDT&startTime=${startTime}&endTime=${endTime}&limit=100`
          );
          if (!response.ok) throw new Error('Failed to fetch historical data');
          const candles = await response.json();

          //console.log('Historical data:', candles);

          const mappedData = candles.map(candle => ({
            time: candle.close_time / 1000,
            value: candle.close * SENSITIVITY,
          }));

          return mappedData.slice(-20);
        };

        const historicalData = await fetchHistoricalData();
        const timeWindowStart = Math.min(...historicalData.map(d => d.time));

        let initialData = historicalData.length > 0 ? historicalData : [{ time: Math.floor(Date.now() / 1000) - 100, value: 96741 * SENSITIVITY }];
        initialData = initialData.filter(d => typeof d.time === 'number' && !isNaN(d.time) && typeof d.value === 'number' && !isNaN(d.value));
        if (initialData.length === 0) {
          //console.warn('No valid historical data, using fallback');
        }

        // Ensure initial data is sorted and unique
        initialData = [...new Map(initialData.map(item => [item.time, item])).values()].sort((a, b) => a.time - b.time);

        //console.log('Setting initial data:', initialData);
        setChartData(initialData);

        const validInitialData = initialData.filter(
          d => typeof d.time === 'number' && !isNaN(d.time) && typeof d.value === 'number' && !isNaN(d.value)
        );

        if (validInitialData.length > 0) {
          //console.log('Applying initial chart data:', validInitialData);
          baselineSeries.current.setData(validInitialData); // Updated for BaselineSeries
          const totalTimeSpan = Math.max(...validInitialData.map(d => d.time)) - Math.min(...validInitialData.map(d => d.time)) || TOTAL_TIME_SPAN_S;
          const tickInterval = totalTimeSpan / VISIBLE_TICKS;
          chartInstance.current.timeScale().setVisibleRange({
            from: Math.min(...validInitialData.map(d => d.time)),
            to: Math.min(...validInitialData.map(d => d.time)) + (tickInterval * VISIBLE_TICKS),
          });
          renderSync.current += 1;
        } else {
          console.warn('No valid initial data to set on chart');
        }
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initializeChart();
  }, [isInitialized, chartInstance, baselineSeries]);

  useEffect(() => {
    if (!isInitialized.current || !chartInstance.current || !baselineSeries.current || chartData.length === 0) {
      // console.log('Waiting for data to be applied...', {
      //   isInitialized: isInitialized.current,
      //   chartInstance: !!chartInstance.current,
      //   baselineSeries: !!baselineSeries.current,
      //   chartDataLength: chartData.length,
      // });
      return;
    }

    const timeWindowStart = Math.min(...chartData.map(d => d.time));

    try {
      const validChartData = chartData.filter(
        d => typeof d.time === 'number' && !isNaN(d.time) && typeof d.value === 'number' && !isNaN(d.value)
      );

      if (validChartData.length === 0) {
        //console.warn('No valid chart data to set');
        return;
      }

      // Ensure data is sorted and unique
      const uniqueValidData = [...new Map(validChartData.map(item => [item.time, item])).values()].sort((a, b) => a.time - b.time);

      //console.log('Applying chart data:', uniqueValidData);
      baselineSeries.current.setData(uniqueValidData); // Updated for BaselineSeries
      const totalTimeSpan = Math.max(...uniqueValidData.map(d => d.time)) - Math.min(...uniqueValidData.map(d => d.time)) || TOTAL_TIME_SPAN_S;
      const tickInterval = totalTimeSpan / VISIBLE_TICKS;
      chartInstance.current.timeScale().setVisibleRange({
        from: timeWindowStart,
        to: timeWindowStart + (tickInterval * VISIBLE_TICKS),
      });
      renderSync.current += 1;
    } catch (error) {
      //console.error('Error applying chart data:', error);
    }
  }, [chartData, isInitialized, chartInstance, baselineSeries]);

  useEffect(() => {
    if (!isInitialized.current || !chartInstance.current || !baselineSeries.current) return;

    const setupWebSocket = () => {
      socketRef.current = io(websocketUrl, {
        transports: ['websocket'],
        reconnectionAttempts: 5,
        reconnectionDelay: 5000,
      });

      socketRef.current.on('connect', () => {
        //console.log('WebSocket connected successfully');
      });

      socketRef.current.on('tradeUpdate', (data) => {
        //console.log('Received tradeUpdate from WebSocket:', data);

        if (!data || typeof data.value !== 'number') {
          //console.error('Invalid trade update:', data);
          return;
        }

        const price = data.value;
        const simulatedPremium = price * SENSITIVITY;
        let currentTime = Math.floor(Date.now() / 1000);

        // Ensure unique timestamp
        if (currentTime <= lastTimestamp.current) {
          currentTime = lastTimestamp.current + 1;
        }
        lastTimestamp.current = currentTime;

        const newPoint = { time: currentTime, value: simulatedPremium };

        const now = Date.now();
        if (now - lastUpdateTime.current < TICK_INTERVAL_MS) {
          //console.log('Throttling update, waiting for next interval...', { elapsed: now - lastUpdateTime.current });
          return;
        }

        lastUpdateTime.current = now;
        setChartData(prevData => {
          const timeWindowStart = Math.min(...prevData.map(d => d.time));
          const newData = [...prevData, newPoint].sort((a, b) => a.time - b.time);

          const limitedData = newData.slice(VISIBLE_DATA).filter(
            d => d.time >= timeWindowStart && typeof d.time === 'number' && !isNaN(d.time)
          );

          if (limitedData.length === 0) {
            console.warn('No filtered data, using fallback');
            limitedData.push({ time: timeWindowStart, value: simulatedPremium });
          }

          const uniqueLimitedData = [...new Map(limitedData.map(item => [item.time, item])).values()].sort((a, b) => a.time - b.time);

          //console.log('Applying new chart data:', uniqueLimitedData);
          if (baselineSeries.current && chartInstance.current && renderSync.current > 0) {
            try {
              baselineSeries.current.setData(uniqueLimitedData); // Updated for BaselineSeries
              const totalTimeSpan = Math.max(...uniqueLimitedData.map(d => d.time)) - Math.min(...uniqueLimitedData.map(d => d.time)) || TOTAL_TIME_SPAN_S;
              const tickInterval = totalTimeSpan / VISIBLE_TICKS;
              chartInstance.current.timeScale().setVisibleRange({
                from: timeWindowStart,
                to: timeWindowStart + (tickInterval * VISIBLE_TICKS),
              });

              // Update markers to stay near the latest tick after new data is added
              if (markers.length > 0) {
                const latestTime = uniqueLimitedData[uniqueLimitedData.length - 1].time;
                const updatedMarkers = markers.map((marker, index) => ({
                  ...marker,
                  time: latestTime + index, // Offset slightly to avoid overlap
                }));
                setMarkers(updatedMarkers);
              }
            } catch (error) {
              console.error('Error applying chart data:', error);
            }
          }

          return uniqueLimitedData;
        });
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error.message);
      });

      socketRef.current.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });

      return () => {
        if (socketRef.current) {
          console.log('Disconnecting WebSocket...');
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    };

    const cleanup = setupWebSocket();
    return cleanup;
  }, [isInitialized, chartInstance, baselineSeries, websocketUrl]);

  useEffect(() => {
    if (isBetPlaced) {
      addMarker();
      resetAfterPlaced();
    }
  }, [isBetPlaced, addMarker]);

  return (
    // style={{ position: 'relative' }}
    <div>
      <div ref={chartRef} className={className} />
      <div className='flex flex-row gap-2'>
        {/* <button
          onClick={addMarker}
          style={{
            top: '10px',
            left: '10px',
            padding: '5px 10px',
            backgroundColor: '#59ad05',
            color: '#fff',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          Add Marker
        </button> */}
        {/* <button
          onClick={clearMarkers}
          style={{
            top: '10px',
            left: '10px',
            padding: '5px 10px',
            backgroundColor: '#ce03fc',
            color: '#fff',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          Clear
        </button> */}
      </div>
    </div>
  );
};

export default BBBaselineChart;