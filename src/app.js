const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
const likes = [];

app.get("/repositories", (request, response) => {
  const { title } = request.params;

  const results = title
    ? repositories.filter(repository.title.includes(title))
    : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, techs } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id == id
  );
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository Not Found" });
  }

  const repository = {
    id,
    title,
    techs,
  };

  repositories[repositoryIndex] = repository;

  response.json([repository]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id == id
  );
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository Not Found" });
  }
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id == id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Erro No Like" });
  }

  const title = repositories[repositoryIndex].title;
  const techs = repositories[repositoryIndex].techs;
  const likes = repositories[repositoryIndex].likes + 1;

  const repository = {
    id,
    title,
    techs,
    likes,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

module.exports = app;
