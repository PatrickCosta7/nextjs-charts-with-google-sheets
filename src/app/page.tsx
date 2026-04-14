"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Row = Record<string, string>;

export default function Home() {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/sheets");
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const json = await res.json();
        setRows(json.rows ?? []);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load data");
      }
    })();
  }, []);

  // Example expects headers: "Label" and "Value"
  const chartData = useMemo(() => {
    return rows
      .map((r) => ({
        label: r["Label"] ?? "",
        value: Number(r["Value"] ?? 0),
      }))
      .filter((d) => d.label);
  }, [rows]);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold">Google Sheets → Recharts</h1>

      {error ? (
        <p className="mt-4 text-red-600">{error}</p>
      ) : (
        <div className="mt-8 h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#2563eb" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}