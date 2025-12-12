# App de Relatórios Financeiros - Plano de Implementação
## Contexto
O projeto é um boilerplate Expo criado com `create-expo-app` usando expo-router para navegação. O objetivo é transformá-lo em um app de finanças pessoais 100% offline para projeção de metas financeiras.
**Stack atual:**
* React Native + Expo (v54)
* TypeScript
* expo-router (file-based routing)
* React Navigation (já configurado)
**O que precisa ser adicionado:**
* Persistência local (AsyncStorage ou MMKV)
* Biblioteca de gráficos (victory-native)
* UUID para IDs únicos
* DateTimePicker para seleção de datas
## Estrutura de Pastas Proposta
Adaptando a estrutura sugerida para o padrão expo-router:
```warp-runnable-command
app/
  (tabs)/
    index.tsx          → ReportsListScreen
    settings.tsx       → SettingsScreen
    _layout.tsx
  report/
    [id].tsx           → ReportDetailScreen
    form.tsx           → ReportFormScreen (create)
    [id]/
      edit.tsx         → ReportFormScreen (edit)
      snapshots/
        index.tsx      → ReportSnapshotsListScreen
        [snapshotId].tsx → SnapshotDetailScreen
        compare.tsx    → SnapshotsCompareScreen
  _layout.tsx
models/
  report.ts
  snapshot.ts
  projections.ts
services/
  storage/
    StorageService.ts
    LocalStorageService.ts
  calculations/
    projections.ts
    health.ts
components/
  reports/
    ReportCard.tsx
    HealthSummaryCard.tsx
    ProjectionChart.tsx
    ProjectionTable.tsx
  snapshots/
    SnapshotCard.tsx
    ProjectionCompareChart.tsx
  ui/
    StatCard.tsx
    PrimaryButton.tsx
    TextField.tsx
    NumberField.tsx
    SectionHeader.tsx
    FAB.tsx
hooks/
  useReports.ts
  useSnapshots.ts
constants/
  theme.ts (já existe, expandir)
  spacing.ts
  typography.ts
utils/
  date.ts
  format.ts
  uuid.ts
```
## Fases de Implementação
### Fase 1: Fundação (Modelos e Serviços)
**1.1 Instalar dependências**
* @react-native-async-storage/async-storage
* uuid
* @react-native-community/datetimepicker
* victory-native (para gráficos)
* react-native-svg (dependência do victory)
**1.2 Criar modelos TypeScript**
* models/report.ts - Interface Report, InflowItem, OutflowItem, HighlightMonth
* models/snapshot.ts - Interface Snapshot, HighlightedMonthValue
* models/projections.ts - Interface MonthlyProjection
**1.3 Criar serviços de cálculo**
* services/calculations/projections.ts - generateProjections(), findGoalHit()
* services/calculations/health.ts - calculateHealthSummary()
**1.4 Criar serviço de storage**
* services/storage/StorageService.ts - Interface abstrata
* services/storage/LocalStorageService.ts - Implementação com AsyncStorage
**1.5 Criar utilitários**
* utils/date.ts - formatDate(), addMonths(), parseDate()
* utils/format.ts - formatCurrency(), formatPercent()
* utils/uuid.ts - generateId()
### Fase 2: Theme e Componentes UI Base
**2.1 Expandir tema para dashboard financeiro**
* constants/theme.ts - Adicionar cores para dark theme (verde para positivo, vermelho para negativo, cinza escuro para fundo)
* constants/spacing.ts - Espaçamentos padronizados
* constants/typography.ts - Tipografia para números e títulos
**2.2 Componentes UI básicos**
* components/ui/TextField.tsx
* components/ui/NumberField.tsx
* components/ui/PrimaryButton.tsx
* components/ui/SectionHeader.tsx
* components/ui/StatCard.tsx
* components/ui/FAB.tsx (Floating Action Button)
### Fase 3: Hooks de Estado
**3.1 Criar hooks com Context API**
* hooks/useReports.ts - CRUD de relatórios, estado global
* hooks/useSnapshots.ts - CRUD de snapshots por relatório
* Criar ReportsProvider no _layout.tsx raiz
### Fase 4: Telas de Relatórios
**4.1 ReportsListScreen** (app/(tabs)/index.tsx)
* Lista de relatórios com FlatList
* ReportCard mostrando nome, meta, situação
* FAB para criar novo relatório
* Navegação para detalhes/edição
**4.2 ReportFormScreen** (app/report/form.tsx e app/report/[id]/edit.tsx)
* Formulário completo com todas as seções
* Entradas/Saídas dinâmicas (adicionar/remover itens)
* Meses destacados
* Validação e salvamento
**4.3 ReportDetailScreen** (app/report/[id].tsx)
* Campo para atualizar valor inicial
* Seção de saúde financeira (HealthSummaryCard)
* Seção de meta (quando atinge)
* Gráfico de projeção (ProjectionChart)
* Tabela mês a mês (ProjectionTable)
* Seção de snapshots com resumo
### Fase 5: Telas de Snapshots
**5.1 ReportSnapshotsListScreen** (app/report/[id]/snapshots/index.tsx)
* Lista de snapshots do relatório
* SnapshotCard com data, saldo, meta prevista
* Botão para comparar visões
**5.2 SnapshotDetailScreen** (app/report/[id]/snapshots/[snapshotId].tsx)
* Resumo da visão
* Valores nos meses destacados
* Gráfico da visão
* Botão "Comparar com atual"
**5.3 SnapshotsCompareScreen** (app/report/[id]/snapshots/compare.tsx)
* Comparação lado a lado
* Gráfico comparativo (ProjectionCompareChart)
* Tabela de marcos comparados
### Fase 6: Configurações
**6.1 SettingsScreen** (app/(tabs)/settings.tsx)
* Moeda padrão
* Formato numérico
* Tema (claro/escuro)
* Exportar/Importar backup (JSON)
* Sobre
### Fase 7: Gráficos e Visualizações
**7.1 Componentes de gráfico**
* components/reports/ProjectionChart.tsx - Linha de patrimônio com markers
* components/snapshots/ProjectionCompareChart.tsx - Duas linhas comparativas
### Fase 8: Polimento
* Tema escuro como padrão
* Animações e transições
* Empty states
* Loading states
* Tratamento de erros
* Confirmação de exclusão
## Ordem de Execução Recomendada
1. Fase 1.1 - Instalar dependências
2. Fase 1.2, 1.5 - Modelos e utils
3. Fase 1.3, 1.4 - Serviços
4. Fase 2 - Theme e componentes UI
5. Fase 3 - Hooks de estado
6. Fase 4.1 - Lista de relatórios
7. Fase 4.2 - Formulário de relatório
8. Fase 4.3 - Detalhes do relatório (sem gráfico)
9. Fase 5 - Snapshots
10. Fase 7 - Gráficos
11. Fase 6 - Configurações
12. Fase 8 - Polimento
