FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:alpine as production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


# Этап сборки
# FROM node:18 AS builder

# WORKDIR /app  

# COPY package.json package-lock.json ./

# # Устанавливаем зависимости
# # RUN npm ci
# # Чистим кеш и переустанавливаем зависимости
# RUN npm cache clean --force && \
#     rm -rf node_modules && \
#     npm install --legacy-peer-deps

# # Копируем остальные файлы проекта
# COPY . .

# # Собираем приложение
# RUN npm run build

# # Этап запуска
# FROM nginx:alpine

# # Копируем собранные файлы из builder в nginx
# # COPY --from=builder /app/dist /usr/share/nginx/html
# COPY --from=builder /app/dist /usr/share/nginx/html

# COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# # Открываем порт 80
# EXPOSE 80

# # Запускаем nginx
# CMD ["nginx", "-g", "daemon off;"]