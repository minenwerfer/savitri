#!/bin/bash

BUILD_COMPONENTS=

shopt -s extglob

npm run build && \
  cp -r packages/backend/core/resources/* dist/backend/core/resources && \
  cp -r packages/backend/presets dist/backend/presets && \
  cp -r packages/frontend/i18n dist/frontend/i18n && \
  cp packages/backend/RELEASE.yml dist/backend/ 2>/dev/null && \
  [ ! -z $BUILD_COMPONENTS ] && (cd frontend && npm run build)
