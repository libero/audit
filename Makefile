
IMAGE_TAG ?= "local"

DOCKER_COMPOSE = IMAGE_TAG=${IMAGE_TAG} docker-compose -f docker-compose.build.yml

DOCKER_COMPOSE_TEST = docker-compose -f docker-compose.test.yml

get_deps:
	yarn

lint: get_deps
	yarn lint

test: get_deps
	yarn test

test_integration:
	- ${DOCKER_COMPOSE_TEST} down
	${DOCKER_COMPOSE_TEST} up -d postgres rabbitmq
	./.scripts/docker/wait-healthy.sh test_postgres 20
	./.scripts/docker/wait-healthy.sh test_rabbitmq 20
	${DOCKER_COMPOSE_TEST} up -d audit
	./.scripts/docker/wait-healthy.sh test_audit 20
	CONFIG_PATH=./tests/config.json yarn test:integration
	${DOCKER_COMPOSE_TEST} down
	
build:
	${DOCKER_COMPOSE} build audit 
