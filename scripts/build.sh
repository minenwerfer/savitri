#!/bin/sh

BUILD_COMPONENTS=

npm run build && \
  cp -r packages/backend/src/resources/* dist/backend/src/resources && \
  cp packages/backend/RELEASE.yml dist/backend/ 2>/dev/null && \
  [ ! -z $BUILD_COMPONENTS ] && (cd frontend && npm run build)
