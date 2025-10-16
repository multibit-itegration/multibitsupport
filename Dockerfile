# Этап 1: Сборка приложения Angular
FROM node:18-alpine as build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json (или yarn.lock)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Собираем приложение для продакшена
# outputPath в angular.json должен быть "dist/multisupport"
RUN npm run build

# Этап 2: Настройка и запуск Nginx
FROM nginx:alpine

# Копируем собранное приложение из этапа 'build'
COPY --from=build /app/dist/task-rating-frontend/ /usr/share/nginx/html

# Копируем кастомную конфигурацию Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
