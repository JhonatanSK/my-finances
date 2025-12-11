# App de Relatórios Financeiros Offline – Especificação Completa (Prompt)

Este documento descreve em detalhes um aplicativo mobile de **finanças pessoais**, 100% **offline**, focado em **projeção de metas financeiras** a partir de parâmetros mensais, incluindo:

- Relatórios parametrizáveis (tipo “planilhas inteligentes”)
- Projeção mensal de patrimônio com juros compostos
- Indicadores de saúde financeira (% de sobra)
- Snapshots (“visões salvas”) para comparação ao longo do tempo
- Estrutura de dados em **TypeScript**
- Esqueleto de UI em **React Native + Expo + TypeScript**
- Telas, componentes sugeridos e fluxos

Use este arquivo como **prompt** para uma IA gerar o projeto (código, telas, componentes, etc.).

---

## 1. Objetivo Geral do App

O app é um **simulador de metas financeiras**.

- O usuário cria vários **Relatórios**.
- Cada **Relatório** é um cenário financeiro independente (por exemplo: “Vida Geral”, “Aposentadoria”, “Kitnet”, “Somente salário Omelete”).
- Em cada Relatório o usuário configura:
  - Valor inicial (quanto tem hoje)
  - Entradas mensais (salários, rendas)
  - Saídas mensais (custos de vida, gastos fixos)
  - Taxa anual de investimento
  - Meta de patrimônio (opcional)
  - Duração da simulação (em anos)
  - Meses/índices destacados (ex.: Setembro, ou “mês 9 da simulação”)

O app:

1. Calcula a projeção mês a mês do patrimônio.
2. Diz em qual mês/ano a meta é atingida (se for).
3. Mostra indicadores de **saúde financeira mensal** (quanto % da renda é gasto e quanto é mantido, com e sem considerar o rendimento dos investimentos).
4. Permite salvar **Snapshots (“Visões”)** da projeção atual para comparação futura.

**Importante:**  
Tudo deve funcionar **100% offline**.  
Todos os dados são armazenados **localmente** (ex.: AsyncStorage, MMKV ou SQLite).  
Nenhum backend, nenhum login.

---

## 2. Stack e Arquitetura Técnica (React Native + TypeScript)

### 2.1. Tecnologias

- **Linguagem:** TypeScript
- **Framework mobile:** React Native (pode considerar uso com Expo)
- **Navegação:** React Navigation (stack + tabs, se desejar)
- **Persistência local:** 
  - Versão simples: AsyncStorage ou MMKV
  - Versão mais robusta: SQLite (via `expo-sqlite` ou outra lib)
- **Gráficos:** algum wrapper de gráfico para React Native (por exemplo, `victory-native` ou `react-native-svg-charts`). Pode ser apenas placeholder inicialmente.
- **Gerenciamento de estado:** 
  - Pode usar Context API + hooks, ou
  - Zustand / Jotai (opcional; escolha uma solução simples)

### 2.2. Estrutura de Pastas (esqueleto sugerido) 
OBS: foi utilizado o create-expo-app para montar a estrutura do projeto, portanto não precisa seguir a estrutura abaixo a risca, mescle e veja oq faz sentido.
```text
src/
  components/
    ReportCard.tsx
    SnapshotCard.tsx
    SectionHeader.tsx
    StatCard.tsx
    PrimaryButton.tsx
    TextField.tsx
    NumberField.tsx
    Chip.tsx

  screens/
    ReportsListScreen.tsx
    ReportFormScreen.tsx
    ReportDetailScreen.tsx
    ReportSnapshotsListScreen.tsx
    SnapshotDetailScreen.tsx
    SnapshotsCompareScreen.tsx
    SettingsScreen.tsx

  navigation/
    AppNavigator.tsx
    types.ts

  models/
    report.ts
    snapshot.ts
    projections.ts

  services/
    storage/
      StorageService.ts
      LocalStorageService.ts    // implementação offline
    calculations/
      projections.ts
      health.ts

  hooks/
    useReports.ts
    useSnapshots.ts

  theme/
    colors.ts
    spacing.ts
    typography.ts

  utils/
    date.ts
    format.ts

App.tsx
```

---

## 3. Modelos de Dados (TypeScript)

### 3.1. Relatório

Arquivo `src/models/report.ts`:

