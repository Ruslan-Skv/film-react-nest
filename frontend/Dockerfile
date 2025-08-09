# Этап сборки
FROM node:alpine AS builder

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package.json package-lock.json ./

# Устанавливаем зависимости
# RUN npm ci
# Чистим кеш и переустанавливаем зависимости
RUN npm cache clean --force && \
    rm -rf node_modules && \
    npm install --legacy-peer-deps

# Копируем остальные файлы проекта
COPY . .

# Собираем приложение
RUN npm run build

# Этап запуска
FROM nginx:alpine

# Копируем собранные файлы из builder в nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Открываем порт 80
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]