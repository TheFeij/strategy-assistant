.PHONY: help install dev build build-single preview clean

help:
	@echo "Available targets:"
	@echo "  make install      Install dependencies with npm ci"
	@echo "  make dev          Start the Vite dev server (http://localhost:5173)"
	@echo "  make build        Create a normal production build in dist/"
	@echo "  make build-single Create one self-contained dist/index.html"
	@echo "  make preview      Preview the production build"
	@echo "  make clean        Remove build output"

install:
	npm ci

dev:
	npm run dev

build:
	npm run build

build-single:
	npm run build:single

preview:
	npm run preview

clean:
	rm -rf dist
