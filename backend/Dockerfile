# Этап сборки
FROM node:alpine AS builder

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем остальные файлы проекта
COPY . .

# Собираем приложение
RUN npm run build

# Этап запуска
FROM node:alpine

WORKDIR /app

# Копируем package.json и package-lock.json для production зависимостей
COPY --from=builder /app/package.json /app/package-lock.json ./

# Устанавливаем только production зависимости
RUN npm ci --only=production

# Копируем собранные файлы из builder
COPY --from=builder /app/dist ./dist

# Открываем порт
EXPOSE 3000

# Запускаем приложение
# CMD ["node", "dist/main"]
CMD ["node", "dist/main", "--host", "0.0.0.0"]