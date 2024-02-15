FROM nginx:1.19.0
COPY build/ /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY .conf/nginx.conf /etc/nginx/conf.d

EXPOSE 80