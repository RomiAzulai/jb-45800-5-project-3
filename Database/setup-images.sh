#!/bin/bash
# Setup placeholder vacation images for seed data

UPLOADS_DIR="$(dirname "$0")/../Backend/uploads"
mkdir -p "$UPLOADS_DIR"

IMAGES=(
  "paris.jpg" "rome.jpg" "barcelona.jpg" "tokyo.jpg" "newyork.jpg"
  "london.jpg" "amsterdam.jpg" "dubai.jpg" "bali.jpg" "sydney.jpg"
  "prague.jpg" "santorini.jpg" "cancun.jpg" "iceland.jpg"
)

for img in "${IMAGES[@]}"; do
  if [ ! -f "$UPLOADS_DIR/$img" ]; then
    cp "$UPLOADS_DIR/placeholder.jpg" "$UPLOADS_DIR/$img" 2>/dev/null || \
    curl -sL "https://picsum.photos/seed/${img%.jpg}/400/300" -o "$UPLOADS_DIR/$img" 2>/dev/null || \
    echo "placeholder" > "$UPLOADS_DIR/$img"
  fi
done

echo "Vacation images setup complete in $UPLOADS_DIR"
