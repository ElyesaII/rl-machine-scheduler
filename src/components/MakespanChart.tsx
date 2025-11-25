import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface MakespanChartProps {
  history: { episode: number; makespan: number }[];
}

export const MakespanChart = ({ history }: MakespanChartProps) => {
  return (
    <Card className="border-primary/20 shadow-md">
      <CardHeader>
        <CardTitle className="text-primary">Évolution du Makespan</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="episode" 
              label={{ value: "Épisode", position: "insideBottom", offset: -5 }}
              className="text-muted-foreground"
            />
            <YAxis 
              label={{ value: "Makespan", angle: -90, position: "insideLeft" }}
              className="text-muted-foreground"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }}
            />
            <Line 
              type="monotone" 
              dataKey="makespan" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
