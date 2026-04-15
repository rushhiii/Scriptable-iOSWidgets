#!/bin/bash

set -o errexit
set -o pipefail

# Copy the assets
gitbook-icons ./public/~gitbook/static/icons custom-icons
gitbook-math ./public/~gitbook/static/math

# Turborepo remote cache can replay logs without materializing this output folder.
if [[ ! -d ../embed/standalone ]]; then
	echo "Embed standalone bundle missing, building it now"
	(cd ../embed && bun run build-standalone)
fi

cp -r ../embed/standalone/ ./public/~gitbook/static/embed

# Generate the types
if [[ -n "${VERCEL:-}" ]]; then
	echo "Skipping wrangler types on Vercel build"
else
	wrangler types
fi
