import React, { useEffect, useState } from 'react';
import { csv } from 'd3';
export const useData = () => {
  const [data, setData] = useState();
  useEffect(() => {
    csv(
      'https://gist.githubusercontent.com/mallahyari/8d4f6a43c80154bdb391edbc3f156029/raw/26792b80dbabdd6371bc9ff10c17f9a090495649/apple_stock_price.csv'
    ).then((dataset) => setData(dataset));
  }, []);

  return data;
};

export const useWeatherData = () => {
  const [data, setData] = useState();
  useEffect(() => {
    csv('weather_fake_data.csv').then((dataset) => setData(dataset));
  }, []);

  return data;
};
