#!/bin/bash

COMMAND=$(expr "$1" \| "")
BUILD_COMPONENTS=

PACKAGES=(
  "web"
  "api"
  "common"
  "components"
)

npm run build || true && \
  cp -r packages/api/resources/* dist/api/resources && \
  cp -r packages/api/presets dist/api && \
  cp -r packages/components/assets dist/components && \
  cp packages/api/RELEASE.yml dist/api/ 2>/dev/null && \
  [ ! -z $BUILD_COMPONENTS ] && (cd web && npm run build)

[ "$COMMAND" == "pack" ] && {
  cp tsconfig.json dist/web
  cp packages/web/tailwind.config.js dist/web
  cp -r packages/web/public dist/web

  for package in ${PACKAGES[*]}; do
    cp "packages/${package}/package.json" "dist/${package}/package.json"
  done

  for component in $(find packages/components -type f); do
    new_path=$(echo -n "$component" | sed -r 's/^packages/dist/')
    directory=$(echo -n "$new_path" | sed -r 's/\/([^\.\/]+)\.(\w+)$//')

    mkdir -p "$directory"
    cp "$component" "$new_path"
  done
}

