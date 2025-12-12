# Clarus — Roadmap Geral & Organização de Prompts

Este documento serve como **guia mestre** do projeto Clarus.
Ele descreve:
- As **fases de evolução do app**
- O **objetivo de cada fase**
- O que deve virar **prompt técnico**
- O que deve ficar como **descrição conceitual**
- Como organizar tudo dentro da pasta `docs/`

---

## 📁 Organização de Documentação

Dentro do projeto:

```
docs/
├── README-ROADMAP-GERAL.md        # (este arquivo)
├── next-steps/                   # Prompts e descrições das próximas fases
│   ├── FASE-1-ARQUITETURA.md
│   ├── FASE-2-STORAGE.md
│   ├── FASE-3-I18N.md
│   ├── FASE-4-PUBLICACAO.md
│   ├── FASE-5-CLOUD.md
│   ├── FASE-6-PRO.md
│   ├── FASE-7-PAGAMENTOS.md
│   └── FASE-8-ADS.md
└── prompts-executed/             # Histórico de prompts já utilizados
    ├── 2025-12-ui-refactor.md
    ├── 2025-12-logo-design.md
    └── ...
```

---

## 🟢 FASE 0 — Base Consolidada (Estado Atual)

### Objetivo
Garantir que o core do app esteja estável, offline-first e correto.

### Status
✅ Concluída

### Escopo
- Relatórios financeiros
- Projeções mês a mês
- Snapshots e comparações
- UI refinada
- Persistência local simples

📌 Nenhum prompt necessário — ponto de partida oficial.

---

## 🟢 FASE 1 — Arquitetura e Organização Interna

### Objetivo
Preparar o projeto para crescer sem refatorações estruturais futuras.

### Escopo
- Organização por domínio
- Separação clara entre UI, lógica e serviços
- Padronização de contexts, hooks e services

### Prompt técnico
- Validar estrutura atual
- Ajustar onde necessário
- Criar guidelines de pastas

### Fora de código
- Justificativa de offline-first
- Decisões arquiteturais

---

## 🟢 FASE 2 — Persistência Local Avançada

### Objetivo
Garantir confiabilidade de dados e base para sync futuro.

### Escopo
- Storage versionado
- Exportação e importação JSON
- Migração automática de schema

### Prompt técnico
- Criar schemaVersion
- Implementar funções de backup
- Garantir backward compatibility

### Fora de código
- Política de backup
- UX de recuperação de dados

---

## 🟢 FASE 3 — Internacionalização (PT / EN)

### Objetivo
Permitir uso do app em múltiplos idiomas.

### Escopo
- Idiomas: PT-BR (default) e EN
- Botão de troca de idioma em Settings
- Persistência da escolha

### Prompt técnico
- Implementar i18n
- Estrutura de arquivos de tradução
- Hook useTranslation

### Fora de código
- Estratégia de tradução
- Decisão de idiomas iniciais

---

## 🟢 FASE 4 — Preparação para Publicação (Stores)

### Objetivo
Publicar o app nas lojas sem monetização.

### Escopo
- Ícone e splash final
- Política de privacidade
- Metadados da Play Store / App Store

### Prompt técnico
- Ajustes Expo config
- Build Android e iOS

### Fora de código
- Textos da loja
- Screenshots

---

## 🟢 FASE 5 — Cloud Sync & Login (Opcional)

### Objetivo
Adicionar sincronização opcional sem quebrar o offline.

### Escopo
- Login opcional
- Sync manual ou automático
- Merge local/cloud

### Prompt técnico
- Firebase Auth
- Firestore schema
- Conflict resolution

### Fora de código
- UX do login
- Política de privacidade atualizada

---

## 🟢 FASE 6 — Free vs Pro (Preparação)

### Objetivo
Preparar monetização sem ativar cobrança.

### Escopo
- Feature flags
- Limites Free
- Tela de upgrade mockada

### Prompt técnico
- Guards de features
- Estado userPlan

### Fora de código
- Definição de planos
- Proposta de valor

---

## 🟢 FASE 7 — Pagamentos (IAP)

### Objetivo
Ativar monetização oficial via lojas.

### Escopo
- Google Play Billing
- App Store IAP
- Restore purchases

### Prompt técnico
- Integração IAP
- Estados de compra

### Fora de código
- Política de reembolso
- Textos legais

---

## 🟢 FASE 8 — Anúncios (AdMob)

### Objetivo
Monetizar usuários Free sem degradar UX.

### Escopo
- Ads discretos
- Ads desativados no Pro

### Prompt técnico
- Integração AdMob
- Feature flag adsEnabled

### Fora de código
- Estratégia ética de ads

---

## 🧠 Avaliação da Estrutura Atual

### ✔️ Estrutura já muito bem preparada
- Separação clara de `components`, `services`, `models`
- Cálculos isolados (excelente para testes e cloud)
- Storage já abstraído

### 🔧 Ajustes futuros leves (sem refatoração pesada)
- Adicionar `services/cloud/`
- Adicionar `services/iap/`
- Criar `services/i18n/`
- Introduzir flags (`isPro`, `isLoggedIn`)

📌 Nenhuma refatoração estrutural grande é necessária.

---

## 📌 Regra de Ouro para Prompts

> Uma fase = um README = um prompt principal

Evite prompts gigantes.  
Cada README deve ser autocontido e executável.

---

## ✅ Conclusão

O projeto Clarus está:
- bem estruturado
- escalável
- pronto para publicação
- preparado para monetização futura

Este roadmap garante evolução sem retrabalho.
