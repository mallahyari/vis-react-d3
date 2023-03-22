import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import BlogCard from './components/blogs/BlogCard';
import { LineChart } from './components/linechart';
import { BarChart } from './components/barchart';
import { SimpleRadar } from './components/radarchart';
import { WeatherPlot } from './components/weather';
import { RidgePlot } from './components/ridgeplot';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: 'posts/:postId',
        element: <BlogCard />,
      },
    ],
  },
  { path: 'linechart', element: <LineChart /> },
  { path: 'tooltip', element: <LineChart /> },
  { path: 'radarchart', element: <SimpleRadar /> },
  { path: 'weatherplot', element: <WeatherPlot /> },
  { path: 'barchart', element: <BarChart /> },
  { path: 'ridgeplot', element: <RidgePlot /> },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
