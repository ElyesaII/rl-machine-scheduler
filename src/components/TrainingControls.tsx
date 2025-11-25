import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TrainingControlsProps {
  isTraining: boolean;
  episode: number;
  totalReward: number;
  bestMakespan: number;
  learningRate: number;
  discountFactor: number;
  epsilon: number;
  onLearningRateChange: (value: number) => void;
  onDiscountFactorChange: (value: number) => void;
  onEpsilonChange: (value: number) => void;
  onStepClick: () => void;
  onAutoTrainClick: () => void;
  onStopClick: () => void;
  onResetClick: () => void;
}

export const TrainingControls = ({
  isTraining,
  episode,
  totalReward,
  bestMakespan,
  learningRate,
  discountFactor,
  epsilon,
  onLearningRateChange,
  onDiscountFactorChange,
  onEpsilonChange,
  onStepClick,
  onAutoTrainClick,
  onStopClick,
  onResetClick,
}: TrainingControlsProps) => {
  return (
    <Card className="border-primary/20 shadow-md">
      <CardHeader>
        <CardTitle className="text-primary">Contrôles d'Apprentissage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label className="text-xs">Taux d'apprentissage (α)</Label>
            <Input
              type="number"
              step={0.01}
              min={0}
              max={1}
              value={learningRate}
              onChange={e => onLearningRateChange(parseFloat(e.target.value) || 0.1)}
              disabled={isTraining}
              className="h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Facteur d'actualisation (γ)</Label>
            <Input
              type="number"
              step={0.01}
              min={0}
              max={1}
              value={discountFactor}
              onChange={e => onDiscountFactorChange(parseFloat(e.target.value) || 0.95)}
              disabled={isTraining}
              className="h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Exploration (ε)</Label>
            <Input
              type="number"
              step={0.01}
              min={0}
              max={1}
              value={epsilon}
              onChange={e => onEpsilonChange(parseFloat(e.target.value) || 0.3)}
              disabled={isTraining}
              className="h-8"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{episode}</div>
            <div className="text-xs text-muted-foreground">Épisodes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {totalReward.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Récompense</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">
              {bestMakespan > 0 ? bestMakespan : "—"}
            </div>
            <div className="text-xs text-muted-foreground">Meilleur Makespan</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={onStepClick}
            disabled={isTraining}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <SkipForward className="h-4 w-4 mr-2" />
            Un Épisode
          </Button>
          
          {!isTraining ? (
            <Button
              onClick={onAutoTrainClick}
              className="bg-gradient-accent"
            >
              <Play className="h-4 w-4 mr-2" />
              Auto
            </Button>
          ) : (
            <Button onClick={onStopClick} variant="destructive">
              <Pause className="h-4 w-4 mr-2" />
              Stop
            </Button>
          )}
        </div>

        <Button
          onClick={onResetClick}
          variant="outline"
          className="w-full"
          disabled={isTraining}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Réinitialiser
        </Button>
      </CardContent>
    </Card>
  );
};
