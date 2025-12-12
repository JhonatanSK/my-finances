# Fase 2-2 — Internacionalização (i18n PT-BR / EN)

Esta fase introduz **internacionalização completa** no Clarus, permitindo alternar entre
Português (PT-BR) e Inglês (EN), com persistência local da escolha do idioma.

É uma fase **estrutural e de UX**, sem impacto em regras de negócio.

---

## 🎯 Objetivo

- Tornar o app multilíngue
- Preparar o produto para publicação internacional
- Centralizar todos os textos do app
- Permitir troca de idioma em tempo real

---

## 🧠 Contexto Atual

Atualmente:
- Textos estão hardcoded nos componentes
- Não há estrutura para tradução
- Não existe controle de idioma no app

Isso dificulta:
- expansão internacional
- manutenção de textos
- consistência de UX

---

## 🧩 Problemas que esta fase resolve

- Textos espalhados pelo código
- Dificuldade de alterar cópias
- Impossibilidade de trocar idioma
- Risco de inconsistência textual

---

## 📦 Escopo (O que entra)

- Sistema de i18n
- Idiomas: PT-BR (default) e EN
- Arquivos de tradução
- Hook de tradução
- Botão de troca de idioma em Settings
- Persistência da escolha no storage local

---

## 🚫 Fora de Escopo (O que NÃO entra)

- Tradução automática
- Idiomas adicionais
- Detecção automática por sistema
- Textos legais (privacy, termos)

---

## 🏗️ Decisões Técnicas

### Biblioteca recomendada

Opções válidas:
- `i18n-js`
- `expo-localization`

Sugestão:
- `i18n-js` + persistência manual do idioma

Motivo:
- simples
- controlável
- offline-first

---

## 🌍 Estrutura de Arquivos

```
services/
└── i18n/
    ├── index.ts          # configuração principal
    ├── pt-BR.ts          # traduções PT
    └── en.ts             # traduções EN
```

---

## 🧠 Chaves de Tradução

Usar chaves semânticas, nunca textos literais:

```ts
report.create.title
report.create.submit
settings.language.title
settings.language.pt
settings.language.en
```

Evitar:
- chaves longas demais
- chaves baseadas em layout

---

## 🪝 Hook de Tradução

Criar hook:

```ts
function useTranslation() {
  return {
    t: (key: string, params?: Record<string, any>) => string,
    locale: string,
    setLocale: (locale: string) => void
  }
}
```

---

## ⚙️ Persistência do Idioma

- Salvar idioma selecionado no storage local
- Recarregar no boot do app
- Default: PT-BR

Exemplo conceitual:

```ts
await storage.set('language', 'pt-BR')
```

---

## 🖥️ UI — Tela de Configurações

Adicionar seção:

```
Settings
└── Idioma
    ├── Português (PT-BR)
    └── English (EN)
```

Regras:
- mudança imediata
- sem reload do app
- feedback visual de seleção

---

## 🧠 Prompt Técnico Detalhado (para IA / Cursor)

> Implementar internacionalização no projeto Clarus utilizando `i18n-js`. Criar estrutura centralizada de traduções com suporte a PT-BR (default) e EN. Extrair todos os textos hardcoded para arquivos de tradução usando chaves semânticas. Criar hook `useTranslation` para acesso às traduções e controle de idioma. Implementar persistência do idioma selecionado usando o storage local existente. Adicionar opção de troca de idioma na tela de Settings, com atualização imediata da UI. Garantir que o app continue funcionando offline e sem impacto em regras de negócio.

---

## ✅ Checklist de Conclusão

- [ ] Nenhum texto hardcoded relevante
- [ ] Arquivos pt-BR e en completos
- [ ] Troca de idioma funcional
- [ ] Idioma persistido entre sessões
- [ ] App funcionando exatamente como antes

---

## 📌 Critério de Sucesso

> O usuário pode trocar o idioma do app a qualquer momento sem reiniciar o app ou perder dados.

Se textos permanecerem hardcoded ou inconsistentes, esta fase não foi concluída corretamente.
