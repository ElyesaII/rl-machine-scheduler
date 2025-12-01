export interface Operation {
  productId: number;
  machineId: number;
  duration: number;
  operationIndex: number;
}

export interface Product {
  id: number;
  name: string;
  operations: Operation[];
  releaseTime: number; // Time when product becomes available
  priority: number; // Priority level (1-3, where 3 is highest)
}

export interface ScheduleState {
  machineSchedules: Map<number, { operation: Operation; startTime: number; endTime: number }[]>;
  currentTime: number;
  completedOperations: Set<string>;
  productProgress: Map<number, number>; // productId -> next operation index
}

export interface QTableEntry {
  state: string;
  action: string;
  qValue: number;
}

export class QLearningScheduler {
  private qTable: Map<string, Map<string, number>> = new Map();
  private learningRate: number;
  private discountFactor: number;
  private epsilon: number;
  private products: Product[];
  private numMachines: number;

  constructor(
    products: Product[],
    numMachines: number,
    learningRate = 0.1,
    discountFactor = 0.95,
    epsilon = 0.3
  ) {
    this.products = products;
    this.numMachines = numMachines;
    this.learningRate = learningRate;
    this.discountFactor = discountFactor;
    this.epsilon = epsilon;
  }

  // Encode state as string for Q-table
  private encodeState(state: ScheduleState): string {
    const progress = Array.from(state.productProgress.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([pid, idx]) => `${pid}:${idx}`)
      .join(',');
    
    const machineStatus = Array.from({ length: this.numMachines }, (_, i) => {
      const schedule = state.machineSchedules.get(i) || [];
      const busy = schedule.some(s => s.endTime > state.currentTime);
      return busy ? '1' : '0';
    }).join('');

    return `${progress}|${machineStatus}`;
  }

  // Get available operations that can be scheduled
  private getAvailableOperations(state: ScheduleState): Operation[] {
    const available: Operation[] = [];
    
    for (const product of this.products) {
      const nextOpIndex = state.productProgress.get(product.id) || 0;
      
      if (nextOpIndex < product.operations.length) {
        const operation = product.operations[nextOpIndex];
        
        // CONSTRAINT 0: Check if product is available (release time)
        if (state.currentTime < product.releaseTime) {
          continue; // Product not yet available
        }
        
        // CONSTRAINT 1: Check if previous operation of the same product is completed
        if (nextOpIndex > 0) {
          const previousOp = product.operations[nextOpIndex - 1];
          const previousOpSchedules = state.machineSchedules.get(previousOp.machineId) || [];
          const previousOpSchedule = previousOpSchedules.find(
            s => s.operation.productId === product.id && 
                 s.operation.operationIndex === nextOpIndex - 1
          );
          
          // Previous operation must be completed before current time
          if (!previousOpSchedule || previousOpSchedule.endTime > state.currentTime) {
            continue; // Skip this operation, previous not completed yet
          }
        }
        
        // CONSTRAINT 2: Check if machine is available at current time
        const machineSchedule = state.machineSchedules.get(operation.machineId) || [];
        const machineAvailableTime = machineSchedule.length > 0
          ? Math.max(...machineSchedule.map(s => s.endTime))
          : 0;
        
        if (machineAvailableTime <= state.currentTime) {
          available.push(operation);
        }
      }
    }
    
    return available;
  }

  // Encode action as string
  private encodeAction(operation: Operation): string {
    return `P${operation.productId}:M${operation.machineId}:Op${operation.operationIndex}`;
  }

  // Get Q-value for state-action pair
  private getQValue(state: string, action: string): number {
    if (!this.qTable.has(state)) {
      this.qTable.set(state, new Map());
    }
    const stateActions = this.qTable.get(state)!;
    return stateActions.get(action) || 0;
  }

  // Set Q-value for state-action pair
  private setQValue(state: string, action: string, value: number): void {
    if (!this.qTable.has(state)) {
      this.qTable.set(state, new Map());
    }
    this.qTable.get(state)!.set(action, value);
  }