```ts
export interface InflowItem {
  id: string;
  name: string;
  amount: number; // valor mensal
}

export interface OutflowItem {
  id: string;
  name: string;
  amount: number; // valor mensal
}

export interface HighlightMonth {
  id: string;
  label: string;      // ex.: "Setembro de cada ano", "Mês 9"
  monthIndex: number; // 0 = primeiro mês da simulação
}

export interface Report {
  id: string;
  name: string;
  description?: string;

  startDate: string;        // ISO 'YYYY-MM-DD'
  initialAmount: number;

  inflowItems: InflowItem[];
  outflowItems: OutflowItem[];

  annualRate: number;       // ex.: 0.085 = 8,5% ao ano
  goalAmount?: number;      // meta (opcional)

  simulationYears: number;  // ex.: 10 anos

  highlightMonths: HighlightMonth[];

  createdAt: string;        // ISO datetime
  updatedAt: string;        // ISO datetime
}
```

### 3.2. Projeção Mensal

Arquivo `src/models/projections.ts`:

```ts
export interface MonthlyProjection {
  monthIndex: number;   // 0, 1, 2...
  date: string;         // ISO date da competência

  inflow: number;       // soma inflowItems
  outflow: number;      // soma outflowItems

  totalPrevious: number;     // patrimônio no fim do mês anterior
  totalBeforeYield: number;  // totalPrevious + inflow - outflow
  yieldAmount: number;       // lucro dos investimentos no mês
  finalAmount: number;       // totalBeforeYield + yieldAmount

  markers?: string[];   // ex.: ['GoalHit', 'HighlightedMonth']
}
```

### 3.3. Snapshot (Visão Salva)

Arquivo `src/models/snapshot.ts`:

```ts
export interface HighlightedMonthValue {
  label: string;   // ex.: "Setembro"
  date: string;    // ISO
  amount: number;
}

export interface Snapshot {
  id: string;
  reportId: string;

  createdAt: string;

  // Parâmetros usados nessa visão
  initialAmountAtSnapshot: number;
  annualRateAtSnapshot: number;
  goalAmountAtSnapshot?: number;
  simulationYearsAtSnapshot: number;

  // Resultado da meta naquela visão
  goalHitMonthIndex?: number | null;
  goalHitDate?: string | null;

  finalAmountAtEnd: number;

  highlightedMonthValues?: HighlightedMonthValue[];

  notes?: string;

  // opcional: projeção completa
  projections?: MonthlyProjection[];
}
```

---

## 4. Cálculos de Projeção e Saúde Financeira

### 4.1. Regras de Projeção Mensal

Crie um módulo `src/services/calculations/projections.ts` com funções em TypeScript:

```ts
import { Report } from "../../models/report";
import { MonthlyProjection } from "../../models/projections";

export function generateProjections(report: Report): MonthlyProjection[] {
  const months = report.simulationYears * 12;
  const monthlyInflow = report.inflowItems.reduce((sum, item) => sum + item.amount, 0);
  const monthlyOutflow = report.outflowItems.reduce((sum, item) => sum + item.amount, 0);
  const monthlyRate = report.annualRate / 12;

  const projections: MonthlyProjection[] = [];

  let totalPrevious = report.initialAmount;

  for (let monthIndex = 0; monthIndex < months; monthIndex++) {
    const date = /* calcular data a partir de startDate + monthIndex meses */ "";

    const inflow = monthlyInflow;
    const outflow = monthlyOutflow;

    const totalBeforeYield = totalPrevious + inflow - outflow;
    const yieldAmount = totalPrevious * monthlyRate;
    const finalAmount = totalBeforeYield + yieldAmount;

    const entry: MonthlyProjection = {
      monthIndex,
      date,
      inflow,
      outflow,
      totalPrevious,
      totalBeforeYield,
      yieldAmount,
      finalAmount,
      markers: [],
    };

    projections.push(entry);
    totalPrevious = finalAmount;
  }

  return projections;
}
```

Depois, crie uma função auxiliar para descobrir quando a meta é atingida:

```ts
export function findGoalHit(projections: MonthlyProjection[], goalAmount?: number) {
  if (!goalAmount) return { goalHitIndex: null as number | null, goalHitDate: null as string | null };

  for (const p of projections) {
    if (p.finalAmount >= goalAmount) {
      return { goalHitIndex: p.monthIndex, goalHitDate: p.date };
    }
  }

  return { goalHitIndex: null, goalHitDate: null };
}
```

