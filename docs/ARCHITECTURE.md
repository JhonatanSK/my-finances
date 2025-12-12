# Arquitetura do Projeto

Este documento descreve a arquitetura e organização do projeto Clarus.

## Princípios Arquiteturais

1. **Offline-first**: App funciona 100% offline
2. **Separação de Responsabilidades**: UI, lógica de negócio e persistência separadas
3. **Dependências Unidirecionais**: UI → Hooks/Contexts → Services → Storage
4. **Tipagem Forte**: TypeScript em todo o código

## Camadas da Aplicação

```
┌─────────────────────────────────────┐
│         UI Layer                    │
│  (app/, components/)                │
│  - Telas e componentes visuais      │
│  - Sem lógica de negócio           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Hooks / Contexts Layer          │
│  (hooks/, contexts/)                 │
│  - Orquestração de estado           │
│  - Comunicação UI ↔ Services        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Services Layer                │
│  (services/)                         │
│  - Lógica de negócio pura           │
│  - Cálculos financeiros              │
│  - Regras de domínio                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Storage Layer                 │
│  (services/storage/)                  │
│  - Abstração de persistência         │
│  - Implementação AsyncStorage         │
└─────────────────────────────────────┘
```

## Estrutura de Pastas

### `/app`
Rotas e telas usando Expo Router (file-based routing).

**Responsabilidades:**
- Navegação
- Composição de componentes
- Interação do usuário

**Não deve conter:**
- Lógica de cálculo
- Regras de negócio
- Acesso direto a services

### `/components`
Componentes React reutilizáveis.

**Organização:**
- `components/ui/`: Componentes genéricos (botões, inputs, etc.)
- `components/reports/`: Componentes específicos de relatórios
- `components/snapshots/`: Componentes específicos de snapshots

**Responsabilidades:**
- Renderização visual
- Interações básicas (clicks, inputs)

**Não deve conter:**
- Lógica de cálculo
- Acesso direto a storage

### `/contexts`
React Contexts para estado global.

**Contexts atuais:**
- `ReportsContext`: CRUD de relatórios e snapshots
- `SettingsContext`: Configurações e entitlements

**Responsabilidades:**
- Gerenciamento de estado global
- Orquestração de operações
- Comunicação entre UI e Services

**Não deve conter:**
- Lógica de cálculo (usa services)
- Regras de negócio complexas

### `/hooks`
Custom hooks para reutilização de lógica.

**Hooks atuais:**
- `useReports`: Acesso a relatórios
- `useSnapshots`: Acesso a snapshots
- `useColorScheme`: Gerenciamento de tema

**Responsabilidades:**
- Abstrair acesso a contexts
- Simplificar uso em componentes

### `/services`
Lógica de negócio e infraestrutura.

**Estrutura:**
```
services/
├── calculations/    # Cálculos financeiros
│   ├── projections.ts
│   └── health.ts
├── storage/         # Persistência
│   ├── StorageService.ts (interface)
│   └── LocalStorageService.ts (implementação)
├── cloud/           # (Futuro) Sincronização cloud
├── iap/             # (Futuro) In-app purchases
└── ads/             # (Futuro) Anúncios
```

**Responsabilidades:**
- Toda lógica de cálculo
- Regras de domínio
- Abstrações de infraestrutura

**Princípios:**
- Funções puras quando possível
- Sem dependências de UI
- Testáveis isoladamente

### `/models`
Tipos e interfaces TypeScript.

**Modelos atuais:**
- `report.ts`: Interface Report
- `snapshot.ts`: Interface Snapshot
- `projections.ts`: Interface MonthlyProjection
- `entitlements.ts`: Feature flags e permissões

**Responsabilidades:**
- Definir estruturas de dados
- Garantir tipagem consistente

### `/utils`
Funções utilitárias.

**Utilitários:**
- `date.ts`: Formatação de datas
- `format.ts`: Formatação de valores (moeda, percentual)
- `uuid.ts`: Geração de IDs

**Responsabilidades:**
- Funções auxiliares reutilizáveis
- Sem dependências de negócio

## Feature Flags / Entitlements

Sistema de permissões e flags de features.

**Localização:** `models/entitlements.ts`

**Flags disponíveis:**
- `isPro`: Acesso a features premium
- `adsEnabled`: Exibição de anúncios
- `cloudSyncEnabled`: Sincronização cloud

**Uso:**
```ts
import { useSettings } from '@/hooks/useSettings';

const { entitlements } = useSettings();
if (entitlements.isPro) {
  // Mostrar feature premium
}
```

**Estado inicial:** Todas as flags são `false` (features desabilitadas).

## Fluxo de Dados

### Exemplo: Criar Relatório

```
1. Usuário preenche formulário (app/report/form.tsx)
   ↓
2. Componente chama hook (hooks/useReports.ts)
   ↓
3. Hook acessa context (contexts/ReportsContext.tsx)
   ↓
4. Context chama service (services/storage/LocalStorageService.ts)
   ↓
5. Service persiste dados (AsyncStorage)
   ↓
6. Context atualiza estado
   ↓
7. UI re-renderiza com novo relatório
```

### Exemplo: Calcular Projeções

```
1. Componente precisa de projeções (app/report/[id].tsx)
   ↓
2. Hook retorna projeções (hooks/useReports.ts)
   ↓
3. Context orquestra (contexts/ReportsContext.tsx)
   ↓
4. Service calcula (services/calculations/projections.ts)
   ↓
5. Retorna resultado para UI
```

## Regras de Ouro

1. **Nunca importar services diretamente em componentes UI**
   ```ts
   // ❌ Errado
   import { generateProjections } from '@/services/calculations/projections';
   
   // ✅ Correto
   const { getProjections } = useReports();
   ```

2. **Contexts não contêm lógica de cálculo**
   ```ts
   // ❌ Errado: Cálculo no context
   const calculateProjections = (report) => {
     // lógica de cálculo aqui
   };
   
   // ✅ Correto: Context chama service
   const getProjections = (id) => {
     const report = getReport(id);
     return generateProjections(report); // service
   };
   ```

3. **Services são puros e testáveis**
   ```ts
   // ✅ Correto: Função pura
   export function generateProjections(report: Report): MonthlyProjection[] {
     // Sem side effects
     // Retorna resultado baseado apenas no input
   }
   ```

4. **UI não conhece storage**
   ```ts
   // ❌ Errado: UI acessa storage
   import AsyncStorage from '@react-native-async-storage/async-storage';
   
   // ✅ Correto: UI usa context/hook
   const { createReport } = useReports();
   ```

## Preparação para Futuro

A arquitetura está preparada para:

- **Cloud Sync**: Pasta `services/cloud/` pronta para implementação
- **IAP**: Pasta `services/iap/` pronta para implementação
- **Ads**: Pasta `services/ads/` pronta para implementação
- **Internacionalização**: Estrutura em `SettingsContext` preparada

Nenhuma refatoração estrutural será necessária ao adicionar essas features.

