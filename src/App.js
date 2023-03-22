import React, { useEffect, useState } from 'react';
import { json } from 'd3';
import { Box, Container, Typography, Grid } from '@mui/material';
import { Outlet } from 'react-router-dom';

import './App.css';
import { useData } from './utils/useData';
import { LineChart } from './components/linechart';
import { SimpleRadar } from './components/radarchart';
import { WeatherPlot } from './components/weather';
import { BarChart } from './components/barchart';
import { RidgePlot } from './components/ridgeplot';
// import { BubbleChart, BubbleChartSmooth } from './components/bubblechart';
import BlogCard from './components/blogs/BlogCard';

function App() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    json(
      'https://gist.githubusercontent.com/mallahyari/286fe9e7ac977575b1a8e79d07a30e0c/raw/4ca13a3a40023778717ed7406616759cdb7c0a5b/blog_posts.json'
    ).then((data) => setPosts(data));
  }, []);

  if (!posts) {
    return (
      <Box>
        <Typography variant="body1">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Container className="App">
      <Grid container spacing={2}>
        {posts.map((post, i) => (
          <Grid item xs={4} key={i}>
            <BlogCard
              id={post.id}
              title={post.title}
              description={post.description}
              date={post.date}
              image={post.image}
              url={post.url}
              path={post.path}
            />
          </Grid>
        ))}
      </Grid>

      {/* <Outlet /> */}
      {/* <LineChart /> */}
      {/* <SimpleRadar /> */}
      {/* <WeatherPlot /> */}
      {/* <BarChart /> */}
      {/* <RidgePlot /> */}
      {/* <BubbleChart /> */}
      {/* <BubbleChartSmooth /> */}
    </Container>
  );
}

export default App;
