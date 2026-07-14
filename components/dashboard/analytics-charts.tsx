"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/primitives";

export function AnalyticsCharts({
  dailyData,
  modeData,
}: {
  dailyData: { date: string; count: number }[];
  modeData: { mode: string; count: number }[];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Generations over time</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          {dailyData.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="emberFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F2A93B" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#F2A93B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262B34" />
                <XAxis dataKey="date" stroke="#5C6577" fontSize={12} />
                <YAxis stroke="#5C6577" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#1A1E25", border: "1px solid #262B34", borderRadius: 8 }} />
                <Area type="monotone" dataKey="count" stroke="#F2A93B" fill="url(#emberFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>By type</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          {modeData.every((m) => m.count === 0) ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262B34" />
                <XAxis dataKey="mode" stroke="#5C6577" fontSize={12} />
                <YAxis stroke="#5C6577" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#1A1E25", border: "1px solid #262B34", borderRadius: 8 }} />
                <Bar dataKey="count" fill="#2E5BFF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyState() {
  return <div className="grid h-full place-items-center text-sm text-forge-500">Not enough data yet.</div>;
}
