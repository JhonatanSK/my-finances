# Fase 3-0 — Preparação para Publicação (Play Store & App Store)

Esta fase prepara o Clarus para **publicação oficial nas lojas**, sem monetização,
sem login e sem dependências externas sensíveis.

O foco é **compliance, estabilidade e apresentação**, não novas features.

---

## 🎯 Objetivo

- Tornar o app publicável nas lojas
- Atender requisitos mínimos da Play Store e App Store
- Garantir build estável Android e iOS
- Preparar identidade básica de loja (nome, ícone, descrição)

---

## 🧠 Contexto Atual

O app já está:
- funcional
- offline-first
- com UI consistente
- sem coleta de dados
- sem login
- sem anúncios

Este é o **cenário ideal** para primeira publicação, com baixo risco de reprovação.

---

## 🧩 Problemas que esta fase resolve

- App não preparado para build de produção
- Falta de metadados obrigatórios de loja
- Ausência de política de privacidade
- Inconsistências de nome, ícone ou splash

---

## 📦 Escopo (O que entra)

- Nome oficial do app: **Clarus**
- Ícone final
- Splash screen
- Configuração de build (Android / iOS)
- Política de privacidade
- Metadados básicos das lojas
- Teste de build e publicação

---

## 🚫 Fora de Escopo (O que NÃO entra)

- Login
- Firebase / cloud
- Monetização
- Ads
- Planos Pro
- Tracking / analytics

---

## 🏗️ Decisões Importantes

### Posicionamento inicial
- App gratuito
- 100% offline
- Sem coleta de dados
- Sem promessas financeiras

### Comunicação clara
- Usar termos como:
  - projeção
  - simulação
  - estimativa
- Evitar:
  - garantias
  - ganhos
  - promessas de retorno

---

## 🖼️ Identidade Visual (Loja)

### Nome
**Clarus**

### Subtítulo sugerido
- Clarus – Planejamento e Projeção Financeira
- Clarus – Controle de Patrimônio e Metas

### Ícone
- Ícone minimalista já definido
- Testado em 48x48, 192x192 e 512x512
- Fundo escuro + símbolo cyan

### Splash Screen
- Fundo escuro
- Ícone centralizado
- Sem texto excessivo

---

## ⚙️ Configuração Expo

### Arquivos impactados
- `app.json` ou `app.config.ts`

Itens obrigatórios:
- `name`
- `slug`
- `icon`
- `splash`
- `version`
- `orientation`
- `android.package`
- `ios.bundleIdentifier`

---

## 📜 Política de Privacidade

Conteúdo mínimo recomendado:

- App funciona offline
- Nenhum dado pessoal coletado
- Nenhum dado compartilhado
- Nenhum tracking

Publicar em:
- GitHub Pages
- Site simples
- URL pública acessível

---

## 🛍️ Metadados da Loja

### Play Store
- Descrição curta
- Descrição longa
- Ícone 512x512
- Screenshots reais
- Classificação indicativa

### App Store
- Descrição
- Screenshots
- Questionário de privacidade
- Categoria adequada (Finanças)

---

## 🧪 Testes Antes de Subir

Checklist obrigatório:
- [ ] App abre sem internet
- [ ] Nenhum crash
- [ ] Dados persistem após fechar app
- [ ] Idioma funciona corretamente
- [ ] Ícone aparece corretamente
- [ ] Splash não corta elementos

---

## 🧠 Prompt Técnico Detalhado (para IA / Cursor)

> Preparar o projeto Clarus para publicação nas lojas. Configurar corretamente `app.json/app.config.ts` com nome oficial, ícone final, splash screen e identificadores Android e iOS. Garantir builds estáveis usando Expo/EAS para Android e iOS. Criar política de privacidade simples informando que o app funciona offline e não coleta dados. Ajustar textos e metadados básicos da loja (nome, subtítulo, descrição). Nenhuma funcionalidade nova deve ser adicionada nesta fase.

---

## ✅ Checklist de Conclusão

- [ ] Build Android gerado com sucesso
- [ ] Build iOS gerado com sucesso
- [ ] Ícone e splash corretos
- [ ] Política de privacidade publicada
- [ ] Metadados preenchidos
- [ ] App submetido para revisão

---

## 📌 Critério de Sucesso

> O app é aceito nas lojas sem reprovação por compliance ou configuração.

Qualquer reprovação nesta fase indica falha de preparação, não de produto.
