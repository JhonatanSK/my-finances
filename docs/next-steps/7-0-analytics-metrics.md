# Fase 7-0 — Analytics & Métricas (Privacidade em Primeiro Lugar)

Esta fase adiciona **analytics essenciais** ao Clarus para entender uso real,
retenção e conversão, **sem comprometer privacidade** e mantendo compliance
com Play Store, App Store e LGPD/GDPR.

O foco é **produto e decisão**, não rastreamento agressivo.

---

## 🎯 Objetivo

- Medir uso real do app
- Entender retenção e engajamento
- Avaliar conversão Free → Pro
- Apoiar decisões de roadmap com dados

---

## 🧠 Princípios de Privacidade

- Coleta mínima necessária
- Nenhum dado sensível
- Nenhum dado financeiro
- Nenhum conteúdo de relatórios
- Transparência total ao usuário

---

## 🧩 Problemas que esta fase resolve

- Decisões baseadas em “achismo”
- Falta de visibilidade de funil
- Dificuldade de priorizar features
- Incerteza sobre valor do Pro

---

## 📦 Escopo (O que entra)

- Analytics básico de eventos
- Métricas de retenção
- Funil Free → Pro
- Opt-out de analytics
- Integração com Ads/IAP (nível alto)

---

## 🚫 Fora de Escopo (O que NÃO entra)

- Tracking cross-app
- Perfil de usuário
- Dados financeiros
- Session replay
- Heatmaps
- A/B testing

---

## 🏗️ Stack Recomendada

Opção principal:
- Firebase Analytics (GA4)

Alternativa:
- PostHog (self-hosted, opcional)

Recomendação:
- **Firebase Analytics** pela integração nativa com AdMob e IAP

---

## 📊 Eventos Essenciais

### Eventos de Uso
- `app_open`
- `report_created`
- `snapshot_created`
- `projection_viewed`
- `language_changed`

### Eventos de Monetização
- `upgrade_view_opened`
- `purchase_started`
- `purchase_success`
- `purchase_restore`
- `ads_impression` (agregado)

---

## 🔐 Controle por Plano

- Eventos coletados igual para Free e Pro
- Ads só geram eventos no Free
- Nenhum evento adicional no Pro

---

## ⚙️ Opt-out de Analytics

Adicionar em Settings:
- Toggle: “Compartilhar dados de uso anônimos”

Regras:
- Default: ativado
- Persistência local
- Respeitar imediatamente

---

## 📁 Estrutura de Pastas Impactada

```
services/
├── analytics/
│   ├── AnalyticsService.ts
│   ├── FirebaseAnalyticsService.ts
│   └── index.ts
```

---

## 🧠 Prompt Técnico Detalhado (para IA / Cursor)

> Implementar analytics básico no projeto Clarus utilizando Firebase Analytics com foco em privacidade. Registrar apenas eventos essenciais de uso e monetização, sem coletar dados pessoais ou financeiros. Criar camada de serviço abstrata para analytics. Implementar opção de opt-out em Settings, persistida localmente e respeitada imediatamente. Integrar eventos de Ads e IAP apenas em nível agregado. Garantir conformidade com LGPD/GDPR e políticas das lojas.

---

## ✅ Checklist de Conclusão

- [ ] Analytics integrado corretamente
- [ ] Eventos essenciais registrados
- [ ] Opt-out funcional
- [ ] Nenhum dado sensível coletado
- [ ] Política de privacidade atualizada

---

## 📌 Critério de Sucesso

> O time consegue responder perguntas básicas de produto sem violar privacidade.

Se analytics coletar dados sensíveis ou não respeitar opt-out, esta fase falhou.
