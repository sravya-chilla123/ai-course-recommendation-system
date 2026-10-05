import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';

const STATUS_COLORS = {
  'Not Started': '#94a3b8',
  'In Progress': '#6366f1',
  'Completed': '#10b981'
};

export const ProgressPieChart = ({ summary = { notStarted: 0, inProgress: 0, completed: 0 } }) => {
  const data = [
    { name: 'Completed', value: summary.completed || 0, color: STATUS_COLORS.Completed },
    { name: 'In Progress', value: summary.inProgress || 0, color: STATUS_COLORS['In Progress'] },
    { name: 'Not Started', value: summary.notStarted || 0, color: STATUS_COLORS['Not Started'] },
  ].filter(d => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="h-56 flex flex-col items-center justify-center text-center text-slate-400 p-4 border border-dashed border-slate-200 rounded-xl">
        <p className="text-sm font-medium">No progress records tracked yet.</p>
        <p className="text-xs text-slate-400 mt-1">Start a course or set your progress to visualize statistics.</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={2} stroke="#ffffff" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              borderRadius: '0.75rem',
              color: '#ffffff',
              border: 'none',
              fontSize: '12px'
            }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CategoryBarChart = ({ breakdown = [] }) => {
  if (!breakdown || breakdown.length === 0) {
    return (
      <div className="h-56 flex items-center justify-center text-slate-400 text-sm">
        No category distribution data available.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={breakdown} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <XAxis
            dataKey="category"
            tick={{ fontSize: 11, fill: '#64748b' }}
            interval={0}
            angle={-20}
            textAnchor="end"
          />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              borderRadius: '0.75rem',
              color: '#ffffff',
              border: 'none',
              fontSize: '12px'
            }}
          />
          <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default { ProgressPieChart, CategoryBarChart };
