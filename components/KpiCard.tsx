import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'blue' | 'red' | 'green' | 'yellow';
  icon: React.ReactNode;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, subValue, color = 'blue', icon }) => {
  
  // Refined colors for Glassmorphism
  const styles = {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-700', subBg: 'bg-blue-500/20', subText: 'text-blue-900' },
    red: { bg: 'bg-red-500/10', text: 'text-red-700', subBg: 'bg-red-500/20', subText: 'text-red-900' },
    green: { bg: 'bg-emerald-500/10', text: 'text-emerald-700', subBg: 'bg-emerald-500/20', subText: 'text-emerald-900' },
    yellow: { bg: 'bg-amber-500/10', text: 'text-amber-700', subBg: 'bg-amber-500/20', subText: 'text-amber-900' },
  };

  const activeStyle = styles[color];

  return (
    <div className="relative overflow-hidden rounded-2xl p-6 h-full
        bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl transition-all hover:shadow-2xl hover:bg-white/70 group">
      
      {/* Background decoration */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${activeStyle.bg} blur-2xl group-hover:bg-opacity-30 transition-all opacity-50`}></div>

      <div className="relative flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${activeStyle.bg} backdrop-blur-sm border border-white/20 shadow-sm`}>
            {React.isValidElement(icon) 
              ? React.cloneElement(icon as React.ReactElement<any>, { className: `w-6 h-6 ${activeStyle.text}` })
              : icon}
        </div>
      </div>
      
      {subValue && (
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${activeStyle.subBg} ${activeStyle.subText} backdrop-blur-md`}>
          {subValue}
        </div>
      )}
    </div>
  );
};

export default KpiCard;