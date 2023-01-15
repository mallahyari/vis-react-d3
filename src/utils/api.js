import * as d3 from 'd3'

export const fetchData = async () => {
  const response = await fetch('../data/my_weather_data.json')
  if (!response.ok) {
    throw new Error('Json file not found!')
  }
  const data = await response.json()
  return data
}
