import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScheduleState } from "@/lib/qlearning";

interface GanttChartProps {
  schedule: ScheduleState | null;
  numMachines: number;
}

const COLORS = [
  "hsl(195, 85%, 55%)",
  "hsl(25, 95%, 58%)",
  "hsl(142, 71%, 50%)",
  "hsl(280, 80%, 60%)",
  "hsl(45, 90%, 55%)",
  "hsl(340, 80%, 60%)",
];

export const GanttChart = ({ schedule, numMachines }: GanttChartProps) => {
  if (!schedule) {
    return (
      <Card className="border-primary/20 shadow-md">
        <CardHeader>
          <CardTitle className="text-primary">Diagramme de Gantt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Aucun planning à afficher
          </div>
        </CardContent>
      </Card>
    );
  }

  const makespan = Math.max(
    ...Array.from(schedule.machineSchedules.values()).flatMap(s =>
      s.map(item => item.endTime)
    ),
    1
  );

  const timeScale = 100 / makespan;

  return (
    <Card className="border-primary/20 shadow-md">
      <CardHeader>
        <CardTitle className="text-primary">Diagramme de Gantt</CardTitle>
        <p className="text-sm text-muted-foreground">
          Makespan: <span className="font-semibold text-foreground">{makespan}</span> unités
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: numMachines }, (_, machineId) => {
            const machineSchedule = schedule.machineSchedules.get(machineId) || [];

            return (
              <div key={machineId} className="space-y-1">
                <div className="text-sm font-medium text-foreground">
                  Machine {machineId}
                </div>
                <div className="relative h-12 bg-muted/30 rounded-lg border border-border overflow-hidden">
                  {machineSchedule.map((item, idx) => {
                    const left = (item.startTime / makespan) * 100;
                    const width = ((item.endTime - item.startTime) / makespan) * 100;
                    const color = COLORS[item.operation.productId % COLORS.length];

                    return (
                      <div
                        key={idx}
                        className="absolute top-0 h-full flex items-center justify-center text-xs font-medium text-white transition-all duration-300 hover:opacity-90"
                        style={{
                          left: `${left}%`,
                          width: `${width}%`,
                          backgroundColor: color,
                          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        }}
                        title={`Produit ${item.operation.productId}, Op ${item.operation.operationIndex}, ${item.startTime}-${item.endTime}`}
                      >
                        <span className="px-1 truncate">
                          P{item.operation.productId}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground mb-2">Légende</div>
          <div className="flex flex-wrap gap-3">
            {Array.from(
              new Set(
                Array.from(schedule.machineSchedules.values()).flatMap(s =>
                  s.map(item => item.operation.productId)
                )
              )
            )
              .sort()
              .map(productId => (
                <div key={productId} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: COLORS[productId % COLORS.length] }}
                  />
                  <span className="text-sm">Produit {productId}</span>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
