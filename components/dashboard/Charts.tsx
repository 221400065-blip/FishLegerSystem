"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const datasets = {
  "Today": [
    { name: "9 AM", sales: 1200, profit: 300 },
    { name: "12 PM", sales: 3000, profit: 800 },
    { name: "3 PM", sales: 2500, profit: 650 },
    { name: "6 PM", sales: 4200, profit: 1100 },
    { name: "9 PM", sales: 1550, profit: 390 },
  ],
  "This Week": [
    { name: "Mon", sales: 12000, profit: 3100 },
    { name: "Tue", sales: 14000, profit: 3600 },
    { name: "Wed", sales: 11000, profit: 2800 },
    { name: "Thu", sales: 16500, profit: 4200 },
    { name: "Fri", sales: 13200, profit: 3400 },
    { name: "Sat", sales: 9000, profit: 2300 },
    { name: "Sun", sales: 8600, profit: 2200 },
  ],
  "This Month": [
    { name: "Week 1", sales: 65000, profit: 16800 },
    { name: "Week 2", sales: 82000, profit: 21500 },
    { name: "Week 3", sales: 79000, profit: 20500 },
    { name: "Week 4", sales: 94500, profit: 24500 },
  ]
};

const categoryData = [
  { name: "Cables", value: 60 },
  { name: "Power Banks", value: 25 },
  { name: "Others", value: 15 },
];

const COLORS = ["#06B6D4", "#0B2545", "#f97316", "#cbd5e1"];

export function SalesTrendsChart({ timeFilter = "Today" }: { timeFilter?: string }) {
  const chartData = datasets[timeFilter as keyof typeof datasets] || datasets["Today"];

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `$${value/1000}k`} />
          <Tooltip 
             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
             formatter={(value: any, name: any) => {
               if (name === "sales") return [`$${Number(value).toLocaleString()}`, 'Sales'];
               if (name === "profit") return [`$${Number(value).toLocaleString()}`, 'Profit'];
               return [value, name];
             }}
          />
          <Area type="monotone" dataKey="sales" stroke="#06B6D4" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
          <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TopCategoriesChart() {
  return (
    <div className="h-[300px] w-full mt-4 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
             formatter={(value: any) => [`${value} items`, 'Stock Left']}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value) => <span className="text-slate-600 text-sm font-medium">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
