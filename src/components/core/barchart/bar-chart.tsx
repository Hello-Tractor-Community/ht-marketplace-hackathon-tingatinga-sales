import { BarChart } from '@mantine/charts';
import { data } from './data';
import React from 'react'

const VisitsBarChart = () => {
  return (
    <BarChart
      h={350}
      data={data}
      dataKey="month"
      withLegend
      series={[
        { name: 'visits', color: 'violet.6' },
        { name: 'uniqueVisitors', color: 'blue.6' },
        { name: 'conversions', color: 'teal.6' },
      ]}
      w={1000}
    />
  )
}

export default VisitsBarChart