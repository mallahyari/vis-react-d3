import React from 'react';
import { Box, Container } from '@mui/material';
import './App.css';
import useData from './utils/useData';
// import { LineChart } from './components/linechart';
import { SimpleRadar } from './components/radarchart';

function App() {
  const data = useData();
  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <Container className="App">
      <SimpleRadar />
    </Container>
  );
}

export default App;

// return (
//   <Container className="App">
//     <LineChart data={data} />
//   </Container>
// );
