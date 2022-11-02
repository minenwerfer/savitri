#!/bin/bash

COMMAND=$(expr "$1" \| "")
BUILD_COMPONENTS=

PACKAGES=(
  api
  common
  ui
  web
  system
)

tsc || true && \
  cp -r packages/api/resources/* dist/api/resources && \
  cp -r packages/api/presets dist/api && \
  cp packages/api/RELEASE.yml dist/api/ 2>/dev/null && \
  [ ! -z $BUILD_COMPONENTS ] && (cd web && npm run build)

[ "$COMMAND" == "pack" ] && {
  cp tsconfig.json dist/web
  cp -r packages/web/public dist/web

  for package in ${PACKAGES[*]}; do
    cp "packages/${package}/package.json" "dist/${package}/package.json"
  done

  for component in $(find packages/ui -type f -not -path \*node_modules\*); do
    new_path=$(echo -n "$component" | sed -r 's/^packages/dist/')
    directory=$(echo -n "$new_path" | sed -r 's/\/([^\.\/]+)\.(\w+)$//')

    mkdir -p "$directory"
    cp "$component" "$new_path"
  done
}

