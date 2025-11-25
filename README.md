# Q-Learning pour l'Ordonnancement de Production (Job Shop Scheduling)

## 📋 Description du Projet

Ce projet implémente un système d'apprentissage par renforcement (Q-Learning) pour résoudre le problème d'ordonnancement de production (Job Shop Scheduling Problem - JSSP). L'objectif est d'optimiser l'affectation d'opérations de production sur des machines afin de minimiser le temps total de fabrication (makespan).

### Problématique

Le Job Shop Scheduling consiste à :
- Planifier **N produits** sur **M machines**
- Chaque produit nécessite une séquence d'opérations dans un ordre spécifique
- Chaque opération doit être réalisée sur une machine donnée et prend un temps défini
- Les contraintes incluent :
  - Une machine ne peut traiter qu'une opération à la fois
  - Les opérations d'un produit doivent respecter leur ordre de séquence
  - Minimiser le temps total (makespan)

## 🧠 Implémentation Q-Learning

### Composants de l'Algorithme

#### **État (State)**
L'état du système est défini par :
- La progression de chaque produit (quelle opération est en cours)
- L'état de disponibilité de chaque machine
- Le temps actuel dans le planning

#### **Actions**
Les actions possibles sont :
- Affecter la prochaine opération disponible d'un produit à une machine libre

#### **Récompenses (Rewards)**
Le système de récompense est conçu pour :
- **Récompense négative proportionnelle au temps** : -0.1 × durée de l'opération
- **Récompense positive pour la complétion** : +1000 / makespan final
- **Bonus d'utilisation** : +10 × taux d'utilisation des machines
- **Pénalité forte** : pour les violations de contraintes

#### **Paramètres Q-Learning**
- **α (learning rate)** : Taux d'apprentissage (défaut: 0.1)
  - Contrôle la vitesse d'apprentissage
  - Valeurs élevées = apprentissage rapide mais instable
  
- **γ (discount factor)** : Facteur d'actualisation (défaut: 0.95)
  - Importance des récompenses futures
  - Proche de 1 = vision à long terme
  
- **ε (epsilon)** : Taux d'exploration (défaut: 0.3)
  - Équilibre exploration/exploitation
  - 0.3 = 30% d'actions aléatoires pour explorer

### Équation de Mise à Jour

```
Q(s,a) ← Q(s,a) + α[r + γ max Q(s',a') - Q(s,a)]
                              a'
```

Où :
- `s` = état actuel
- `a` = action choisie
- `r` = récompense obtenue
- `s'` = nouvel état
- `a'` = actions possibles depuis le nouvel état

## 🎯 Fonctionnalités

### Configuration du Problème
- Définir le nombre de machines (1-10)
- Créer des produits avec des séquences d'opérations personnalisées
- Spécifier pour chaque opération :
  - La machine requise
  - La durée de traitement

### Modes d'Apprentissage
1. **Mode Pas-à-Pas** : Exécuter un épisode d'apprentissage à la fois pour observer le processus
2. **Mode Automatique** : Entraînement continu pour convergence rapide

### Visualisations

#### 1. Diagramme de Gantt
- Représentation visuelle du planning optimal
- Chaque couleur représente un produit différent
- Axe horizontal = temps
- Axe vertical = machines
- Affiche le makespan actuel

#### 2. Visualisation de la Q-Table
- Top 50 des paires état-action
- Couleur verte = valeur Q positive (bonne action)
- Couleur rouge = valeur Q négative (mauvaise action)
- Intensité = magnitude de la valeur

#### 3. Statistiques en Temps Réel
- Nombre d'épisodes d'entraînement
- Récompense totale de l'épisode en cours
- Meilleur makespan trouvé

## 🚀 Installation et Utilisation

### Prérequis
- Node.js >= 18.0.0
- npm ou yarn

### Installation des Dépendances

```bash
npm install
```

Dépendances principales :
- **React 18** : Framework UI
- **TypeScript** : Typage statique
- **Vite** : Build tool rapide
- **Tailwind CSS** : Styling
- **shadcn/ui** : Composants UI
- **Lucide React** : Icônes
- **Sonner** : Notifications toast

