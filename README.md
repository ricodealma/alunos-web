# Frontend - Sistema de Gestão de Alunos

Frontend em Next.js 14 com TypeScript para gerenciamento de alunos com autenticação.

## 🚀 Tecnologias

- **Next.js 14** (App Router)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 4**
- **Axios** para requisições HTTP
- **Context API** para gerenciamento de estado

## 📦 Pré-requisitos

- Node.js 18+ LTS
- npm 9+
- Backend API rodando em http://localhost:5000

## 🔧 Instalação

```bash
# Instalar dependências
npm install
```

## 🏃 Executar em Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

## 🏗️ Build de Produção

```bash
# Criar build otimizado
npm run build

# Iniciar servidor de produção
npm start
```

## 🐳 Executar com Docker

### Opção 1: Docker apenas frontend

```bash
# Build da imagem
docker build -t alunos-frontend .

# Executar container
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:5000/api alunos-frontend
```

### Opção 2: Docker Compose (recomendado)
Este repositório contém um `docker-compose.yml` que sobe o ambiente completo (Banco + API + Frontend) usando imagens pré-compiladas.

```bash
# Iniciar todos os serviços
docker-compose up -d
```

Isso subirá:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:5000/swagger
- **Banco**: Porta 5432

### Executar em Desenvolvimento (Local)

1. Suba apenas o backend caso necessário, ou use o docker-compose e pare o container `alunos-web`:
   ```bash
   docker-compose up -d
   docker stop alunos-web
   ```
2. Instale dependências e rode o frontend localmente:
   ```bash
   npm install
   npm run dev
   ```

## 🏗️ Build de Produção

Exemplo de credenciais:
- Email: `admin@test.com`
- Senha: `admin123`

## 🌐 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Variáveis Disponíveis:**

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `NEXT_PUBLIC_API_URL` | URL base da API backend | `http://localhost:5000/api` |

## 📁 Estrutura do Projeto

```
frontend/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx          # Layout raiz com AuthProvider
│   ├── page.tsx            # Página inicial (redirecionamento)
│   ├── globals.css         # Estilos globais + Tailwind
│   ├── login/              
│   │   └── page.tsx        # Página de login
│   └── students/           
│       └── page.tsx        # Página de gestão de alunos
│
├── components/             # Componentes React reutilizáveis
│   ├── DeleteConfirmation.tsx  # Modal de confirmação
│   ├── LoadingSpinner.tsx      # Indicador de carregamento
│   ├── LoginForm.tsx           # Formulário de login
│   ├── Pagination.tsx          # Controles de paginação
│   ├── StudentForm.tsx         # Formulário de adicionar aluno
│   └── StudentList.tsx         # Lista/tabela de alunos
│
├── contexts/               # React Context API
│   └── AuthContext.tsx     # Contexto de autenticação
│
├── services/               # Serviços externos
│   └── api.ts              # Cliente Axios com interceptors
│
├── types/                  # TypeScript type definitions
│   └── index.ts            # Interfaces (Student, User, etc.)
│
├── public/                 # Assets estáticos
├── .env.local              # Variáveis de ambiente (não commitar)
├── .env.example            # Template de variáveis
├── next.config.ts          # Configuração Next.js
├── tailwind.config.ts      # Configuração Tailwind
├── tsconfig.json           # Configuração TypeScript
├── Dockerfile              # Build Docker multi-stage
└── package.json            # Dependências e scripts
```

## 🎯 Funcionalidades

### ✅ Implementado

- **Autenticação**
  - Login com email e senha
  - Persistência de sessão (localStorage)
  - Proteção de rotas
  - Logout

- **Gestão de Alunos**
  - Listar alunos com paginação (10 por página)
  - Adicionar novo aluno
  - Excluir aluno com confirmação
  - Validação de formulários
  - Mensagens de sucesso/erro

- **Interface**
  - Design responsivo (mobile e desktop)
  - Loading states
  - Tratamento de erros
  - Feedback visual para ações

### 🚧 Fora do Escopo (Futuras Melhorias)

