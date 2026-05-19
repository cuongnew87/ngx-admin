# ===== Build Angular =====
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build -- --configuration production


# ===== Nginx =====
FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY nginx.conf /etc/nginx/conf.d/default.conf

# đổi tên app Angular của bạn
COPY --from=build /app/dist/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
