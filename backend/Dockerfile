FROM node:24-alpine AS builder
# trabajamos en /app dentro del contenedor
WORKDIR /app 

# copiamos archivos de configuración
COPY package*.json tsconfig.json ./ 

# instalamos dependencias desde el package-lock.json
RUN npm ci 

# copiamos el src local al contenedor /app/src
COPY src ./src
# traspilamos los archivos .ts a .js dentro del contenedor
RUN npm run build

FROM node:24-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD [ "node","dist/server.js" ]