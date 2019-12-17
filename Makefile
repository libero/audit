
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
	${DOCKER_COMPOSE_TEST} up -d postgres rabbitmq
	./.scripts/docker/wait-healthy.sh audit_postgres_1 60
	./.scripts/docker/wait-healthy.sh audit_rabbitmq_1 60
	${DOCKER_COMPOSE_TEST} up -d audit
	./.scripts/docker/wait-healthy.sh audit_audit_1 60
	CONFIG_PATH=./tests/config.json yarn test:integration
	${DOCKER_COMPOSE_TEST} down -v
	
build:
	${DOCKER_COMPOSE} build audit 

push:
	${PUSH_COMMAND} audit
