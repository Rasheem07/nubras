interface StatsCardProps {
    title: string;
    value: string;
    change: string;
    icon: React.ReactNode;
    color: string;
  }
  
  export default function StatsCard({ title, value, change, icon, color }: StatsCardProps) {
    return (
      <div className="bg-gray-800 p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-400">{title}</h3>
          <span className={`p-2 bg-${color}-500/10 text-${color}-500 rounded-lg`}>
            {icon}
          </span>
        </div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className={`text-sm text-${color}-500`}>{change}</p>
      </div>
    );
  }