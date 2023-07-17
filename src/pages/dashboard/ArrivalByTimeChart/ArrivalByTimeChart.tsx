import React from 'react'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

import './ArrivalByTimeChats.scss'

const arrayGroup = function <T>(array: T[], f: (item: T) => string) {
  const groups: Record<string, T[]> = {}
  array.forEach(function (o) {
    const group = f(o)
    groups[group] = groups[group] || []
    groups[group].push(o)
  })
  return Object.keys(groups).map(function (group) {
    return groups[group]
  })
}

export default function ArrivalByTimeChart({
  data,
}: {
  data: {
    id: string
    name: string
    current: number
    max: number
    percent: number
    gtfs_route_date: string
    gtfs_route_hour: string
  }[]
}) {
  return (
    <div className="chart">
      {arrayGroup(data, (item) => item.id).map((group) => (
        <div key={group[0].name}>
          <h3 className="title">{group[0].name}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={group
                .sort((a, b) => (a.gtfs_route_date > b.gtfs_route_date ? 1 : -1))
                .sort((a, b) => (a.gtfs_route_hour > b.gtfs_route_hour ? 1 : -1))}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="gtfs_route_date" />
              <YAxis />
              <Tooltip
                content={({ payload }) =>
                  payload?.[0] && (
                    <>
                      <ul>
                        <li>
                          <span className="label">תאריך: </span>
                          <span className="value">
                            {payload![0].payload.gtfs_route_date ||
                              payload![0].payload.gtfs_route_hour}
                          </span>
                        </li>
                        <li>
                          <span className="label">ביצוע: </span>
                          <span className="value">{payload![0].payload.current}</span>
                        </li>
                        <li>
                          <span className="label">תכנון: </span>
                          <span className="value">{payload![0].payload.max}</span>
                        </li>
                      </ul>
                    </>
                  )
                }
              />
              <Legend />
              <Line type="monotone" dataKey="percent" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  )
}