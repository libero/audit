
IMAGE_TAG ?= "local"

DOCKER_COMPOSE = IMAGE_TAG=${IMAGE_TAG} docker-compose -f docker-compose.build.yml

DOCKER_COMPOSE_TEST = docker-compose -f docker-compose.test.yml

PUSH_COMMAND = IMAGE_TAG=${IMAGE_TAG} .scripts/travis/push-image.sh

get_deps:
	yarn

lint: get_deps
	yarn lint

test: get_deps
	yarn test

test_integration:
	- ${DOCKER_COMPOSE_TEST} down -v
	${DOCKER_COMPOSE_TEST} up -d postgres
	yarn run migrate run
	yarn run test:integration
	${DOCKER_COMPOSE_TEST} down -v
	
build:
	${DOCKER_COMPOSE} build audit 

push:
	${PUSH_COMMAND} audit
