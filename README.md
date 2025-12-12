# Clarus 📊

> Aplicativo mobile de planejamento financeiro pessoal com projeções de longo prazo, análise de saúde financeira e comparação de cenários.

[![Expo](https://img.shields.io/badge/Expo-54.0-black?style=flat&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?style=flat&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat&logo=typescript)](https://www.typescriptlang.org)

## 📱 Sobre o Projeto

**Clarus** é um aplicativo mobile desenvolvido com React Native e Expo que permite criar relatórios financeiros pessoais, projetar o crescimento patrimonial ao longo do tempo e analisar diferentes cenários de investimento.

### Características Principais

- ✅ **100% Offline**: Funciona completamente sem conexão à internet
- 📈 **Projeções Financeiras**: Cálculo automático de crescimento patrimonial mês a mês
- 🎯 **Metas de Patrimônio**: Definição e acompanhamento de metas financeiras
- 📊 **Análise de Saúde Financeira**: Métricas detalhadas sobre entradas, saídas e investimentos
- 📸 **Snapshots**: Captura de "visões" do relatório para comparação de cenários
- 🎨 **Interface Moderna**: UI/UX cuidadosamente projetada com tema dark/light
- 💾 **Armazenamento Local**: Dados salvos localmente no dispositivo

## 🚀 Funcionalidades

### Relatórios Financeiros

- Criação e edição de relatórios personalizados
- Definição de entradas e saídas mensais
- Configuração de taxa de investimento anual
- Estabelecimento de metas de patrimônio
- Destaque de meses específicos para análise

### Projeções e Análises

- **Projeção Mês a Mês**: Visualização detalhada do crescimento patrimonial
- **Gráficos Interativos**: Visualização gráfica das projeções com linha de meta
- **Saúde Financeira**: Análise de:
  - Entradas vs. Saídas mensais
  - Percentual mantido do orçamento
  - Retorno de investimento vs. custos
  - Previsão de quando o retorno cobrirá todos os custos
  - Projeção considerando investimentos

### Snapshots e Comparações

- Captura de "visões" do relatório em momentos específicos
- Comparação entre diferentes snapshots
- Comparação de snapshot com a visão atual
- Análise de diferenças entre cenários

### Interface e UX

- **Navegação por Tabs**: Acesso rápido a relatórios e configurações
- **Headers Customizados**: Navegação consistente em todas as telas
- **Componentes Reutilizáveis**: UI padronizada e consistente
- **Animações Suaves**: Transições e feedbacks visuais
- **Safe Area**: Respeita áreas seguras do dispositivo

## 🛠️ Tecnologias

### Core

- **[Expo](https://expo.dev)** (~54.0) - Framework e ferramentas
- **[React Native](https://reactnative.dev)** (0.81.5) - Framework mobile
- **[TypeScript](https://www.typescriptlang.org)** (5.9) - Tipagem estática
- **[Expo Router](https://docs.expo.dev/router/introduction/)** (6.0) - Roteamento baseado em arquivos

### Estado e Dados

- **React Context API** - Gerenciamento de estado global
- **AsyncStorage** - Persistência local de dados
- **Custom Hooks** - Lógica reutilizável

### UI e Estilo

- **React Native Reanimated** - Animações performáticas
- **React Native SVG** - Gráficos e visualizações
- **Expo Vector Icons** - Ícones
- **Safe Area Context** - Gerenciamento de áreas seguras

### Utilitários

- **UUID** - Geração de IDs únicos
- **DateTimePicker** - Seleção de datas

## 📁 Estrutura do Projeto

```
my-finances/
├── app/                    # Rotas e telas (Expo Router)
│   ├── (tabs)/            # Navegação por tabs
│   └── report/            # Telas de relatórios
├── components/            # Componentes React
│   ├── ui/                # Componentes genéricos
│   ├── reports/           # Componentes de relatórios
│   └── snapshots/          # Componentes de snapshots
├── contexts/              # React Contexts
│   ├── ReportsContext.tsx # Estado de relatórios
│   └── SettingsContext.tsx # Configurações e flags
├── hooks/                 # Custom Hooks
├── services/              # Lógica de negócio
│   ├── calculations/      # Cálculos financeiros
│   └── storage/           # Persistência de dados
├── models/                # Tipos TypeScript
├── utils/                 # Funções utilitárias
├── constants/            # Constantes (cores, espaçamento, tipografia)
└── docs/                  # Documentação
    ├── ARCHITECTURE.md    # Arquitetura detalhada
    └── next-steps/        # Roadmap futuro
```

Para mais detalhes sobre a arquitetura, consulte [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas com separação clara de responsabilidades:

```
UI Layer (app/, components/)
    ↓
Hooks / Contexts Layer (hooks/, contexts/)
    ↓
Services Layer (services/)
    ↓
Storage Layer (services/storage/)
```

### Princípios

1. **Offline-first**: App funciona 100% offline
2. **Separação de Responsabilidades**: UI, lógica de negócio e persistência separadas
3. **Dependências Unidirecionais**: UI → Hooks/Contexts → Services → Storage
4. **Tipagem Forte**: TypeScript em todo o código

### Regras de Ouro

- ❌ Nunca importar services diretamente em componentes UI
- ❌ Contexts não contêm lógica de cálculo
- ✅ Services são puros e testáveis
- ✅ UI não conhece storage diretamente

## 🚦 Como Começar

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Expo CLI (instalado globalmente ou via npx)
- Dispositivo móvel com Expo Go ou emulador/simulador

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd my-finances
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**
   ```bash
   npx expo start
   ```

4. **Execute no dispositivo**
   - **Expo Go**: Escaneie o QR code com o app Expo Go
   - **iOS Simulator**: Pressione `i` no terminal
   - **Android Emulator**: Pressione `a` no terminal
   - **Web**: Pressione `w` no terminal

### Scripts Disponíveis

```bash
npm start          # Inicia o servidor Expo
npm run android    # Inicia no Android
npm run ios        # Inicia no iOS
npm run web        # Inicia no navegador
npm run lint       # Executa o linter
```

## 📚 Documentação

- **[Arquitetura](docs/ARCHITECTURE.md)**: Detalhes sobre a estrutura e organização do código
- **[Roadmap](docs/README-ROADMAP-GERAL.md)**: Plano de evolução do projeto
- **[Services](services/README.md)**: Documentação dos serviços

## 🗺️ Roadmap

O projeto está organizado em fases de desenvolvimento:

- ✅ **Fase 0**: Base Consolidada (Concluída)
- ✅ **Fase 1**: Arquitetura e Organização (Concluída)
- 🔄 **Fase 2**: Persistência Local Avançada (Planejada)
- 🔄 **Fase 3**: Internacionalização PT/EN (Planejada)
- 🔄 **Fase 4**: Preparação para Publicação (Planejada)
- 🔄 **Fase 5**: Cloud Sync & Login (Planejada)
- 🔄 **Fase 6**: Free vs Pro (Planejada)
- 🔄 **Fase 7**: Pagamentos IAP (Planejada)
- 🔄 **Fase 8**: Anúncios AdMob (Planejada)

Para mais detalhes, consulte [docs/README-ROADMAP-GERAL.md](docs/README-ROADMAP-GERAL.md).

## 🎨 Design System

O projeto utiliza um sistema de design consistente:

- **Cores**: Tema dark/light com paleta definida em `constants/theme.ts`
- **Espaçamento**: Sistema de espaçamento padronizado em `constants/spacing.ts`
- **Tipografia**: Hierarquia tipográfica em `constants/typography.ts`
- **Componentes**: Biblioteca de componentes reutilizáveis em `components/ui/`

## 🔒 Privacidade e Dados

- **Armazenamento Local**: Todos os dados são armazenados localmente no dispositivo
- **Sem Coleta de Dados**: Nenhum dado é enviado para servidores externos
- **Offline-first**: Funciona completamente sem conexão à internet

## 🤝 Contribuindo

Este é um projeto pessoal, mas sugestões e melhorias são bem-vindas!

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto é privado e de uso pessoal.

## 👤 Autor

Desenvolvido como projeto pessoal de planejamento financeiro.

---

**Nota**: Este projeto está em desenvolvimento ativo. Funcionalidades podem mudar e novas features podem ser adicionadas.
