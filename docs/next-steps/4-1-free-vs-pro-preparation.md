# Fase 4-1 — Preparação Free vs Pro (Monetização sem Cobrança)

Esta fase introduz o **conceito de planos Free e Pro** no Clarus,
sem ativar cobrança ou pagamentos reais.

O foco é **arquitetura, UX e clareza de valor**, não monetização efetiva.

---

## 🎯 Objetivo

- Introduzir diferenciação Free vs Pro
- Preparar o app para monetização futura
- Definir limites claros do plano Free
- Criar UX de upgrade sem cobrança ativa

---

## 🧠 Contexto

Até esta fase:
- App é totalmente gratuito
- Não existe distinção de usuários
- Não há base técnica para planos

A partir daqui:
- Usuários passam a ter **entitlements**
- Pro vira um conceito real no app
- Cobrança ainda NÃO acontece

---

## 🧩 Problemas que esta fase resolve

- Dificuldade futura de adicionar monetização
- Falta de clareza de valor do plano Pro
- Necessidade de refatoração grande ao cobrar
- UX inexistente para upgrade

---

## 📦 Escopo (O que entra)

- Conceito de plano Free / Pro
- Feature flags baseadas em plano
- Limites do plano Free
- Tela de upgrade (informativa)
- Persistência local do plano

---

## 🚫 Fora de Escopo (O que NÃO entra)

- Pagamentos
- IAP
- Ads
- Preços reais
- Bloqueios agressivos de uso

---

## 🏗️ Decisões Técnicas

### Modelo de Plano

```ts
type UserPlan = 'FREE' | 'PRO'
```

Estado inicial:
```ts
userPlan = 'FREE'
```

---

## 🎛️ Feature Flags

Exemplos de controle:

```ts
canCreateMultipleReports
canSaveUnlimitedSnapshots
canUseCloudSync
canExportData
adsEnabled
```

Essas flags devem:
- ser centralizadas
- não depender de UI diretamente

---

## 📊 Limites Sugeridos (Inicial)

Plano Free:
- 1 relatório
- Snapshots limitados
- Cloud sync desativado
- Ads habilitados (futuro)

Plano Pro:
- Relatórios ilimitados
- Snapshots ilimitados
- Cloud sync
- Sem ads
- Exportação

---

## 🖥️ UX — Tela de Upgrade

Características:
- Informativa
- Clara
- Sem pressão
- Sem botão de pagamento

Conteúdo:
- Benefícios do Pro
- Comparativo Free vs Pro
- CTA genérico: “Em breve”

---

## 📁 Estrutura de Pastas Impactada

```
contexts/
├── EntitlementsContext.tsx
└── index.ts

services/
├── entitlements/
│   ├── EntitlementsService.ts
│   └── index.ts
```

---

## 🧠 Prompt Técnico Detalhado (para IA / Cursor)

> Introduzir o conceito de planos Free e Pro no projeto Clarus sem ativar cobrança. Criar tipagem `UserPlan` e camada centralizada de entitlements/feature flags. Implementar limites suaves no plano Free, exibindo UX de upgrade quando necessário, sem bloquear agressivamente o uso. Criar tela informativa de upgrade apresentando benefícios do Pro, sem botões de pagamento. Persistir o plano localmente. Garantir que nenhuma integração de pagamento ou ads seja adicionada nesta fase.

---

## ✅ Checklist de Conclusão

- [ ] Conceito Free / Pro implementado
- [ ] Feature flags funcionando
- [ ] Limites Free aplicados corretamente
- [ ] Tela de upgrade informativa
- [ ] Nenhuma cobrança ativa
- [ ] App funcionando normalmente

---

## 📌 Critério de Sucesso

> O app deixa claro o valor do plano Pro sem pressionar o usuário ou cobrar.

Se houver qualquer cobrança, bloqueio agressivo ou dependência de pagamento, esta fase falhou.
