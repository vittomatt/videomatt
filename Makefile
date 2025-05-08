SHELL := /bin/zsh
.ONESHELL:

.PHONY: run down localstack terraform

run:
	$(MAKE) down
	$(MAKE) localstack
	$(MAKE) terraform
	docker-compose up --build --no-recreate

down:
	docker-compose down -v --remove-orphans

localstack:
	docker-compose up -d --build localstack

terraform:
	terraform -chdir=terraform init -backend=false
	env -u AWS_PROFILE AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test terraform -chdir=terraform apply -var-file=local.tfvars -auto-approve