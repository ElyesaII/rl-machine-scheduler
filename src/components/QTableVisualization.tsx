import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QTableEntry } from "@/lib/qlearning";
import { useMemo } from "react";

interface QTableVisualizationProps {
  entries: QTableEntry[];
}

export const QTableVisualization = ({ entries }: QTableVisualizationProps) => {
  const topEntries = useMemo(() => {
    return entries.slice(0, 50);
  }, [entries]);

  const maxQValue = useMemo(() => {
    return Math.max(...entries.map(e => Math.abs(e.qValue)), 1);
  }, [entries]);

  const getColorIntensity = (qValue: number) => {
    const normalized = qValue / maxQValue;
    const intensity = Math.abs(normalized) * 100;
    
    if (normalized > 0) {
      return `hsl(142, 71%, ${100 - intensity * 0.5}%)`;
    } else {
      return `hsl(0, 84%, ${100 - intensity * 0.5}%)`;
    }
  };

  if (entries.length === 0) {
    return (
      <Card className="border-primary/20 shadow-md">
        <CardHeader>
          <CardTitle className="text-primary">Q-Table</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Aucune donnée d'apprentissage
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 shadow-md">
      <CardHeader>
        <CardTitle className="text-primary">Q-Table (Top 50)</CardTitle>
        <p className="text-sm text-muted-foreground">
          Total d'entrées: <span className="font-semibold text-foreground">{entries.length}</span>
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {topEntries.map((entry, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg border border-border transition-all hover:shadow-md"
              style={{ backgroundColor: getColorIntensity(entry.qValue) }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-foreground">
                  Action: {entry.action}
                </span>
                <span className="text-sm font-bold text-foreground">
                  Q = {entry.qValue.toFixed(3)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground truncate" title={entry.state}>
                État: {entry.state}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground mb-2">Légende</div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-4 rounded" style={{ backgroundColor: "hsl(142, 71%, 50%)" }} />
              <span className="text-xs">Valeur Q positive (bonne action)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-4 rounded" style={{ backgroundColor: "hsl(0, 84%, 50%)" }} />
              <span className="text-xs">Valeur Q négative (mauvaise action)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
