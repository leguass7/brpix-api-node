#!/bin/bash
git checkout develop
git add .
git commit -m "ci(develop): commit automatized" --no-verify
git push origin develop

git checkout build

rm -rf ./dist/*

git add .
git commit -m "ci(build): commit automatized, delete builds" --no-verify

git checkout develop

rm -rf ./dist/*

yarn build

git checkout build

git fetch --all

git add ./dist

git checkout origin/develop -- ./package.json ./yarn.lock
git add ./package.json ./yarn.lock

yarn standard-version --prerelease test
git add ./package.json ./yarn.lock

git commit -m "ci(build): deploy" --no-verify

git push origin build
