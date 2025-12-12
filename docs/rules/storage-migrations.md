# Sistema de Migrações de Storage

Este documento descreve o sistema de migrações para evolução do schema de dados persistidos.

## Como Funciona

### Versionamento

O estado persistido inclui um campo `schemaVersion` que indica a versão do schema:

```typescript
interface PersistedState {
  schemaVersion: number;
  reports: Report[];
  snapshots: Snapshot[];
}
```

### Migrações

Cada migração é uma função que transforma dados de uma versão anterior para a versão seguinte:

```typescript
type MigrationFunction = (state: any) => PersistedState;
```

### Fluxo de Migração

1. App carrega dados do storage
2. Detecta a versão atual (`schemaVersion`)
3. Aplica migrações sequencialmente até a versão atual
4. Valida o estado final
5. Persiste o estado migrado

## Adicionando uma Nova Migração

### 1. Criar arquivo de migração

Crie `v2.ts` (ou a versão correspondente):

```typescript
import { PersistedState } from '../types';

export function migrateToV2(state: PersistedState): PersistedState {
  return {
    ...state,
    schemaVersion: 2,
    reports: state.reports.map(report => ({
      ...report,
      // Adicionar novos campos ou transformar dados
      newField: report.oldField ? transform(report.oldField) : defaultValue,
    })),
    snapshots: state.snapshots, // ou transformar se necessário
  };
}

export function validateV2(state: PersistedState): boolean {
  // Validações específicas da versão 2
  return state.schemaVersion === 2 && /* outras validações */;
}
```

### 2. Registrar a migração

Em `migrations/index.ts`:

```typescript
import { migrateToV2 } from './v2';

const migrations: Record<number, MigrationFunction> = {
  1: migrateToV1,
  2: migrateToV2, // Adicionar aqui
};
```

### 3. Atualizar versão atual

Em `types.ts`:

```typescript
export const CURRENT_SCHEMA_VERSION = 2; // Atualizar
```

### 4. Atualizar validação

Em `migrations/index.ts`, atualizar a função `validateState` para incluir validação da nova versão.

## Princípios

1. **Nunca perder dados**: Migrações devem preservar todos os dados possíveis
2. **Idempotência**: Aplicar a mesma migração múltiplas vezes deve ser seguro
3. **Validação**: Sempre validar o estado após migração
4. **Backward compatibility**: Dados antigos devem ser migráveis automaticamente

## Testando Migrações

Para testar uma migração:

1. Criar dados no formato antigo
2. Aplicar a migração
3. Verificar que os dados foram transformados corretamente
4. Verificar que nenhum dado foi perdido

## Exemplo de Migração

```typescript
// v2.ts - Adicionar campo createdAt aos reports que não têm
export function migrateToV2(state: PersistedState): PersistedState {
  const now = new Date().toISOString();
  
  return {
    ...state,
    schemaVersion: 2,
    reports: state.reports.map(report => ({
      ...report,
      createdAt: report.createdAt || now,
      updatedAt: report.updatedAt || now,
    })),
    snapshots: state.snapshots,
  };
}
```