  // Choose action using epsilon-greedy strategy
  private chooseAction(state: ScheduleState, availableOps: Operation[]): Operation | null {
    if (availableOps.length === 0) return null;

    if (Math.random() < this.epsilon) {
      // Exploration: random action
      return availableOps[Math.floor(Math.random() * availableOps.length)];
    } else {
      // Exploitation: best known action
      const stateStr = this.encodeState(state);
      let bestOp = availableOps[0];
      let bestQValue = this.getQValue(stateStr, this.encodeAction(bestOp));

      for (const op of availableOps) {
        const qValue = this.getQValue(stateStr, this.encodeAction(op));
        if (qValue > bestQValue) {
          bestQValue = qValue;
          bestOp = op;
        }
      }

      return bestOp;
    }
  }

  // Apply operation to state
  private applyOperation(state: ScheduleState, operation: Operation): ScheduleState {
    const newState: ScheduleState = {
      machineSchedules: new Map(state.machineSchedules),
      currentTime: state.currentTime,
      completedOperations: new Set(state.completedOperations),
      productProgress: new Map(state.productProgress),
    };

    // Deep copy machine schedules
    for (const [machineId, schedule] of state.machineSchedules) {
      newState.machineSchedules.set(machineId, [...schedule]);
    }

    const machineSchedule = newState.machineSchedules.get(operation.machineId) || [];
    const startTime = state.currentTime;
    const endTime = startTime + operation.duration;

    machineSchedule.push({
      operation,
      startTime,
      endTime,
    });

    newState.machineSchedules.set(operation.machineId, machineSchedule);
    newState.completedOperations.add(this.encodeAction(operation));
    
    const currentProgress = newState.productProgress.get(operation.productId) || 0;
    newState.productProgress.set(operation.productId, currentProgress + 1);

    return newState;
  }

  // Calculate reward for an action
  private calculateReward(
    oldState: ScheduleState,
    newState: ScheduleState,
    operation: Operation
  ): number {
    let reward = 0;

    // Base reward: negative proportional to operation duration (encourage shorter times)
    reward -= operation.duration * 0.1;

    // Check if this operation completes a product
    const product = this.products.find(p => p.id === operation.productId);
    if (product) {
      const progress = newState.productProgress.get(product.id) || 0;
      if (progress === product.operations.length) {
        // Product completed! Give priority-based bonus
        // Priority 3 (highest) gets 500, Priority 2 gets 300, Priority 1 gets 150
        const priorityBonus = product.priority * 150 + 50;
        reward += priorityBonus;
        
        // Additional bonus inversely proportional to completion time
        const completionTime = Math.max(
          ...Array.from(newState.machineSchedules.values())
            .flatMap(schedule => 
              schedule
                .filter(s => s.operation.productId === product.id)
                .map(s => s.endTime)
            )
        );
        reward += (1000 / completionTime) * product.priority;
      }
    }

    // Check if all operations are completed
    const allCompleted = this.products.every(product => {
      const progress = newState.productProgress.get(product.id) || 0;
      return progress === product.operations.length;
    });

    if (allCompleted) {
      // Large positive reward for completing all jobs
      const makespan = Math.max(
        ...Array.from(newState.machineSchedules.values()).flatMap(schedule =>
          schedule.map(s => s.endTime)
        )
      );
      // Reward inversely proportional to makespan
      reward += 1000 / makespan;
    }

    // Penalty for machine idle time
    const totalMachineTime = Array.from(newState.machineSchedules.values()).reduce(
      (sum, schedule) => {
        if (schedule.length > 0) {
          const maxTime = Math.max(...schedule.map(s => s.endTime));
          return sum + maxTime;
        }
        return sum;
      },
      0
    );

    const averageUtilization = totalMachineTime / (this.numMachines * newState.currentTime || 1);
    reward += averageUtilization * 10;

    return reward;
  }

  // Update Q-value
  private updateQValue(
    state: string,
    action: string,
    reward: number,
    nextState: string,
    availableNextActions: Operation[]
  ): void {
    const currentQ = this.getQValue(state, action);

    // Find max Q-value for next state
    let maxNextQ = 0;
    if (availableNextActions.length > 0) {
      maxNextQ = Math.max(
        ...availableNextActions.map(op => this.getQValue(nextState, this.encodeAction(op)))
      );
    }

    // Q-learning update rule
    const newQ = currentQ + this.learningRate * (reward + this.discountFactor * maxNextQ - currentQ);
    this.setQValue(state, action, newQ);
  }

