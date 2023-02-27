import React from 'react';
import { Box, Container } from '@mui/material';
import './App.css';
import { useData } from './utils/useData';
import { LineChart } from './components/linechart';
import { SimpleRadar } from './components/radarchart';
import { WeatherPlot } from './components/weather';
import { BarChart } from './components/barchart';
import { RidgePlot } from './components/ridgeplot';
import { BubbleChart, BubbleChartSmooth } from './components/bubblechart';

function App() {
  return (
    <Container className="App">
      {/* <LineChart /> */}
      {/* <SimpleRadar /> */}
      {/* <WeatherPlot /> */}
      {/* <BarChart /> */}
      <RidgePlot />
      {/* <BubbleChart /> */}
      {/* <BubbleChartSmooth /> */}
    </Container>
  );
}

export default App;
