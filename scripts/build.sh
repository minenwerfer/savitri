#!/bin/sh

BUILD_COMPONENTS=

npm run build && \
  [ ! -z $BUILD_COMPONENTS ] && (cd frontend && npm run build)
