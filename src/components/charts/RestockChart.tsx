'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RestockData } from '@/types';

interface RestockChartProps {
  data: RestockData[];
}

import React from 'react';

export const RestockChart = React.memo(({ data }: RestockChartProps) => {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" />
          <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="productName"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={120}
            tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
          />
          <Tooltip
            cursor={{ fill: '#1e293b' }}
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9', borderRadius: '8px' }}
            itemStyle={{ color: '#60a5fa' }}
          />
          <Bar dataKey="stock" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

RestockChart.displayName = 'RestockChart';
