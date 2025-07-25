### Dockerfile for Sanderfest Server
# YOU SHOULD NOT HAVE TO EDIT THIS FILE
# If you feel something is missing, please open an issue on GitHub
# or contact Sander (server owner: +31618617731) or Sander (server admin: +31683238115)

FROM node:alpine
LABEL maintainer="Sander, Sander, and Sander"

# Install system monitoring tools
RUN apk add --no-cache \
    btop \
    htop \
    procps \
    coreutils \
    util-linux

# Try to install btop if available, fallback to htop
RUN apk add --no-cache btop || echo "btop not available, using htop as fallback"

WORKDIR /app
COPY package.json .
RUN npm install --production
COPY . .
EXPOSE 3000
ADD --chown=sanderdev:sanderdev . /app
VOLUME ["/app"]
CMD ["npm", "start"]
# Add curl for health checks
RUN apk add --no-cache curl

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD top -n 1 | grep "node ./bin/www" || exit 1 \
  CMD curl -f http://localhost:3000/health || exit 1