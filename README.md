# fake-ecommerce-app
![Status](https://img.shields.io/badge/Status-In%20Progress-yellow?style=for-the-badge)

REST API de un app e-commerce falso. Proyecto Universitario 2026-01 UPC

## Stack
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## Features
- Autenticación de usuario con JWT
- API CRUD

## Cómo ejecutar la aplicación

1.- Clonar repo
```bash
git clone https://github.com/lonybreux/fake-ecommerce-app.git
cd fake-ecommerce-app/backend
```

2.- Copiar variables de entorno de `.env.example` a `.env`
```bash
cp .env.example .env
```

3.- Levantar contenedores, API por defecto: `http://localhost:3000`
```bash
docker compose up -d --build
```

## Variables de entorno

| *Variable* | *descripción* | *ejemplo* |
|---|---|---|
| PORT | Puerto en donde corre la API | 3000 |
| CLIENT_URL | URL Permitida para obtener datos de la API (CORS Policy) | http://127.0.0.1:5500 |
| MONGODB_URI | URI para conexión a mongoDB | mongodb://db:27017/tu_db |
| JWT_SECRET | Llave secreta para firmar tokens | secret123 |

## Importante
- **Puertos ya en uso**: si alguno de los puertos que utilizará para los contenedores están ocupados por otros servicios, debe liberarlos. Verifique con `docker ps`
- **Cambios en .env**: las variables se inyectan al crear el contenedor, no en desarrollo. Correr `docker compose down` luego `docker compose up -d --build` para construir nuevamente el contenedor
- **Cambios en codigo**: si realizo algún cambio en el codigo, deberá reconstruir la imagen. Correr `docker compose down` luego `docker compose up -d --build`
