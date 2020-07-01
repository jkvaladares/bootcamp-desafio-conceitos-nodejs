const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next) {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid ID" });
  }
  return next();
}

app.use("/repositories/:id", validateRepositoryId);

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
  const { title, url, techs } = request.body;
  const { likes } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id == id
  );
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository Not Found" });
  }

  if (likes >= 0) {
    return response.json({ likes: 0 });
  }

  const repository = {
    id,
    title,
    url,
    techs,
  };

  repositories[repositoryIndex] = repository;

  response.json(repository);
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
  const { like } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id == id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Erro No Like" });
  }

  const url = repositories[repositoryIndex].url;
  const title = repositories[repositoryIndex].title;
  const techs = repositories[repositoryIndex].techs;
  const likes = like
    ? repositories[repositoryIndex].likes + parseInt(like)
    : repositories[repositoryIndex].likes + 1;
  const repository = {
    id,
    title,
    techs,
    likes,
  };

  repositories[repositoryIndex] = repository;

  return response.json({ likes: repository.likes });
});

module.exports = app;
