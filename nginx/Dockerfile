# Финальный образ Nginx
FROM nginx:alpine
# Удаляем дефолтный конфиг
RUN rm -f /etc/nginx/conf.d/default.conf
# Копируем наш конфиг
# COPY nginx/nginx.conf /etc/nginx/conf.d/
COPY nginx.conf /etc/nginx/conf.d/
# Копируем собранный фронтенд
# COPY --from=frontend-builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]



# Используем официальный легковесный образ nginx на базе Alpine Linux
# FROM nginx:alpine

# # Удаляем дефолтный конфигурационный файл nginx, который идет с базовым образом
# # Это нужно, чтобы он не конфликтовал с нашей кастомной конфигурацией
# RUN rm -f /etc/nginx/conf.d/default.conf

# # Копируем наш подготовленный конфигурационный файл nginx
# # из локальной директории в контейнер (в директорию, где nginx ищет конфиги)
# # ВАЖНО: Файл nginx.conf должен находиться в той же папке, что и Dockerfile
# COPY nginx.conf /etc/nginx/conf.d/ 
# # COPY nginx.conf /etc/nginx/conf.d/default.conf  
# # COPY --from=builder /app/dist /usr/share/nginx/html

# # Открываем 80 порт контейнера для внешних подключений
# # Это стандартный порт для HTTP-трафика
# # Примечание: EXPOSE не делает порт доступным снаружи автоматически,
# # для этого нужно использовать флаг -p при запуске контейнера
# EXPOSE 80

# # Запускаем nginx в foreground режиме (не как демон)
# # Флаг -g "daemon off;" предотвращает переход nginx в фоновый режим,
# # что необходимо для корректной работы в Docker-контейнере
# # Без этого флага контейнер сразу завершит работу после старта
# CMD ["nginx", "-g", "daemon off;"]