Marque `markers` com `"GoalHit"` ou `"Highlight"` se quiser.

### 4.2. Cálculos de Saúde Financeira Mensal

Crie um módulo `src/services/calculations/health.ts`:

```ts
import { Report } from "../../models/report";

export interface HealthSummary {
  monthlyInflow: number;
  monthlyOutflow: number;
  monthlyLeftover: number;

  percentOutflow: number | null; // ex.: 0.2184
  percentKept: number | null;    // ex.: 0.7816

  monthlyLeftoverWithInvest: number;
  percentOutflowWithInvest: number | null;
  percentKeptWithInvest: number | null;
}

export function calculateHealthSummary(report: Report): HealthSummary {
  const monthlyInflow = report.inflowItems.reduce((sum, item) => sum + item.amount, 0);
  const monthlyOutflow = report.outflowItems.reduce((sum, item) => sum + item.amount, 0);
  const monthlyLeftover = monthlyInflow - monthlyOutflow;

  let percentOutflow: number | null = null;
  let percentKept: number | null = null;

  if (monthlyInflow > 0) {
    percentOutflow = monthlyOutflow / monthlyInflow;
    percentKept = monthlyLeftover / monthlyInflow;
  }

  const monthlyRate = report.annualRate / 12;
  const monthlyYieldEstimate = monthlyLeftover * monthlyRate;
  const monthlyLeftoverWithInvest = monthlyLeftover + monthlyYieldEstimate;

  let percentOutflowWithInvest: number | null = null;
  let percentKeptWithInvest: number | null = null;

  if (monthlyInflow > 0) {
    percentKeptWithInvest = monthlyLeftoverWithInvest / monthlyInflow;
    percentOutflowWithInvest = 1 - percentKeptWithInvest;
  }

  return {
    monthlyInflow,
    monthlyOutflow,
    monthlyLeftover,
    percentOutflow,
    percentKept,
    monthlyLeftoverWithInvest,
    percentOutflowWithInvest,
    percentKeptWithInvest,
  };
}
```

---

## 5. Serviço de Storage Local

Criar uma camada de abstração de storage para facilitar futura migração para Firebase.

Arquivo `src/services/storage/StorageService.ts`:

```ts
import { Report } from "../../models/report";
import { Snapshot } from "../../models/snapshot";

export interface StorageService {
  // Reports
  getReports(): Promise<Report[]>;
  getReportById(id: string): Promise<Report | null>;
  saveReport(report: Report): Promise<void>;
  deleteReport(id: string): Promise<void>;

  // Snapshots
  getSnapshotsByReport(reportId: string): Promise<Snapshot[]>;
  saveSnapshot(snapshot: Snapshot): Promise<void>;
  deleteSnapshot(id: string): Promise<void>;
}
```

Implementação local em `LocalStorageService.ts` usando AsyncStorage, MMKV ou SQLite.

---

## 6. Telas e Componentes – Descrição Detalhada

### 6.1. Tela: `ReportsListScreen` – Meus Relatórios

**Objetivo:** listar todos os Relatórios e permitir criar/editar/excluir.

**Layout sugerido:**

- `SafeAreaView`
- `View` com:
  - Título (Text): “Meus Relatórios”
- `FlatList` de `ReportCard`

**`ReportCard` (componente):**

- Container (`Pressable` ou `TouchableOpacity`)
- Conteúdo:
  - Nome do relatório (Text)
  - Linha pequena com:
    - Meta (se houver): “Meta: R$ 1.000.000”
    - Situação: “Atinge em 09/2037” ou “Meta não atingida”
  - Linha com:
    - Valor inicial atual: “Valor inicial atual: R$ XX.XXX”
- Ações no card:
  - Ao tocar no card → navegar para `ReportDetailScreen`
  - Ícone de editar (no canto) → `ReportFormScreen` em modo edição
  - Ícone de menu (três pontinhos) → menu com “Duplicar”, “Excluir”

**Botão flutuante (Floating Action Button):**

- Componente `PrimaryButton` ou FAB (círculo com ícone “+”)
- Ação: criar novo Relatório → `ReportFormScreen` (modo criação)

---

### 6.2. Tela: `ReportFormScreen` – Criar/Editar Relatório

**Objetivo:** criar ou editar um Relatório.

**Layout sugerido:**

- `SafeAreaView`
- `ScrollView`
- Seções com `SectionHeader`:

