# copy build artifacts and set the entrypoint
FROM nginx:alpine
COPY dist /usr/share/nginx/html
EXPOSE 80