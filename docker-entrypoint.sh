#!/bin/sh
# Generate __env.js at container startup (MWIT-LINK Pattern)
cat <<EOF > ./public/__env.js
window.__ENV__ = {
  NEXT_PUBLIC_API_BASE_URL: "${NEXT_PUBLIC_API_BASE_URL:-/api}",
  PROMPTPAY_ID: "${PROMPTPAY_ID:-0812345678}"
};
EOF

# Start Next.js
bun run start
