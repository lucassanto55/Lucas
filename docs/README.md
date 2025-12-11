# Hibryda Pescados - Sistema de Planejamento de Rotas

Sistema completo para otimização logística, desenvolvido com React, Node.js e algoritmos TSP.

## 📁 Estrutura do Projeto

- **/frontend**: Código fonte da interface React (Pages, Components, Services).
- **/backend**: API Node.js, Express e Prisma Schema.
- **/docs**: Documentação detalhada.

## 🚀 Como Rodar (Quick Start)

### Pré-requisitos
- Node.js 18+
- Docker (Opcional)

### Instalação Manual

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Backend**:
   - Configure o `.env` com `DATABASE_URL` e `GOOGLE_MAPS_API_KEY`.
   - Navegue até `backend/` (simbólico, arquivos estão na raiz para este setup).
   - Rode `npx prisma push` para criar o banco.
   - `npm run server` (Se script configurado) ou `ts-node backend/server.ts`.

3. **Frontend**:
   ```bash
   npm run dev
   ```
   Acesse `http://localhost:5173`.

### Docker

Para subir todo o ambiente (Banco + API + Front):

```bash
docker-compose up --build
```

O sistema estará disponível em `http://localhost:3000`.

## 🗺️ Google Maps Integration

O sistema agora possui integração nativa com o **Google Maps Directions API**.

1. **Obter Chave**: Acesse o [Google Cloud Console](https://console.cloud.google.com/) e ative a "Directions API".
2. **Configurar Backend**: Crie um arquivo `.env` na raiz ou no diretório do backend:
   ```env
   GOOGLE_MAPS_API_KEY=sua_chave_aqui
   ```
3. **Funcionalidade**: 
   - Ao ativar o switch "Motor Google AI" no painel, o sistema enviará os pontos para o backend.
   - O backend consulta o Google com `optimize:true` para obter a melhor ordem de paradas.
   - O mapa desenhará a rota exata (curvas das ruas) ao invés de linhas retas.

## 🤖 Inteligência Artificial (Gemini)
O sistema utiliza **Google Gemini 2.5 Flash** para fornecer insights sobre a rota gerada.
Certifique-se de configurar `API_KEY` nas variáveis de ambiente.

## 🧪 Testes
- Backend: Jest configurado para testes de integração nas rotas.
- Frontend: Componentes testados com React Testing Library.

---
**Hibryda Pescados © 2024** - Tecnologia em Logística.