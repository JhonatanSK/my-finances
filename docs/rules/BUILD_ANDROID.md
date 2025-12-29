# Como Gerar APK para Teste no Android

## ✅ Tudo Configurado!

O projeto já está pronto para gerar o APK. Siga estes passos simples:

## 🚀 Passos Rápidos

### 1. Fazer login no EAS (primeira vez)
```bash
eas login
```
- Se não tiver conta, crie uma gratuita em: https://expo.dev
- O login vai pedir email/senha

### 2. Gerar o APK
```bash
npm run build:android
```

**OU** execute diretamente:
```bash
eas build --platform android --profile preview
```

## ⏱️ O que acontece?

1. O código é enviado para os servidores do Expo
2. O app é compilado na nuvem (10-20 minutos)
3. Você recebe um link para baixar o APK

## 📱 Instalar no Android

1. Baixe o APK no seu dispositivo
2. Permita "Instalar apps de fontes desconhecidas" nas configurações
3. Abra o arquivo APK e instale

## 📊 Acompanhar o Build

Você pode ver o progresso em tempo real em:
- Dashboard do Expo: https://expo.dev
- Ou aguarde o link no terminal

## 🔧 Comandos Úteis

```bash
# Verificar se está logado
eas whoami

# Build local (mais rápido, requer Android SDK)
npm run build:android:local

# Ver builds anteriores
eas build:list
```

## 💡 Dicas

- O primeiro build demora mais (cria credenciais automaticamente)
- O APK gerado funciona em qualquer Android (não precisa Play Store)
- Para publicar na Play Store, use: `eas build --platform android --profile production`