  // Run one episode of training
  trainEpisode(): { finalState: ScheduleState; totalReward: number; steps: number } {
    let state: ScheduleState = {
      machineSchedules: new Map(),
      currentTime: 0,
      completedOperations: new Set(),
      productProgress: new Map(this.products.map(p => [p.id, 0])),
    };

    // Initialize machine schedules
    for (let i = 0; i < this.numMachines; i++) {
      state.machineSchedules.set(i, []);
    }

    let totalReward = 0;
    let steps = 0;
    const maxSteps = this.products.reduce((sum, p) => sum + p.operations.length, 0) * 2;

    while (steps < maxSteps) {
      const availableOps = this.getAvailableOperations(state);
      
      if (availableOps.length === 0) {
        // No operations available, advance time
        const nextEventTime = Math.min(
          ...Array.from(state.machineSchedules.values()).flatMap(schedule =>
            schedule
              .filter(s => s.endTime > state.currentTime)
              .map(s => s.endTime)
          ),
          Infinity
        );

        if (nextEventTime === Infinity) break; // All done or stuck
        
        state.currentTime = nextEventTime;
        continue;
      }

      const chosenOp = this.chooseAction(state, availableOps);
      if (!chosenOp) break;

      const stateStr = this.encodeState(state);
      const actionStr = this.encodeAction(chosenOp);

      const newState = this.applyOperation(state, chosenOp);
      const reward = this.calculateReward(state, newState, chosenOp);

      const newStateStr = this.encodeState(newState);
      const nextAvailableOps = this.getAvailableOperations(newState);

      this.updateQValue(stateStr, actionStr, reward, newStateStr, nextAvailableOps);

      state = newState;
      totalReward += reward;
      steps++;

      // Check if all completed
      const allCompleted = this.products.every(product => {
        const progress = state.productProgress.get(product.id) || 0;
        return progress === product.operations.length;
      });

      if (allCompleted) break;
    }

    return { finalState: state, totalReward, steps };
  }

  // Get Q-table as array for visualization
  getQTableEntries(): QTableEntry[] {
    const entries: QTableEntry[] = [];
    for (const [state, actions] of this.qTable) {
      for (const [action, qValue] of actions) {
        entries.push({ state, action, qValue });
      }
    }
    return entries.sort((a, b) => b.qValue - a.qValue);
  }

  // Get best schedule using learned policy (greedy)
  getBestSchedule(): ScheduleState {
    const originalEpsilon = this.epsilon;
    this.epsilon = 0; // Pure exploitation

    let state: ScheduleState = {
      machineSchedules: new Map(),
      currentTime: 0,
      completedOperations: new Set(),
      productProgress: new Map(this.products.map(p => [p.id, 0])),
    };

    for (let i = 0; i < this.numMachines; i++) {
      state.machineSchedules.set(i, []);
    }

    const maxSteps = this.products.reduce((sum, p) => sum + p.operations.length, 0) * 2;
    let steps = 0;

    while (steps < maxSteps) {
      const availableOps = this.getAvailableOperations(state);
      
      if (availableOps.length === 0) {
        const nextEventTime = Math.min(
          ...Array.from(state.machineSchedules.values()).flatMap(schedule =>
            schedule
              .filter(s => s.endTime > state.currentTime)
              .map(s => s.endTime)
          ),
          Infinity
        );

        if (nextEventTime === Infinity) break;
        state.currentTime = nextEventTime;
        continue;
      }

      const chosenOp = this.chooseAction(state, availableOps);
      if (!chosenOp) break;

      state = this.applyOperation(state, chosenOp);
      steps++;

      const allCompleted = this.products.every(product => {
        const progress = state.productProgress.get(product.id) || 0;
        return progress === product.operations.length;
      });

      if (allCompleted) break;
    }

    this.epsilon = originalEpsilon;
    return state;
  }

  getMakespan(state: ScheduleState): number {
    const times = Array.from(state.machineSchedules.values()).flatMap(schedule =>
      schedule.map(s => s.endTime)
    );
    return times.length > 0 ? Math.max(...times) : 0;
  }
}
