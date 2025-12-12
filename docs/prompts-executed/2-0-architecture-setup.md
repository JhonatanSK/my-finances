# Fase 2-0 — Arquitetura e Organização Interna

Esta fase estabelece a **base estrutural definitiva** do projeto Clarus.
Ela NÃO adiciona novas funcionalidades visíveis ao usuário.
O objetivo é garantir **escalabilidade, clareza e previsibilidade** para as próximas versões.

---

## 🎯 Objetivo

- Consolidar a arquitetura atual
- Tornar explícitas as responsabilidades de cada camada
- Preparar o projeto para:
  - persistência avançada
  - internacionalização
  - cloud sync
  - monetização
- Evitar refatorações grandes no futuro

---

## 🧠 Contexto Atual

O projeto já possui uma estrutura sólida:

- Expo Router bem organizado
- Componentes separados por domínio
- Serviços de cálculo isolados
- Persistência abstraída
- Tipagens bem definidas

Esta fase **não muda radicalmente** a estrutura, apenas:
- ajusta convenções
- explicita responsabilidades
- prepara extensões futuras

---

## 🧩 Problemas que esta fase resolve

- Crescimento desorganizado de services
- Mistura de lógica de negócio com UI
- Dificuldade futura de adicionar cloud/IAP/ads
- Falta de guideline arquitetural explícito

---

## 📦 Escopo (O que entra)

- Revisão da estrutura de pastas
- Definição clara de camadas
- Padronização de services
- Introdução de conceitos de feature flags
- Ajustes leves em contexts e hooks

---

## 🚫 Fora de Escopo (O que NÃO entra)

- Novas features de usuário
- Cloud / Firebase
- Monetização
- Ads
- Internacionalização

---

## 🏗️ Decisões Arquiteturais

### Princípios
- Offline-first
- Domínio isolado de UI
- Services puros sempre que possível
- Dependências fluindo de fora → dentro

### Camadas Definidas

```
UI (app/, components/)
↓
Hooks / Contexts
↓
Services (business logic)
↓
Storage (infra)
```

---

## 📁 Estrutura de Pastas Alvo

A estrutura atual é mantida, com pequenas extensões previstas:

```
services/
├── calculations/
├── storage/
├── cloud/        # (futuro)
├── iap/          # (futuro)
├── ads/          # (futuro)
└── index.ts
```

Nenhuma pasta futura deve acessar UI diretamente.

---

## 🧠 Feature Flags (Conceito)

Introduzir desde já os conceitos:

```ts
type UserEntitlements = {
  isPro: boolean
  adsEnabled: boolean
  cloudSyncEnabled: boolean
}
```

Mesmo que inicialmente tudo seja `false`.

---

## 🔌 Contexts Impactados

### ReportsContext
- Continua responsável apenas por:
  - CRUD de relatórios
  - snapshots
- NÃO deve conter lógica de cálculo

### SettingsContext
- Centralizar:
  - tema
  - idioma (futuro)
  - flags de comportamento

Sugestão futura:
- AuthContext
- EntitlementsContext

(NÃO implementar agora)

---

## 🧠 Prompt Técnico Detalhado (para IA / Cursor)

> Revisar a arquitetura atual do projeto Clarus garantindo separação clara entre UI, hooks, contexts e services. Validar que toda lógica de negócio (cálculos financeiros, projeções, saúde financeira) esteja isolada em `services/calculations`. Garantir que contexts não contenham regras de negócio, apenas orquestração de estado. Preparar a estrutura de `services/` para futuras extensões como cloud, IAP e ads, sem implementá-las agora. Introduzir conceitos de feature flags (`isPro`, `adsEnabled`, `cloudSyncEnabled`) apenas como tipagens e estado inicial. Nenhuma funcionalidade visível ao usuário deve ser alterada.

---

## ✅ Checklist de Conclusão

- [ ] Estrutura de pastas validada
- [ ] Nenhuma lógica de cálculo em UI ou Context
- [ ] Services bem definidos e reutilizáveis
- [ ] Feature flags definidas (mesmo que inativas)
- [ ] App funcionando exatamente como antes

---

## 📌 Critério de Sucesso

> Após esta fase, qualquer nova feature futura poderá ser adicionada sem refatoração estrutural.

Se o comportamento do app mudou para o usuário final, esta fase foi executada incorretamente.
