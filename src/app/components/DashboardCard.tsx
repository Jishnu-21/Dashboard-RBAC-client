import React from 'react';

type DashboardCardProps = {
  title: string;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export default function DashboardCard({ title, children, onClick, className = '' }: DashboardCardProps) {
  return (
    <div
      className={`bg-[#1C1C1C] rounded-md shadow-lg p-6 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer group border border-[#333333] ${className}`}
      onClick={onClick}
    >
      <div className="text-xl font-bold text-[#FFFFFF] mb-4 group-hover:text-[#888888]">{title}</div>
      {children}
    </div>
  );
} 