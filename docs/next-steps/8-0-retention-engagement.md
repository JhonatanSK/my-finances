# Fase 8-0 — Retenção & Engajamento (Valor Contínuo ao Usuário)

Esta fase foca em **fazer o usuário voltar**, usando recursos locais e inteligentes
para transformar o Clarus em uma ferramenta de acompanhamento contínuo,
não apenas um simulador pontual.

O foco é **valor recorrente**, não notificações invasivas.

---

## 🎯 Objetivo

- Aumentar retenção D7 / D30
- Incentivar uso recorrente
- Criar hábitos financeiros leves
- Reforçar percepção de valor do app

---

## 🧠 Princípios de Engajamento

- Utilidade > frequência
- Contexto > interrupção
- Controle do usuário sempre
- Tudo funciona offline

---

## 🧩 Problemas que esta fase resolve

- Usuário usa o app uma vez e abandona
- Falta de motivo para retornar
- Pro percebido como “uso pontual”
- Baixa retenção mesmo com bom ASO

---

## 📦 Escopo (O que entra)

- Notificações locais (opt-in)
- Lembretes inteligentes
- Insights automáticos simples
- Estados vazios mais orientados
- Pequenos gatilhos de retorno

---

## 🚫 Fora de Escopo (O que NÃO entra)

- Push remoto
- Spam de notificações
- Automação baseada em cloud
- IA generativa
- Recomendações financeiras complexas

---

## 🔔 Notificações Locais

### Tipos permitidos

- Lembrete mensal de atualização
- Lembrete de snapshot
- Alerta de meta próxima

Regras:
- Opt-in explícito
- Frequência baixa
- Texto claro e neutro

---

## 🧠 Insights Automáticos (Simples)

Exemplos:
- “Sua taxa de poupança aumentou nos últimos 3 meses”
- “Você está mais perto da meta do que no último snapshot”
- “Seu patrimônio está estável”

Esses insights:
- são locais
- baseados em cálculos existentes
- não fazem promessas financeiras

---

## 🖥️ UX — Estados Vazios Inteligentes

Exemplos:
- Lista vazia → explicar benefício
- Sem snapshots → sugerir criar
- Sem meta → sugerir definir

Sempre:
- com CTA claro
- sem pressão

---

## 🧠 Diferenciação Free vs Pro

Free:
- Lembretes básicos
- Insights simples

Pro:
- Mais tipos de lembrete
- Insights mais frequentes
- Personalização maior

---

## 📁 Estrutura de Pastas Impactada

```
services/
├── notifications/
│   ├── NotificationService.ts
│   └── index.ts
├── insights/
│   ├── InsightService.ts
│   └── index.ts
```

---

## 🧠 Prompt Técnico Detalhado (para IA / Cursor)

> Implementar recursos de retenção e engajamento no projeto Clarus focando em valor contínuo ao usuário. Adicionar notificações locais opt-in para lembretes financeiros simples (mensais, snapshots, metas). Implementar geração de insights automáticos básicos utilizando dados locais já existentes, sem uso de IA generativa ou cloud. Melhorar estados vazios com mensagens educativas e CTAs claros. Garantir que todas as funcionalidades respeitem o plano do usuário (Free vs Pro), funcionem offline e não sejam invasivas.

---

## ✅ Checklist de Conclusão

- [ ] Notificações locais funcionando
- [ ] Opt-in respeitado
- [ ] Insights automáticos visíveis
- [ ] Estados vazios melhorados
- [ ] Retenção medida via analytics

---

## 📌 Critério de Sucesso

> Usuários retornam ao app por perceberem valor contínuo, não por insistência.

Se notificações forem desativadas em massa ou usuários reclamarem, esta fase falhou.
