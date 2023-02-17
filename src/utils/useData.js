import React, { useEffect, useState } from 'react';
import { csv, json } from 'd3';
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
    csv(
      'https://gist.githubusercontent.com/mallahyari/1e0a70ed89e553ecf2db7e24a9b91d65/raw/02d48c2d42515dd892c41cca13c34cc1d0c09ebe/weather_fake_data.csv'
    ).then((dataset) => setData(dataset));
  }, []);

  return data;
};

export const useBarchartData = () => {
  const [data, setData] = useState();
  useEffect(() => {
    json(
      'https://raw.githubusercontent.com/vega/vega/main/docs/data/wheat.json'
    ).then((dataset) => setData(dataset));
  }, []);

  return data;
};
