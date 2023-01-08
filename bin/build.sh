#!/bin/bash

COMMAND=$(expr "$1" \| "")
BUILD_COMPONENTS=

PACKAGES=(
  ui
  web
)

function do_pack() {
  cp {tsconfig.json,packages/web/global.d.ts} dist/web
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

tsc || true && \
  [ ! -z $BUILD_COMPONENTS ] && (cd web && npm run build)

case "$COMMAND" in
  pack)
    do_pack
  ;;
esac