1. **Informações básicas**
   - `TextField` para nome
   - `TextField` para descrição
   - Date picker para `startDate`
   - `NumberField` para `initialAmount`

2. **Entradas mensais (inflows)**
   - `SectionHeader` “Entradas mensais”
   - Lista de itens:
     - Para cada `InflowItem`:
       - `TextField` nome
       - `NumberField` valor
       - Ícone de excluir
   - Botão “+ Adicionar entrada”

3. **Saídas mensais (outflows)**
   - Mesma lógica de entradas, mas com `OutflowItem`

4. **Investimento e meta**
   - `NumberField` para `% investimento anual` (ex.: 8.5 → converter para 0.085)
   - `NumberField` para `goalAmount` (opcional)
   - `NumberField` ou `Picker` para `simulationYears`

5. **Meses destacados**
   - Lista de `HighlightMonth`:
     - `TextField` label (ex.: “Setembro (mês 9)”)
     - `NumberField` monthIndex (inteiro)
   - Botão “+ Adicionar mês destacado”

**Botões no rodapé:**

- “Cancelar” – volta sem salvar
- “Salvar” – valida dados, cria/atualiza Report e persiste via StorageService

---

### 6.3. Tela: `ReportDetailScreen` – Detalhe do Relatório

**Objetivo:** mostrar projeção, saúde financeira e snapshots.

**Layout sugerido:**

- `SafeAreaView`
- `ScrollView` ou `SectionList`

Seções:

1. **Header**
   - Título com nome do Relatório
   - Ícone de editar → `ReportFormScreen`
   - Menu com opções: Duplicar, Excluir, Configurações específicas (se houver)

2. **Seção: Valor atual e recalcular**
   - `NumberField` “Quanto eu tenho hoje?”
     - Preenchido com `report.initialAmount`
   - `PrimaryButton` “Atualizar projeção”
     - Atualiza `initialAmount` do Report
     - Recalcula projeções em memória (chama `generateProjections`)

3. **Seção: Saúde Financeira Mensal**
   - Usar `calculateHealthSummary(report)`
   - Exibir em `StatCard` ou conjunto de cards:

   Card 1 – Situação sem investimento:
   - “Entradas mensais: R$ X”
   - “Saídas mensais: R$ Y”
   - “Sobrou: R$ Z”
   - “% Saída: 21,84%”
   - “% Mantido: 78,16%”

   Card 2 – Considerando investimento:
   - “Sobrou + invest: R$ 19.913,47”
   - “% Saída + invest: 8,23%”
   - “% Mantido + invest: 91,77%”

4. **Seção: Meta**
   - Mostrar meta configurada (se houver)
   - Mostrar:
     - “Meta atingida em: Mês/Ano (ex.: 09/2037)”  
       ou  
     - “Meta não atingida em N anos de simulação”

5. **Seção: Gráfico de projeção**
   - Componente `ProjectionChart`, recebendo `projections`
   - Plotar `finalAmount` ao longo do tempo
   - Destacar:
     - ponto da meta (se for atingida)
     - meses em `highlightMonths`

6. **Seção: Tabela mês a mês**
   - `FlatList` ou `VirtualizedList` com linhas:
     - Mês/ano formatado
     - Entradas
     - Saídas
     - Lucro invest.
     - Resultado final
   - Ao tocar numa linha:
     - Mostrar detalhes em modal ou bottom sheet
     - Ação “Marcar esse mês” para adicionar a `highlightMonths` (opcional)

7. **Seção: Snapshots (Visões)**
   - Mostrar breve resumo:
     - Quantidade de visões salvas para esse relatório
     - Última visão: data, meta prevista, patrimônio final
   - Botões:
     - “Salvar visão de hoje”
       - Gera snapshot com:
         - parâmetros atuais (`initialAmount`, `annualRate`, etc.)
         - projeções, `goalHitDate`, `finalAmountAtEnd`, etc.
         - valores dos meses destacados
       - Salva via StorageService
     - “Ver histórico de visões” → `ReportSnapshotsListScreen`

---

### 6.4. Tela: `ReportSnapshotsListScreen` – Histórico de Visões

**Objetivo:** listar todas as visões (snapshots) de um Relatório.

**Layout sugerido:**

- `SafeAreaView`
- Header com:
  - Título: “Histórico de visões”
  - Subtítulo: nome do Relatório

- `FlatList` de `SnapshotCard`:

