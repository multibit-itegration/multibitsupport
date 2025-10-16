# Используем официальный Node.js образ для сборки Angular
FROM node:18 AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm install --legacy-peer-deps

# Копируем весь проект в контейнер
COPY . .

# Собираем приложение
RUN npm run build --prod

# Этап 2: Запуск через Nginx
FROM nginx:alpine

# Копируем собранное приложение в Nginx
COPY --from=build /app/dist/ya-map /usr/share/nginx/html

# Копируем файл конфигурации Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]