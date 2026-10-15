# docs-as-code-demo

A small REST API used to practice the full path from code to documentation:
containerize it with Docker, deploy it to a local Kubernetes cluster, describe it with
an OpenAPI spec, and document all of it in a Markdown site built with MkDocs.

<!-- TODO: Add the link to your published docs site here. -->

## Repository layout

| Path | What it contains |
| --- | --- |
| `app/` | The Node.js and Express API, its tests, and its Dockerfile |
| `k8s/` | Kubernetes Deployment and Service manifests |
| `openapi.yaml` | OpenAPI 3 description of the API |
| `docs/` | Markdown source for the documentation site |
| `mkdocs.yml` | MkDocs configuration and navigation |

## Run the API locally

```
cd app
npm install
npm start
```

Then, in another terminal:

```
curl http://localhost:8080/health
```

## Run the tests

```
cd app
npm test
```

## Build and preview the docs

```
pip install mkdocs
mkdocs serve
```

Open http://127.0.0.1:8000 to preview. To publish to GitHub Pages, run `mkdocs gh-deploy`.
