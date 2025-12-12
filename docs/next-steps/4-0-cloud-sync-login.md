# Fase 4-0 — Cloud Sync & Login Opcional (Firebase)

Esta fase adiciona **sincronização em nuvem opcional** ao Clarus, mantendo o app
**offline-first** e totalmente funcional sem login.

O objetivo é permitir backup, restauração e uso em múltiplos dispositivos,
sem transformar login em dependência obrigatória.

---

## 🎯 Objetivo

- Adicionar login opcional ao app
- Sincronizar dados entre dispositivos
- Manter funcionamento 100% offline
- Preparar base para plano Pro no futuro

---

## 🧠 Contexto

Até esta fase:
- O app funciona totalmente offline
- Dados ficam apenas no dispositivo
- Não existe conceito de conta de usuário

A partir daqui:
- Login passa a ser um **benefício**, não uma obrigação
- Cloud é um **upgrade de valor**, não um requisito

---

## 🧩 Problemas que esta fase resolve

- Perda de dados ao trocar de celular
- Impossibilidade de usar o app em mais de um dispositivo
- Falta de backup automático
- Base inexistente para features premium futuras

---

## 📦 Escopo (O que entra)

- Login opcional
- Sincronização de dados
- Backup em nuvem
- Restore manual ou automático
- Resolução simples de conflitos

---

## 🚫 Fora de Escopo (O que NÃO entra)

- Monetização
- Plano Pro pago
- Ads
- Analytics avançado
- Compartilhamento de relatórios

---

## 🏗️ Decisões Técnicas

### Stack Recomendada

- Firebase Auth
- Firestore
- Expo Firebase SDK

### Métodos de Login

Obrigatórios nesta fase:
- Email + senha

Opcional (recomendado):
- Sign in with Apple (iOS)
- Google Sign-In (Android)

---

## 🔐 Estratégia de Login

Regras importantes:
- Login nunca bloqueia o uso do app
- Usuário pode:
  - usar sem conta
  - criar conta depois
  - fazer logout sem perder dados locais

---

## ☁️ Estratégia Offline-First

### Fluxo esperado

1. Usuário cria dados localmente
2. Usuário faz login
3. App oferece:
   - “Fazer backup dos dados”
4. Dados locais são enviados para a nuvem
5. Em novo dispositivo:
   - usuário faz login
   - escolhe restaurar dados

Nunca sobrescrever dados automaticamente sem confirmação.

---

## 🔄 Estratégia de Conflito (Simplificada)

Opção inicial:
- Última atualização vence (last-write-wins)

Alternativa futura:
- Escolha manual do usuário

---

## 📁 Estrutura de Pastas Impactada

```
services/
├── cloud/
│   ├── CloudService.ts
│   ├── FirebaseCloudService.ts
│   └── index.ts
├── storage/
└── index.ts

contexts/
├── AuthContext.tsx
└── index.ts
```

---

## 🧠 Prompt Técnico Detalhado (para IA / Cursor)

> Implementar sincronização em nuvem opcional no projeto Clarus utilizando Firebase. Criar fluxo de login opcional (email/senha inicialmente), garantindo que o app continue funcionando 100% offline sem autenticação. Implementar serviço de cloud responsável por backup e restore dos dados locais, respeitando a estrutura de storage versionado existente. Criar AuthContext para gerenciar estado de autenticação. Implementar fluxo de sincronização manual com confirmação do usuário e resolução simples de conflitos (last-write-wins). Não adicionar monetização, ads ou analytics nesta fase.

---

## ✅ Checklist de Conclusão

- [ ] Login opcional funcional
- [ ] App funciona sem login
- [ ] Backup manual em nuvem
- [ ] Restore em novo dispositivo
- [ ] Dados locais preservados ao fazer logout
- [ ] Nenhuma perda de dados em sync

---

## 📌 Critério de Sucesso

> O usuário percebe o login como um benefício opcional, nunca como uma exigência.

Se o app deixar de funcionar sem login ou perder dados locais, esta fase falhou.
