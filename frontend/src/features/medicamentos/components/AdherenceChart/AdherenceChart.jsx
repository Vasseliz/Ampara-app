import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Calendar } from 'lucide-react';
import { Card } from '../../../../shared/atoms/Card/Card';
import styles from './AdherenceChart.module.css';

export const AdherenceChart = React.memo(({ data, averageAdherence }) => {
  const lastSevenDays = Array.isArray(data) ? data.slice(-7) : [];

  const percentageColor = useMemo(() => {
    if (averageAdherence == null) return '#888888';
    if (averageAdherence >= 80) return '#46B96C';
    if (averageAdherence >= 50) return '#F59E0B';
    return '#E53935';
  }, [averageAdherence]);

  return (
    <Card>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Calendar size={18} className={styles.titleIcon} />
          Adesão nos últimos 7 dias
        </h3>
        <div className={styles.subtitle}>
          <span className={styles.subtitleText}>Adesão média</span>
          <span className={styles.percentage} style={{ color: percentageColor }}>
            {averageAdherence == null ? "Sem dados" : `${averageAdherence}%`}
          </span>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={lastSevenDays} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAdherence" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#428A5A" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#428A5A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#888888' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#888888' }}
              tickFormatter={(val) => `${val}%`}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              itemStyle={{ color: '#428A5A', fontWeight: 600 }}
              labelStyle={{ color: '#666', marginBottom: '4px' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#428A5A"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAdherence)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
});
