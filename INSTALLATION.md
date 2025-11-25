# Guide d'Installation - Q-Learning Ordonnancement

## Prérequis Système

Avant de commencer, assurez-vous d'avoir installé :

### Node.js et npm
- **Version requise** : Node.js >= 18.0.0
- **Vérification** : 
  ```bash
  node --version
  npm --version
  ```

### Installation de Node.js (si nécessaire)

#### Windows
1. Téléchargez l'installateur depuis [nodejs.org](https://nodejs.org/)
2. Exécutez l'installateur et suivez les instructions
3. Redémarrez votre terminal

#### macOS
Avec Homebrew :
```bash
brew install node
```

#### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## Installation du Projet

### 1. Télécharger le Projet

Si vous avez reçu le projet en archive ZIP :
```bash
# Extraire l'archive
unzip projet-qlearning.zip
cd projet-qlearning
```

Si le projet est sur Git :
```bash
git clone [URL_DU_REPO]
cd [NOM_DU_DOSSIER]
```

### 2. Installer les Dépendances

```bash
npm install
```

Cette commande va installer toutes les dépendances listées ci-dessous.

## Dépendances du Projet

### Dépendances de Production

```json
{
  "dependencies": {
    "@hookform/resolvers": "^3.10.0",
    "@radix-ui/react-accordion": "^1.2.11",
    "@radix-ui/react-alert-dialog": "^1.1.14",
    "@radix-ui/react-aspect-ratio": "^1.1.7",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-context-menu": "^2.2.15",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-hover-card": "^1.1.14",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-menubar": "^1.1.15",
    "@radix-ui/react-navigation-menu": "^1.2.13",
    "@radix-ui/react-popover": "^1.1.14",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-radio-group": "^1.3.7",
    "@radix-ui/react-scroll-area": "^1.2.9",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.5",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.5",
    "@radix-ui/react-tabs": "^1.1.12",
    "@radix-ui/react-toast": "^1.2.14",
    "@radix-ui/react-toggle": "^1.1.9",
    "@radix-ui/react-toggle-group": "^1.1.10",
    "@radix-ui/react-tooltip": "^1.2.7",
    "@tanstack/react-query": "^5.83.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.6.0",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.462.0",
    "next-themes": "^0.3.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.61.1",
    "react-resizable-panels": "^2.1.9",
    "react-router-dom": "^6.30.1",
    "recharts": "^2.15.4",
    "sonner": "^1.7.4",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.9",
    "zod": "^3.25.76"
  }
}
```

### Description des Dépendances Principales

#### Framework et Core
- **react** (^18.3.1) : Bibliothèque principale pour construire l'interface utilisateur
- **react-dom** (^18.3.1) : Gestion du DOM pour React
- **react-router-dom** (^6.30.1) : Navigation entre les pages

#### UI Components (shadcn/ui basé sur Radix UI)
- **@radix-ui/react-*** : Composants UI accessibles et non stylisés
  - Accordéon, Dialog, Dropdown, Select, Tabs, etc.
  - Base pour les composants shadcn/ui

#### Styling
- **tailwindcss** : Framework CSS utility-first
- **tailwind-merge** (^2.6.0) : Fusion intelligente des classes Tailwind
- **tailwindcss-animate** (^1.0.7) : Animations pour Tailwind
- **class-variance-authority** (^0.7.1) : Gestion des variantes de composants

#### Icônes et Assets
- **lucide-react** (^0.462.0) : Bibliothèque d'icônes moderne et légère

#### Formulaires et Validation
- **react-hook-form** (^7.61.1) : Gestion des formulaires performante
- **@hookform/resolvers** (^3.10.0) : Intégration avec les validateurs
- **zod** (^3.25.76) : Schémas de validation TypeScript

#### Data Management
- **@tanstack/react-query** (^5.83.0) : Gestion d'état asynchrone et cache

#### Notifications
- **sonner** (^1.7.4) : Notifications toast élégantes

#### Utilitaires
- **clsx** (^2.1.1) : Construction conditionnelle de classes CSS
- **date-fns** (^3.6.0) : Manipulation de dates
- **next-themes** (^0.3.0) : Gestion du thème clair/sombre

