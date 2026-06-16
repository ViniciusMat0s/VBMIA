# VBM IA

Landing page em React + Tailwind para vender packs de prompts para geração de fotos com IA.

## Como rodar

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Admin sem Blaze

Para promover um usuário a `admin` sem Cloud Functions:

1. Baixe a service account JSON no Firebase Console.
2. Salve o arquivo como `serviceAccountKey.json` na raiz do projeto ou em `functions/serviceAccountKey.json`.
3. Rode:

```bash
npm run admin:set -- user@email.com
```

Depois faça logout/login no app para o token atualizar as custom claims.