`SnapshotCard`:

- Data da visão: “Visão de 11/12/2025”
- Saldo inicial na época
- Meta prevista (se houve):
  - “Meta 1M em 09/2037”
  - ou “Meta não atingida”
- Patrimônio ao fim da simulação

Ações:

- Tap: abre `SnapshotDetailScreen`
- Ícone de lixeira: excluir snapshot (confirmação)

Botão na parte inferior ou header:

- “Comparar visões” → `SnapshotsCompareScreen`
  - Antes de navegar, pode abrir seletor para escolher duas visões A e B.

---

### 6.5. Tela: `SnapshotDetailScreen` – Detalhe da Visão

**Objetivo:** mostrar a “foto” da projeção de um snapshot.

**Layout sugerido:**

- Header:
  - Título: “Visão de [data]”
  - Subtítulo: nome do Relatório

- Seções:

1. Resumo:
   - “Saldo inicial na época: R$ X”
   - “Taxa anual: 8,5%”
   - “Meta: R$ 1.000.000 (se existir)”
   - “Meta atingida em: 09/2037” ou “Meta não atingida”

2. Seção: Destaques
   - “Patrimônio ao fim da simulação: R$ Y”
   - Lista de valores nos meses destacados:
     - label / data / valor

3. Seção: Gráfico da visão
   - Se `projections` estiverem salvas, usar `ProjectionChart` com dados desse snapshot.

4. Botão:
   - “Comparar com visão atual”
     - Ação: abre `SnapshotsCompareScreen` com:
       - A = snapshot atual
       - B = projeção atual do Relatório (recalculada)

---

### 6.6. Tela: `SnapshotsCompareScreen` – Comparar Visões

**Objetivo:** comparar duas visões (A e B) ou uma visão com a projeção atual.

**Layout sugerido:**

- Header:
  - “Comparar visões”
  - Mostrar datas: “Visão A: [data] x Visão B: [data ou Atual]”

- Seções:

1. Resumo comparativo:
   - Valor inicial A vs B
   - Meta prevista A vs B (data ou “não atinge”)
   - Patrimônio final A vs B

2. Gráfico comparativo:
   - Componente `ProjectionCompareChart`
   - Duas linhas:
     - Linha A
     - Linha B

3. Tabela simplificada:
   - Para cada mês destacado ou marcos fixos:
     - Data / label
     - Valor A
     - Valor B

4. Botão:
   - “Inverter A e B” (opcional, dependendo da UX)

---

### 6.7. Tela: `SettingsScreen` – Configurações (Opcional)

**Objetivo:** ajustes gerais do app.

Itens sugeridos:

- Moeda padrão (símbolo)
- Formato numérico (separador de milhar, decimal)
- Tema (claro/escuro)
- Exportar backup (exportar JSON com reports + snapshots)
- Importar backup (ler JSON e salvar)
- Sobre: versão do app, autor, etc.

---

## 7. Estilo Visual (Guia)

- Visual minimalista, estilo **dashboard financeiro**.
- Preferência por **tema escuro**:
  - Fundo cinza escuro ou quase preto.
  - Cards em cinza mais claro.
- Cores:
  - Verde para valores positivos, patrimônio e metas atingidas.
  - Vermelho apenas para alertas/saídas, se quiser.
  - Azul ou ciano para linhas de gráfico neutras.
- Tipografia:
  - Fonte sem serifa.
  - Títulos com peso mais forte.
  - Números sempre bem legíveis, com espaçamento adequado.

---

## 8. Comportamento Geral

- Todos os dados devem ser carregados do storage local na inicialização.
- Qualquer modificação em um Relatório deve atualizar o `updatedAt`.
- Atualizar o `initialAmount` deve recalcular projeções apenas em memória (salvar novo initialAmount no storage).
- Salvar uma visão cria um `Snapshot` relacionado a um `Report`.
- Nenhum dado deve depender de backend ou login; todo o app é offline.

---

## 9. Uso como Prompt

Use esta especificação para:

- Gerar o projeto React Native + TypeScript com a estrutura de pastas sugerida.
- Criar os modelos, serviços de cálculo e storage.
- Desenvolver as telas descritas, com componentes e navegação.
- Ajustar a UI seguindo o guia visual de dashboard financeiro.

O objetivo da IA é gerar um **esqueleto funcional completo** do app, que possa ser evoluído manualmente depois.
