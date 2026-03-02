# ─────────────────────────────────────────────────────────────
# VendSwipe NG — Docker Container
# Serves the PWA via Nginx on port 80
#
# BUILD:
#   docker build -t vendswipe-ng .
#
# RUN:
#   docker run -p 8080:80 vendswipe-ng
#   Then open → http://localhost:8080
#
# RUN (detached / background):
#   docker run -d -p 8080:80 --name vendswipe vendswipe-ng
#
# STOP:
#   docker stop vendswipe
#
# DEPLOY to any cloud (Railway, Fly.io, Render, DigitalOcean):
#   Push this folder to GitHub → connect repo → done.
# ─────────────────────────────────────────────────────────────

# Use lightweight Nginx Alpine image (~5 MB)
FROM nginx:alpine

# Remove default Nginx placeholder page
RUN rm -rf /usr/share/nginx/html/*

# Copy the VendSwipe PWA into the web root
COPY index.html /usr/share/nginx/html/index.html

# Copy custom Nginx config for PWA routing + performance headers
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Nginx runs in foreground (required for Docker)
CMD ["nginx", "-g", "daemon off;"]
