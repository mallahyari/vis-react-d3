import React from 'react';
import { Box, Container } from '@mui/material';
import './App.css';
import { useData } from './utils/useData';
// import { LineChart } from './components/linechart';
import { SimpleRadar } from './components/radarchart';
import { FitnessPlot } from './components/fitness';

function App() {
  const data = useData();
  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <Container className="App">
      <FitnessPlot />
    </Container>
  );
}

export default App;

// return (
//   <Container className="App">
//     <LineChart data={data} />
//     <SimpleRadar />
//   </Container>
// );
