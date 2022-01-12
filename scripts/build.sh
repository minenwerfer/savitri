#!/bin/sh

BUILD_COMPONENTS=

npm run build && \
  cp -r packages/backend/src/resources/* dist/backend/src/resources && \
  [ ! -z $BUILD_COMPONENTS ] && (cd frontend && npm run build)
