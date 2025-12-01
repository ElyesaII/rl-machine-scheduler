import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface AnomalyHistory {
  episode: number;
  orderViolations: number;
  overlapViolations: number;
  releaseTimeViolations: number;
  total: number;
}

interface AnomalyChartProps {
  history: AnomalyHistory[];
}

export const AnomalyChart = ({ history }: AnomalyChartProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Évolution des Anomalies</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={history}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="episode" 
            label={{ value: 'Épisode', position: 'insideBottom', offset: -5 }}
            className="text-muted-foreground"
          />
          <YAxis 
            label={{ value: 'Nombre d\'anomalies', angle: -90, position: 'insideLeft' }}
            className="text-muted-foreground"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="total" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            name="Total"
            dot={{ fill: 'hsl(var(--primary))' }}
          />
          <Line 
            type="monotone" 
            dataKey="orderViolations" 
            stroke="hsl(var(--destructive))" 
            strokeWidth={1.5}
            name="Ordre"
            strokeDasharray="5 5"
          />
          <Line 
            type="monotone" 
            dataKey="overlapViolations" 
            stroke="hsl(var(--chart-2))" 
            strokeWidth={1.5}
            name="Chevauchement"
            strokeDasharray="3 3"
          />
          <Line 
            type="monotone" 
            dataKey="releaseTimeViolations" 
            stroke="hsl(var(--chart-3))" 
            strokeWidth={1.5}
            name="Disponibilité"
            strokeDasharray="2 2"
          />
        </LineChart>
      </ResponsiveContainer>
      {history.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="text-muted-foreground">Total Actuel</div>
            <div className="text-2xl font-bold text-primary">
              {history[history.length - 1].total}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="text-muted-foreground">Ordre</div>
            <div className="text-2xl font-bold text-destructive">
              {history[history.length - 1].orderViolations}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="text-muted-foreground">Chevauchement</div>
            <div className="text-2xl font-bold" style={{ color: 'hsl(var(--chart-2))' }}>
              {history[history.length - 1].overlapViolations}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="text-muted-foreground">Disponibilité</div>
            <div className="text-2xl font-bold" style={{ color: 'hsl(var(--chart-3))' }}>
              {history[history.length - 1].releaseTimeViolations}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
