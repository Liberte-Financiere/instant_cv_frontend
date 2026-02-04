"use client";

import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
}

export const ScoreGauge = ({ score }: ScoreGaugeProps) => {
  // Determine color based on score
  const getColor = (s: number) => {
    if (s >= 80) return "#22c55e"; // Green
    if (s >= 60) return "#eab308"; // Yellow
    return "#ef4444"; // Red
  };

  const color = getColor(score);
  const circumference = 2 * Math.PI * 40; // radius 40
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      {/* Background Circle */}
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r="40"
          stroke="#e2e8f0"
          strokeWidth="8"
          fill="none"
        />
        {/* Foreground Circle */}
        <motion.circle
          cx="64"
          cy="64"
          r="40"
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      {/* Score Text */}
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-slate-800">{score}</span>
        <span className="text-xs text-slate-500 font-medium">/ 100</span>
      </div>
    </div>
  );
};
