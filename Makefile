SHELL := /usr/bin/env bash
PYTHON_VERSION := $(shell cat .python-version)

.PHONY: check_docker build authenticate_to_artifactory push_image prep_version_incrementor clean help compose
.DEFAULT_GOAL := help

#build: prep_version_incrementor ## Build the docker image
build:
	@echo '********** Building docker image ************'
	@cp -r app docker/files/
	@rm docker/files/app/package-lock.json
#	@pipenv run prepare-release
#	@umask 0022
#	@docker build --no-cache --tag artefacts.tax.service.gov.uk/accessibility-assessment:$$(cat .version) docker

authenticate_to_artifactory:
	@docker login --username ${ARTIFACTORY_USERNAME} --password "${ARTIFACTORY_PASSWORD}"  artefacts.tax.service.gov.uk

push_image: ## Push the fluentbit docker image to artifactory
	@docker push artefacts.tax.service.gov.uk/accessibility-assessment:$$(cat .version)
	@pipenv run cut-release

prep_version_incrementor:
	@echo "Renaming requirements to prevent pipenv trying to convert it"
	@echo "Installing version-incrementor with pipenv"
	@pip install pipenv --upgrade
	@pipenv --python $(PYTHON_VERSION)
	@pipenv run pip install -i https://artefacts.tax.service.gov.uk/artifactory/api/pypi/pips/simple version-incrementor==0.2.0

clean: ## Remove the fluentbit docker image
	@echo '********** Cleaning up ************'
	@docker rmi -f $$(docker images artefacts.tax.service.gov.uk/accessibility-assessment:$$(cat .version) -q)

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
