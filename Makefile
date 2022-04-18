install:
	npm ci

dev:
	npx webpack-dev-server --open

build:
	rm -rf dist
	NODE_ENV=production npx webpack

lint:
	npx eslint .

test:
	npx jest