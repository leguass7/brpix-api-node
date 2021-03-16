#!/bin/bash
git checkout develop
git add .
git commit -m "ci(develop): commit automatized" --no-verify
git push

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

git checkout origin/develop -- ./package.json
git add ./package.json

git checkout origin/develop -- ./yarn.lock
git add ./yarn.lock

git commit -m "ci(build): deploy" --no-verify


git push origin build
