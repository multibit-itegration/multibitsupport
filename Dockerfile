# Этап 2: Запуск через Nginx
FROM nginx:alpine AS build

# Копируем собранное приложение в Nginx
COPY  /browser /usr/share/nginx/html

# Копируем файл конфигурации Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]