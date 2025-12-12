# Fase 6-0 — Monetização com Ads (AdMob)

Esta fase introduz **anúncios no plano Free** do Clarus utilizando **Google AdMob**,
de forma **não intrusiva**, controlada por entitlements e totalmente compatível
com as políticas das lojas.

O objetivo é monetizar usuários Free sem degradar a experiência.

---

## 🎯 Objetivo

- Monetizar o plano Free com anúncios
- Manter UX limpa e previsível
- Garantir compliance com políticas de Ads
- Desativar Ads automaticamente para usuários Pro

---

## 🧠 Contexto

Até esta fase:
- Monetização via Pro já existe
- Usuários Free não geram receita
- Estrutura de entitlements já está pronta

A partir daqui:
- Free passa a gerar receita
- Pro remove Ads como benefício claro

---

## 🧩 Problemas que esta fase resolve

- Usuários Free sem monetização
- Falta de incentivo claro para upgrade
- Risco de UX poluída por Ads mal posicionados
- Falta de controle centralizado de Ads

---

## 📦 Escopo (O que entra)

- Integração com Google AdMob
- Banner Ads discretos
- Controle por entitlements
- Fallback seguro offline
- Configuração separada por ambiente

---

## 🚫 Fora de Escopo (O que NÃO entra)

- Ads em tela cheia (interstitial)
- Ads recompensados
- Ads agressivos
- Tracking avançado
- Segmentação personalizada

---

## 🏗️ Decisões Técnicas

### Tipos de Ads Permitidos

- Banner fixo
- Banner adaptativo

Locais recomendados:
- Rodapé da Home
- Rodapé de telas longas (lista, projeções)

Nunca:
- no meio de formulários
- bloqueando ações primárias
- em telas de erro ou loading

---

## 🔐 Controle por Plano

Regras:
- `FREE` → Ads habilitados
- `PRO` → Ads totalmente desabilitados

Ads **nunca** devem ser carregados se o plano for Pro.

---

## 📡 Estratégia Offline

- Ads só carregam se houver internet
- Falha silenciosa se offline
- Nenhum bloqueio de UI por Ads

---

## 🧪 Compliance & Políticas

Obrigatório:
- Aviso de uso de Ads na política de privacidade
- Não incentivar cliques
- Não sobrepor conteúdo
- Não usar Ads enganosos

---

## 📁 Estrutura de Pastas Impactada

```
services/
├── ads/
│   ├── AdsService.ts
│   ├── AdMobService.ts
│   └── index.ts
```

---

## 🧠 Prompt Técnico Detalhado (para IA / Cursor)

> Implementar monetização com Ads no projeto Clarus utilizando Google AdMob. Integrar banners discretos apenas para usuários do plano Free, controlados via entitlements. Garantir que usuários Pro nunca vejam anúncios. Implementar carregamento seguro de Ads apenas quando houver conexão com internet, com fallback silencioso offline. Posicionar Ads apenas em locais não intrusivos da UI. Garantir conformidade total com políticas do AdMob e das lojas. Não implementar interstitial, rewarded ads ou formatos agressivos.

---

## ✅ Checklist de Conclusão

- [ ] AdMob configurado corretamente
- [ ] Banner Ads exibidos no plano Free
- [ ] Ads removidos no plano Pro
- [ ] App funciona offline sem erros
- [ ] Política de privacidade atualizada
- [ ] App aprovado nas lojas com Ads

---

## 📌 Critério de Sucesso

> Usuários Free veem Ads de forma discreta e usuários Pro têm experiência limpa sem anúncios.

Se Ads atrapalharem o uso do app ou causarem reprovação, esta fase falhou.
