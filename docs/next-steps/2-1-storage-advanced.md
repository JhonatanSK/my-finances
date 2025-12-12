# Fase 2-1 — Persistência Local Avançada (Storage Versionado)

Esta fase evolui a persistência local do Clarus para um nível **robusto, previsível e migrável**.
Ela prepara o app para futuras integrações (cloud sync, Pro, múltiplos dispositivos) **sem perder dados**.

Nenhuma funcionalidade visível nova é adicionada ao usuário final.

---

## 🎯 Objetivo

- Tornar a persistência local resiliente
- Permitir evolução de schema sem quebrar dados antigos
- Criar base sólida para:
  - backup
  - restore
  - sync futuro com cloud
- Evitar “lock-in” de implementação (AsyncStorage puro)

---

## 🧠 Contexto Atual

Atualmente o projeto possui:

- `StorageService` como interface abstrata
- `LocalStorageService` usando AsyncStorage
- Dados persistidos sem versionamento explícito
- Nenhum mecanismo de migração

Isso é aceitável para MVP, mas **não escala bem**.

---

## 🧩 Problemas que esta fase resolve

- Quebra de dados ao mudar modelos (`Report`, `Snapshot`, etc.)
- Dificuldade de adicionar novos campos no futuro
- Impossibilidade de migrar dados automaticamente
- Falta de backup/export para o usuário

---

## 📦 Escopo (O que entra)

- Versionamento explícito do storage
- Camada de migração
- Exportação de dados (JSON)
- Importação com validação
- Normalização mínima de dados

---

## 🚫 Fora de Escopo (O que NÃO entra)

- Cloud sync
- Login
- Firebase
- Criptografia avançada
- UI complexa de backup (somente funcional)

---

## 🏗️ Decisões Técnicas

### Estratégia de Versionamento

Introduzir um `schemaVersion` global:

```ts
type PersistedState = {
  schemaVersion: number
  reports: Report[]
  snapshots: Snapshot[]
}
```

Versão inicial:
```ts
schemaVersion = 1
```

---

## 🔁 Estratégia de Migração

Criar uma camada dedicada:

```
services/storage/migrations/
├── v1.ts
├── v2.ts
└── index.ts
```

Cada migration:
- recebe o estado anterior
- retorna o estado atualizado
- nunca perde dados

Exemplo conceitual:

```ts
export function migrateV1ToV2(state: any): PersistedState {
  return {
    ...state,
    schemaVersion: 2,
    reports: state.reports.map(r => ({
      ...r,
      createdAt: r.createdAt ?? new Date().toISOString()
    }))
  }
}
```

---

## 💾 Storage Flow Esperado

1. App inicia
2. Storage carrega estado bruto
3. Verifica `schemaVersion`
4. Executa migrations necessárias
5. Retorna estado final normalizado

---

## 📤 Exportação de Dados

Criar função:

```ts
export function exportData(): string
```

- Retorna JSON serializado
- Inclui:
  - schemaVersion
  - reports
  - snapshots
- Usado para:
  - backup manual
  - debug
  - futuro restore cloud

---

## 📥 Importação de Dados

Criar função:

```ts
export function importData(json: string): ImportResult
```

Validações mínimas:
- JSON válido
- schemaVersion suportado
- Estrutura compatível

Nunca sobrescrever dados automaticamente sem confirmação (UI futura).

---

## 📁 Estrutura de Pastas Impactada

```
services/
└── storage/
    ├── StorageService.ts
    ├── LocalStorageService.ts
    ├── migrations/
    │   ├── v1.ts
    │   └── index.ts
    ├── backup.ts
    └── index.ts
```

---

## 🧠 Prompt Técnico Detalhado (para IA / Cursor)

> Evoluir a persistência local do projeto Clarus implementando storage versionado com `schemaVersion`. Criar uma camada de migrações capaz de transformar dados antigos em novos formatos sem perda de informação. Implementar fluxo de inicialização que detecta a versão persistida, aplica migrations necessárias e retorna o estado final normalizado. Criar funções utilitárias para exportação (backup) e importação (restore) de dados em JSON, com validações básicas. Manter AsyncStorage como implementação inicial, respeitando a abstração via `StorageService`. Nenhuma funcionalidade visível ao usuário deve ser alterada nesta fase.

---

## ✅ Checklist de Conclusão

- [ ] `schemaVersion` persistido
- [ ] Migração automática funcionando
- [ ] Nenhuma perda de dados em mudanças de modelo
- [ ] Export JSON funcional
- [ ] Import JSON validado
- [ ] App funcionando exatamente como antes

---

## 📌 Critério de Sucesso

> Após esta fase, mudanças nos modelos de dados não quebram usuários existentes.

Se qualquer usuário perder dados após uma atualização, esta fase foi executada incorretamente.
