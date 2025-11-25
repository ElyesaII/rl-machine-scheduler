import { useState, useRef } from "react";
import { ProblemSetup } from "@/components/ProblemSetup";
import { GanttChart } from "@/components/GanttChart";
import { QTableVisualization } from "@/components/QTableVisualization";
import { TrainingControls } from "@/components/TrainingControls";
import { Product, QLearningScheduler, ScheduleState } from "@/lib/qlearning";
import { toast } from "sonner";
import { Factory } from "lucide-react";

const Index = () => {
  const [started, setStarted] = useState(false);
  const [scheduler, setScheduler] = useState<QLearningScheduler | null>(null);
  const [numMachines, setNumMachines] = useState(0);
  const [episode, setEpisode] = useState(0);
  const [totalReward, setTotalReward] = useState(0);
  const [bestMakespan, setBestMakespan] = useState(0);
  const [currentSchedule, setCurrentSchedule] = useState<ScheduleState | null>(null);
  const [qTableEntries, setQTableEntries] = useState<any[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const trainingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [learningRate, setLearningRate] = useState(0.1);
  const [discountFactor, setDiscountFactor] = useState(0.95);
  const [epsilon, setEpsilon] = useState(0.3);

  const handleStart = (products: Product[], numMachines: number) => {
    const newScheduler = new QLearningScheduler(
      products,
      numMachines,
      learningRate,
      discountFactor,
      epsilon
    );
    setScheduler(newScheduler);
    setNumMachines(numMachines);
    setStarted(true);
    setEpisode(0);
    setTotalReward(0);
    setBestMakespan(0);
    setCurrentSchedule(null);
    setQTableEntries([]);
    toast.success("Configuration chargée avec succès");
  };

  const runSingleEpisode = () => {
    if (!scheduler) return;

    const result = scheduler.trainEpisode();
    const makespan = scheduler.getMakespan(result.finalState);
    
    setEpisode(prev => prev + 1);
    setTotalReward(result.totalReward);
    
    if (bestMakespan === 0 || makespan < bestMakespan) {
      setBestMakespan(makespan);
      setCurrentSchedule(result.finalState);
      toast.success(`Nouveau meilleur makespan: ${makespan}`);
    }
    
    setQTableEntries(scheduler.getQTableEntries());
  };

  const handleStepClick = () => {
    runSingleEpisode();
  };

  const handleAutoTrainClick = () => {
    setIsTraining(true);
    trainingIntervalRef.current = setInterval(() => {
      runSingleEpisode();
    }, 100);
  };

  const handleStopClick = () => {
    setIsTraining(false);
    if (trainingIntervalRef.current) {
      clearInterval(trainingIntervalRef.current);
      trainingIntervalRef.current = null;
    }
  };

  const handleResetClick = () => {
    handleStopClick();
    setStarted(false);
    setScheduler(null);
    setEpisode(0);
    setTotalReward(0);
    setBestMakespan(0);
    setCurrentSchedule(null);
    setQTableEntries([]);
    toast.info("Réinitialisation effectuée");
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Factory className="h-12 w-12 text-primary" />
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Q-Learning Ordonnancement
              </h1>
            </div>
            <p className="text-muted-foreground">
              Optimisation du Job Shop Scheduling par Apprentissage par Renforcement
            </p>
          </div>
          <ProblemSetup onStart={handleStart} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Factory className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Q-Learning Ordonnancement
              </h1>
              <p className="text-sm text-muted-foreground">
                Apprentissage en cours...
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TrainingControls
              isTraining={isTraining}
              episode={episode}
              totalReward={totalReward}
              bestMakespan={bestMakespan}
              learningRate={learningRate}
              discountFactor={discountFactor}
              epsilon={epsilon}
              onLearningRateChange={setLearningRate}
              onDiscountFactorChange={setDiscountFactor}
              onEpsilonChange={setEpsilon}
              onStepClick={handleStepClick}
              onAutoTrainClick={handleAutoTrainClick}
              onStopClick={handleStopClick}
              onResetClick={handleResetClick}
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <GanttChart schedule={currentSchedule} numMachines={numMachines} />
            <QTableVisualization entries={qTableEntries} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