### Dépendances de Développement

Ces dépendances sont déjà configurées dans le projet :

```json
{
  "devDependencies": {
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react-swc": "^3.5.0",
    "typescript": "^5.2.2",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

## Lancement de l'Application

### Mode Développement

```bash
npm run dev
```

L'application sera accessible sur : **http://localhost:8080**

Le serveur de développement inclut :
- Hot Module Replacement (HMR) : rechargement automatique
- Messages d'erreur détaillés
- Source maps pour le debugging

### Build de Production

```bash
npm run build
```

Crée une version optimisée dans le dossier `dist/`

### Prévisualisation du Build

```bash
npm run preview
```

Lance un serveur local pour tester le build de production

## Structure des Fichiers

```
projet-qlearning/
├── node_modules/          # Dépendances installées (créé après npm install)
├── public/                # Assets statiques
├── src/
│   ├── components/        # Composants React
│   │   ├── ui/           # Composants UI réutilisables
│   │   ├── ProblemSetup.tsx
│   │   ├── TrainingControls.tsx
│   │   ├── GanttChart.tsx
│   │   └── QTableVisualization.tsx
│   ├── lib/
│   │   ├── qlearning.ts  # Algorithme Q-Learning
│   │   └── utils.ts      # Utilitaires
│   ├── pages/
│   │   ├── Index.tsx     # Page principale
│   │   └── NotFound.tsx  # Page 404
│   ├── App.tsx           # Composant racine
│   ├── main.tsx          # Point d'entrée
│   └── index.css         # Styles globaux
├── index.html            # Template HTML
├── package.json          # Configuration npm
├── tsconfig.json         # Configuration TypeScript
├── tailwind.config.ts    # Configuration Tailwind
├── vite.config.ts        # Configuration Vite
├── README.md             # Documentation principale
└── INSTALLATION.md       # Ce fichier
```

## Résolution des Problèmes Courants

### Erreur : "node: command not found"
**Solution** : Node.js n'est pas installé. Suivez les instructions d'installation ci-dessus.

### Erreur : "npm install" échoue
**Solutions** :
```bash
# Nettoyer le cache npm
npm cache clean --force

# Supprimer node_modules et package-lock.json
rm -rf node_modules package-lock.json

# Réinstaller
npm install
```

### Erreur : Port 8080 déjà utilisé
**Solution** : Modifier le port dans `vite.config.ts` ou arrêter le processus utilisant le port 8080

### Erreur de compilation TypeScript
**Solutions** :
- Vérifier que TypeScript est installé : `npm install -D typescript`
- Régénérer les types : `npx tsc --noEmit`

### L'application ne se charge pas
**Solutions** :
1. Vérifier que le serveur de développement est lancé
2. Vider le cache du navigateur (Ctrl+Shift+R)
3. Consulter la console développeur du navigateur (F12)

## Configuration Avancée

### Variables d'Environnement

Créez un fichier `.env` à la racine si nécessaire :

```env
VITE_APP_TITLE=Q-Learning Ordonnancement
```

### Modification du Port

Dans `vite.config.ts` :

```typescript
export default defineConfig({
  server: {
    port: 3000,  // Changer ici
    host: "::"
  }
})
```

## Compatibilité Navigateurs

L'application est compatible avec :
- Chrome/Edge (dernières versions)
- Firefox (dernières versions)
- Safari (dernières versions)

## Support

Pour toute question ou problème :
1. Consultez le README.md principal
2. Vérifiez les logs dans la console (F12 dans le navigateur)
3. Assurez-vous que toutes les dépendances sont correctement installées

## Mise à Jour des Dépendances

Pour mettre à jour les dépendances :

```bash
# Vérifier les packages obsolètes
npm outdated

# Mettre à jour tous les packages
npm update

# Mettre à jour un package spécifique
npm install package-name@latest
```

## Build pour Déploiement

```bash
# Build de production
npm run build

# Le dossier dist/ peut être déployé sur :
# - Vercel
# - Netlify
# - GitHub Pages
# - Serveur web classique (nginx, apache)
```
