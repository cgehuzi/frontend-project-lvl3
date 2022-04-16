install:
	npm ci

dev:
	rm -rf dist
	npx webpack-dev-server --open

build:
	rm -rf dist
	NODE_ENV=production npx webpack

lint:
	npx eslint .

test:
	npx jest