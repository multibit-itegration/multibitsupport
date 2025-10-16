# Простой образ на базе Nginx: ожидается, что сборка Angular
# уже находится в каталоге browser/ в контексте сборки.
FROM nginx:alpine

# Копируем собранное приложение (относительный путь от build context)
# Важно: использовать ./browser или browser/ (не абсолютный путь)
COPY ./dist/multisupport/ /usr/share/nginx/html/

# Копируем наш nginx.conf (при желании можно использовать conf.d)
COPY nginx.conf /etc/nginx/nginx.conf

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx в foreground
CMD ["nginx", "-g", "daemon off;"]
