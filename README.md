<h1 align="center" id="title">API de Controle de Acessos</h1>

<p align="center"><img src="https://socialify.git.ci/ericolivrib/irrigation-management-api/image?language=1&amp;name=1&amp;owner=1&amp;pattern=Circuit+Board&amp;theme=Auto" alt="project-image"></p>

<p id="description">Projeto focado no desenvolvimento de uma API REST que permite conceder e revogar permissões de acessos aos endpoints da API.</p>

  
  
<h2>🧐 Funcionalidades</h2>

Here're some of the project's best features:

*   Autenticação e autorização com JWT
*   Containerização com Docker
*   Validação de dados de requisição com Zod
*   Manipulador global de exceções com retorno de códigos de status HTTP
*   Verificação de permissões para o acesso de endpoints da API

<h2>🛠️ Como executar o projeto:</h2>

<p>1. Construa a imagem Docker do diretório raiz</p>

```
docker build -t access-control-api .
```

<p>2. Execute o container Docker da imagem construída</p>

```
docker run -p 3000:3000 -d access-control-api:latest
```

<p>3. A aplicação irá iniciar na URL abaixo</p>

```
http://localhost:3000
```



<h2>📃 Documentação</h2>

A documentação dos endpoints está em desenvolvimento e em breve estará disponível
  
  
<h2>💻 Tecnologias</h2>

Tecnologias utilizadas para desenvolver o projeto:

*   Node.js
*   Express
*   TypeScript
*   JWT
*   Sequelize
*   SQLite
*   Zod
*   Pino Logger
*   Swagger (em andamento)
*   Docker