SHELL := /bin/zsh
.ONESHELL:

.PHONY: run
run:
	docker-compose down -v --remove-orphans && \
	docker-compose up -d localstack && \
	terraform -chdir=terraform init -backend=false && \
	env -u AWS_PROFILE AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test terraform -chdir=terraform apply -var-file=local.tfvars -auto-approve && \
	docker-compose up --no-recreate