- Editar/atualizar aluno existente
- Busca e filtros avançados
- Exportar dados (CSV, PDF)
- Modo escuro
- Testes automatizados
- PWA/Offline support

## 🧪 Testando a Aplicação

### Cenários de Teste Manual

**1. Autenticação (US1)**
- [ ] Login com credenciais válidas → redireciona para /students
- [ ] Login com credenciais inválidas → mostra erro
- [ ] Fechar navegador → reabrir → continua logado
- [ ] Clicar em Sair → redireciona para /login
- [ ] Acessar /students sem login → redireciona para /login

**2. Visualizar Alunos (US2)**
- [ ] Lista exibe ID, Nome, Email, Série
- [ ] Mensagem "Nenhum aluno cadastrado" quando vazio
- [ ] Paginação aparece quando >10 alunos
- [ ] Botões Anterior/Próxima funcionam corretamente
- [ ] Loading spinner durante carregamento

**3. Adicionar Aluno (US3)**
- [ ] Botão "Adicionar Aluno" abre formulário
- [ ] Validação de campos obrigatórios
- [ ] Validação de formato de email
- [ ] Novo aluno aparece na lista após criação
- [ ] Mensagem de sucesso exibida

**4. Excluir Aluno (US4)**
- [ ] Botão excluir abre modal de confirmação
- [ ] Confirmar exclui e remove da lista
- [ ] Cancelar fecha modal sem excluir
- [ ] Mensagem de sucesso após exclusão

## 🐛 Troubleshooting

### Problema: "Cannot connect to API"

**Solução:**
1. Verifique se o backend está rodando em http://localhost:5000
2. Confira o valor de `NEXT_PUBLIC_API_URL` no `.env.local`
3. Verifique CORS no backend (deve permitir `http://localhost:3000`)

### Problema: "401 Unauthorized" em todas as requisições

**Solução:**
1. Faça logout e login novamente
2. Limpe localStorage: `localStorage.clear()`
3. Verifique se o token JWT está válido no backend

### Problema: Estilos Tailwind não aparecem

**Solução:**
1. Reinicie o servidor de desenvolvimento
2. Verifique se `globals.css` está importado no layout
3. Limpe cache: `rm -rf .next && npm run dev`

### Problema: Docker build falha

**Solução:**
1. Verifique se `output: 'standalone'` está no `next.config.ts`
2. Confira se `.dockerignore` está presente
3. Tente rebuild sem cache: `docker build --no-cache -t alunos-frontend .`

## 📝 Scripts NPM

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento (hot reload) |
| `npm run build` | Cria build de produção |
| `npm start` | Inicia servidor de produção (requer build) |
| `npm run lint` | Executa ESLint |

## 🔐 Segurança

### Implementado
- Validação de entrada no client-side
- Token JWT armazenado no localStorage
- Interceptor Axios para adicionar Authorization header
- Redirecionamento automático em caso de token expirado (401)
- HTTPS recomendado em produção

### Riscos Conhecidos
- **localStorage XSS**: Tokens no localStorage são vulneráveis a ataques XSS
  - **Mitigação**: Em produção, considere usar httpOnly cookies
- **Token Exposure**: Token visível no DevTools > Application
  - **Mitigação**: Tokens de curta duração + refresh tokens

## 🚀 Deploy em Produção

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker Production

```bash
# Build para produção
docker build -t alunos-frontend:latest .

# Run com variáveis de ambiente
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.seudominio.com/api \
  alunos-frontend:latest
```

## 📚 Documentação Relacionada

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Axios](https://axios-http.com/docs/intro)

## 👥 Contribuindo

1. Crie uma branch para sua feature: `git checkout -b feature/nova-funcionalidade`
2. Commit suas mudanças: `git commit -m 'feat: adiciona nova funcionalidade'`
3. Push para a branch: `git push origin feature/nova-funcionalidade`
4. Abra um Pull Request

## 📄 Licença

Este projeto faz parte de um desafio técnico e é fornecido como está.

---

**Desenvolvido com ❤️ usando Next.js e TypeScript**
