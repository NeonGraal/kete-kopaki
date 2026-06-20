FROM node:22-alpine
WORKDIR /workspace/src/frontend

COPY src/frontend/package*.json ./
RUN npm install

COPY src/frontend/ ./

EXPOSE 19006
CMD ["sh", "-c", "npm run build:web && npm run serve:web"]
