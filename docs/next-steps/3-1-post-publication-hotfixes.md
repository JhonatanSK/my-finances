# Fase 3-1 — Pós-Publicação & Hotfixes Iniciais

Esta fase cobre o período **imediatamente após a publicação** do Clarus nas lojas.
O foco é **estabilidade, ajustes rápidos e aprendizado**, não novas funcionalidades grandes.

É uma fase reativa e estratégica.

---

## 🎯 Objetivo

- Garantir estabilidade após publicação
- Corrigir problemas reais encontrados em produção
- Ajustar detalhes exigidos pelas lojas
- Coletar aprendizados iniciais sem mudar o core do app

---

## 🧠 Contexto

Após a publicação:
- O app passa a rodar em dispositivos reais
- Usuários encontram cenários não previstos
- As lojas podem solicitar pequenos ajustes
- Reviews começam a aparecer

Esta fase evita que problemas pequenos se acumulem.

---

## 🧩 Problemas que esta fase resolve

- Bugs específicos de device / OS
- Pequenos crashes não detectados antes
- Problemas de layout em resoluções específicas
- Ajustes de texto, descrição ou screenshots
- Feedback inicial de usuários

---

## 📦 Escopo (O que entra)

- Correções de bugs
- Hotfixes de layout
- Ajustes de performance
- Melhorias pequenas de UX
- Ajustes solicitados pela Play Store / App Store
- Pequenas melhorias de copy

---

## 🚫 Fora de Escopo (O que NÃO entra)

- Novas features grandes
- Cloud / Firebase
- Monetização
- Ads
- Refatorações estruturais
- Mudanças de modelo de dados

---

## 🧪 Monitoramento Inicial

Atividades recomendadas:
- Verificar crash reports (se houver)
- Acompanhar reviews diariamente
- Testar app em diferentes dispositivos
- Validar comportamento offline real

---

## 🛠️ Tipos Comuns de Hotfix

Exemplos esperados:
- Ajuste de padding em telas pequenas
- Correção de botão inacessível
- Texto truncado em inglês
- Ajuste de contraste
- Correção de estado não persistido

---

## 🧠 Estratégia de Versões

Recomendação:
- Incrementar versão patch (`1.0.1`, `1.0.2`)
- Changelogs claros e curtos
- Submissões frequentes são aceitáveis

---

## 🧠 Prompt Técnico Detalhado (para IA / Cursor)

> Executar correções pós-publicação no projeto Clarus focando exclusivamente em estabilidade, pequenos ajustes de UX e hotfixes. Corrigir bugs reportados por usuários ou identificados em produção. Ajustar layouts para diferentes tamanhos de tela, corrigir textos truncados e pequenos problemas de performance. Não adicionar novas features, não alterar modelos de dados e não refatorar arquitetura nesta fase. Priorizar rapidez, clareza e segurança das correções.

---

## ✅ Checklist de Conclusão

- [ ] Nenhum crash crítico conhecido
- [ ] App estável em múltiplos dispositivos
- [ ] Ajustes solicitados pelas lojas aplicados
- [ ] Reviews iniciais respondidas (quando possível)
- [ ] Versão patch publicada

---

## 📌 Critério de Sucesso

> O app se mantém estável, com boa experiência inicial, enquanto o time coleta aprendizados reais de uso.

Se esta fase virar um “feature creep”, ela foi executada incorretamente.
