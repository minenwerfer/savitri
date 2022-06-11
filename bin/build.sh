#!/bin/bash

COMMAND=$(expr "$1" \| "")
BUILD_COMPONENTS=

PACKAGES=(
  "frontend"
  "backend"
  "common"
  "components"
)

npm run build && \
  cp -r packages/backend/resources/* dist/backend/resources && \
  cp -r packages/backend/presets dist/backend && \
  cp -r packages/frontend/i18n dist/frontend && \
  cp -r packages/components/components/assets dist/components/components && \
  cp packages/backend/RELEASE.yml dist/backend/ 2>/dev/null && \
  [ ! -z $BUILD_COMPONENTS ] && (cd frontend && npm run build)

[ "$COMMAND" == "pack" ] && {
  cp tsconfig.json dist/frontend
  cp packages/frontend/tailwind.config.js dist/frontend
  cp -r packages/frontend/public dist/frontend

  for package in ${PACKAGES[*]}; do
    cp "packages/${package}/package.json" "dist/${package}/package.json"
  done

  for component in $(find packages/components -name \*\.vue); do
    new_path=$(echo -n "$component" | sed -r 's/^packages/dist/')
    directory=$(echo -n "$new_path" | sed -r 's/\/([^\.\/]+)\.vue$//')

    mkdir -p "$directory"
    cp "$component" "$new_path"
  done
}

