ARG image_tag=latest

FROM node:12-alpine@sha256:5646d1e5bc470500414feb3540186c02845db0e0e1788621c271fbf3a0c1830d as source
MAINTAINER eLife Reviewer Product Team <reviewer-product@elifesciences.org>

WORKDIR /app

COPY  tsconfig.build.json \
      tsconfig.json \
      .eslintrc.js \
      .eslintignore \
      .prettierrc.js \
      jest.config.js \
      package.json \
      yarn.lock \
      ./

COPY src/ ./src/
COPY tests/config.json ./tests/config.json
RUN yarn &&\
    yarn build

FROM node:12-alpine@sha256:5646d1e5bc470500414feb3540186c02845db0e0e1788621c271fbf3a0c1830d
MAINTAINER eLife Reviewer Product Team <reviewer-product@elifesciences.org>

WORKDIR /app

COPY --from=source /app/node_modules/ ./node_modules/
COPY --from=source /app/dist/ ./dist/
COPY --from=source /app/tests/config.json ./tests/config.json

RUN apk add curl

EXPOSE 3004

HEALTHCHECK --interval=1m --timeout=1s \
	CMD curl -f http://localhost:3004/health || exit 1

CMD ["node", "dist/main.js"]
