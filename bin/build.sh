#!/bin/bash

COMMAND=$(expr "$1" \| "")
BUILD_COMPONENTS=1

PACKAGES=(
  ui
  web
)

function do_pack() {
  cp {tsconfig.json,packages/web/global.d.ts} dist/web

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

tsc
if [ ! -z $BUILD_COMPONENTS ]; then
  cp -r packages/ui/scss dist/ui
  # (cd packages/web && npm run build)
fi

case "$COMMAND" in
  pack)
    do_pack
  ;;
esac
