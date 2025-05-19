SHELL := /bin/zsh
.ONESHELL:

.PHONY: run down localstack terraform

run-all:
	$(MAKE) down
	$(MAKE) localstack
	$(MAKE) terraform
	$(MAKE) build
	$(MAKE) load-all

run-no-apps:
	$(MAKE) down
	$(MAKE) localstack
	$(MAKE) terraform
	$(MAKE) load-infra

run-no-terraform:
	$(MAKE) down
	$(MAKE) localstack
	$(MAKE) load-infra

down:
	docker compose down -v --remove-orphans

localstack:
	docker compose up -d --build localstack

terraform:
	terraform -chdir=terraform init -backend=false
	env -u AWS_PROFILE AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test terraform -chdir=terraform apply -var-file=local.tfvars -auto-approve

build:
	docker rmi videomatt-app-users:latest || true
	docker rmi videomatt-app-videos:latest || true
	docker compose build app-users app-videos

load-all:
	docker compose up

load-infra:
	docker compose up \
		localstack \
		redis \
		db-users-shard-1 \
		db-users-shard-2 \
		db-videos \
		db-videos-replica \
		db-mongo-config-server \
		db-mongo-shard-1 \
		db-mongo-shard-2 \
		db-video-comments-router \
		db-video-comments-router-init