### Lancement de l'Application

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:8080`

### Build Production

```bash
npm run build
```

## 📊 Utilisation de l'Interface

### 1. Configuration Initiale
1. Définissez le nombre de machines
2. Ajoutez des produits avec le bouton "Ajouter Produit"
3. Pour chaque produit, définissez ses opérations :
   - Numéro de machine (0 à N-1)
   - Durée de l'opération
4. Cliquez sur "Démarrer l'Apprentissage"

### 2. Entraînement du Modèle
1. **Un Épisode** : Lance un cycle complet d'apprentissage
   - L'agent essaie de planifier tous les produits
   - La Q-table est mise à jour
   - Le meilleur planning est affiché si trouvé

2. **Mode Auto** : Lance l'entraînement en continu
   - 10 épisodes par seconde
   - Arrêt avec le bouton "Stop"
   - Observe l'amélioration progressive du makespan

### 3. Ajustement des Hyperparamètres
- Modifiez α, γ, et ε selon vos besoins
- Valeurs recommandées :
  - α = 0.1-0.3 pour stabilité
  - γ = 0.9-0.99 pour vision long terme
  - ε = 0.2-0.4 pour bon équilibre exploration/exploitation

### 4. Analyse des Résultats
- **Gantt Chart** : Visualisez le planning optimal trouvé
- **Q-Table** : Comprenez quelles actions sont favorisées
- **Statistiques** : Suivez la progression de l'apprentissage

## 🔬 Exemple de Problème

### Configuration Simple (2 machines, 2 produits)

**Produit 1:**
- Opération 1: Machine 0, Durée 5
- Opération 2: Machine 1, Durée 3

**Produit 2:**
- Opération 1: Machine 1, Durée 4
- Opération 2: Machine 0, Durée 2

**Solution Optimale Attendue:**
- Makespan ≈ 9-10 unités
- Parallélisation des opérations quand possible

## 📚 Références Théoriques

### Algorithme Q-Learning
- Watkins, C.J.C.H. (1989). "Learning from Delayed Rewards"
- Sutton & Barto (2018). "Reinforcement Learning: An Introduction"

### Job Shop Scheduling
- Brucker, P. (2007). "Scheduling Algorithms"
- Pinedo, M. (2012). "Scheduling: Theory, Algorithms, and Systems"

## 🛠️ Architecture du Code

```
src/
├── components/
│   ├── ProblemSetup.tsx          # Configuration du problème
│   ├── TrainingControls.tsx      # Contrôles d'apprentissage
│   ├── GanttChart.tsx            # Visualisation du planning
│   ├── QTableVisualization.tsx   # Visualisation Q-table
│   └── ui/                       # Composants UI réutilisables
├── lib/
│   └── qlearning.ts              # Implémentation Q-Learning
├── pages/
│   └── Index.tsx                 # Page principale
└── index.css                     # Design system
```

### Fichier Principal: `qlearning.ts`

Contient :
- **`QLearningScheduler`** : Classe principale
  - `trainEpisode()` : Exécute un épisode d'apprentissage
  - `getBestSchedule()` : Obtient le meilleur planning (exploitation pure)
  - `getQTableEntries()` : Récupère les entrées de la Q-table
  - Méthodes privées pour l'encodage état/action, calcul de récompense, etc.

## 🎓 Concepts Pédagogiques

Ce projet illustre :
1. **Processus de Décision Markovien (MDP)** : États, actions, transitions, récompenses
2. **Équilibre Exploration/Exploitation** : Stratégie epsilon-greedy
3. **Apprentissage par différence temporelle** : Mise à jour incrémentale des valeurs Q
4. **Optimisation combinatoire** : Application pratique du RL à un problème NP-difficile

## ⚙️ Extensions Possibles

- Implémenter Deep Q-Learning (DQN) pour des problèmes plus complexes
- Ajouter des contraintes supplémentaires (deadlines, dépendances)
- Optimisation multi-objectifs (temps + coût + énergie)
- Comparaison avec des heuristiques classiques (SPT, LPT, etc.)
- Export/Import de configurations de problèmes

## 📄 Licence

Projet éducatif - INP-Ensiacet 3A IMSIC

## 👨‍💻 Auteur

Développé pour le cours d'Apprentissage par Renforcement 2025-2026
