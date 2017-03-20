FULL_PATH=`realpath ${BASH_SOURCE[0]}`
HUFFINGTON_DIR="$(dirname "$FULL_PATH")"
SCRIPTS_DIR="$(dirname "$HUFFINGTON_DIR")"
ROOT_DIR="$(dirname "$SCRIPTS_DIR")"

# Fetch Huffington Post
python3 "$HUFFINGTON_DIR/fetch.py"

# Build and restart
cd "$ROOT_DIR"
node --max_semi_space_size=1 --max_old_space_size=650 --max_executable_size=150 /usr/bin/npm run build -- --release
pm2 restart all
