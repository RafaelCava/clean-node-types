#!/bin/bash

yarn install --silent

yarn husky install

yarn build

yarn debug
