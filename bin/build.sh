#!/bin/sh

BUILD_COMPONENTS=

[ ! -d './dist/data/presets' ] && mkdir -p dist/data/presets

npm run build && \
  cp -r packages/backend/src/resources/* dist/backend/src/resources && \
  cp -r packages/data/presets/* dist/data/presets && \
  cp packages/backend/RELEASE.yml dist/backend/ 2>/dev/null && \
  [ ! -z $BUILD_COMPONENTS ] && (cd frontend && npm run build)
