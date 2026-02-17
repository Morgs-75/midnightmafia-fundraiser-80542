import { motion } from "motion/react";
import { TrendingUp, DollarSign, Target, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface Stat {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}

interface PulsatingStatsProps {
  numbers: Array<{ status: string, isTeamNumber?: boolean }>;
}

export function PulsatingStats({ numbers }: PulsatingStatsProps) {
  // Calculate real stats from actual data
  const totalSoldCount = numbers.filter(n => n.status === "sold").length;
  const supporterSoldCount = numbers.filter(n => n.status === "sold" && !n.isTeamNumber).length;
  const soldPercentage = Math.round((totalSoldCount / 200) * 100);
  const numbersLeft = 200 - totalSoldCount;
  
  // Calculate revenue: Only count supporter numbers (exclude team's 10 free numbers)
  // Revenue = supporterSoldCount * $25 (average price per number)
  const revenue = supporterSoldCount * 25;

  const stats: Stat[] = [
    {
      icon: <Target className="w-4 h-4" />,
      value: `${soldPercentage}%`,
      label: "SOLD",
      color: "from-green-600 to-emerald-600"
    },
    {
      icon: <DollarSign className="w-4 h-4" />,
      value: `$${revenue.toLocaleString()}`,
      label: "RAISED",
      color: "from-yellow-600 to-orange-600"
    },
    {
      icon: <TrendingUp className="w-4 h-4" />,
      value: `${numbersLeft}`,
      label: "LEFT",
      color: "from-red-600 to-pink-600"
    },
    {
      icon: <Zap className="w-4 h-4" />,
      value: "LIVE",
      label: "ACTIVE",
      color: "from-blue-700 to-blue-500"
    },
  ];

  return (
    <div className="fixed bottom-32 left-4 z-40 pointer-events-none">
      <div className="flex flex-col gap-2">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ x: -100, opacity: 0 }}
            animate={{ 
              x: 0, 
              opacity: 1,
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              x: { delay: index * 0.1 },
              scale: { duration: 2, repeat: Infinity, delay: index * 0.3 }
            }}
            className={`bg-gradient-to-r ${stat.color} rounded-lg px-3 py-2 shadow-xl border-2 border-white/30 min-w-[100px]`}
          >
            <div className="flex items-center gap-2">
              <div className="bg-white/20 rounded-full p-1">
                {stat.icon}
              </div>
              <div className="flex-1">
                <p className="text-white font-black text-sm leading-none" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  {stat.value}
                </p>
                <p className="text-white/80 text-xs" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {stat.label}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}