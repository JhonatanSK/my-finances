# Fase 5-0 — Pagamentos (In-App Purchases – IAP)

Esta fase ativa **monetização oficial** no Clarus por meio de **In-App Purchases (IAP)**,
seguindo rigorosamente as regras da Google Play Store e App Store.

O foco é **segurança, compliance e confiabilidade**, sem impactar o funcionamento offline.

---

## 🎯 Objetivo

- Ativar cobrança do plano Pro
- Integrar pagamentos nativos das lojas
- Garantir restore de compras
- Manter experiência estável e previsível

---

## 🧠 Contexto

Até esta fase:
- Existe diferenciação Free vs Pro
- Não há cobrança ativa
- UX de upgrade já está preparada

A partir daqui:
- O plano Pro passa a ser **comprável**
- A loja controla pagamentos, renovação e cancelamento

---

## 🧩 Problemas que esta fase resolve

- Monetização inexistente
- Risco de violar políticas usando pagamentos externos
- Falta de restore de compras
- Falta de estado confiável de assinatura

---

## 📦 Escopo (O que entra)

- In-App Purchases (assinatura)
- Produtos mensal e anual
- Restore purchases
- Estados de compra (loading, success, error)
- Sincronização do estado Pro com entitlements

---

## 🚫 Fora de Escopo (O que NÃO entra)

- Stripe ou pagamentos externos
- Vendas fora do app
- Cupons, trials complexos
- Analytics avançado
- Ads

---

## 🏗️ Decisões Técnicas

### Plataformas
- **Android:** Google Play Billing
- **iOS:** App Store In-App Purchases

### Tipo de Produto
- Assinatura recorrente
  - Mensal
  - Anual (com desconto)

---

## 🏷️ Produtos (Exemplo)

- `clarus_pro_monthly`
- `clarus_pro_yearly`

Regras:
- Mesmos benefícios
- Preço diferente
- Anual sempre mais vantajoso

---

## 🔄 Restore de Compras

Obrigatório:
- Botão “Restaurar compras”
- Funciona mesmo após reinstall
- Atualiza estado `userPlan` corretamente

---

## 🔐 Estados de Compra

Modelar explicitamente:

```ts
type PurchaseState =
  | 'IDLE'
  | 'LOADING'
  | 'SUCCESS'
  | 'ERROR'
```

Nunca assumir sucesso sem confirmação da loja.

---

## 🧪 Estratégia Offline

- Se usuário já é Pro:
  - app funciona offline normalmente
- Validação com loja ocorre:
  - no login
  - no restore
  - periodicamente quando online

Nunca bloquear funcionalidades Pro por falta temporária de internet.

---

## 📁 Estrutura de Pastas Impactada

```
services/
├── iap/
│   ├── IAPService.ts
│   ├── StoreKitService.ts      # iOS
│   ├── PlayBillingService.ts   # Android
│   └── index.ts
```

---

## 🧠 Prompt Técnico Detalhado (para IA / Cursor)

> Implementar monetização do plano Pro no projeto Clarus utilizando In-App Purchases nativas. Criar produtos de assinatura mensal e anual. Integrar Google Play Billing no Android e App Store IAP no iOS. Implementar restore purchases obrigatório. Sincronizar corretamente o estado de compra com os entitlements do app. Garantir que o app funcione offline para usuários Pro já validados. Não utilizar Stripe ou qualquer pagamento externo. Garantir conformidade total com as políticas das lojas.

---

## ✅ Checklist de Conclusão

- [ ] Produtos criados nas lojas
- [ ] Compra mensal funcional
- [ ] Compra anual funcional
- [ ] Restore purchases funcionando
- [ ] Estado Pro persistido corretamente
- [ ] App aprovado nas lojas com IAP

---

## 📌 Critério de Sucesso

> Usuários conseguem comprar, restaurar e usar o plano Pro sem erros ou bloqueios indevidos.

Qualquer reprovação por pagamento indica falha de compliance nesta fase.
