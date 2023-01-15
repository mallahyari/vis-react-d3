import React from 'react';
import { Container } from '@mui/material';
import './App.css';
import useData from './utils/useData';
import { LineChart } from './components/linechart';

function App() {
  const data = useData();
  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <Container className="App">
      <LineChart data={data} />
    </Container>
  );
}

export default App;
