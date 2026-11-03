#!/usr/bin/env bash
# Выкладка на GitHub Pages: ставит свежую версию в ссылки на файлы и в кэш service worker
# (иначе браузер и Pages отдают старые копии), коммитит и отправляет.
# Использование: ./deploy.sh "Что изменилось"
set -euo pipefail
cd "$(dirname "$0")"
v=$(date +%s)
sed -i -E "s/(href=\"fonts\/liberation-serif\.css|src=\"app\.js)(\?v=[0-9]+)?\"/\1?v=$v\"/g" index.html
sed -i -E "s/const CACHE = 'zakladka-[0-9]+';/const CACHE = 'zakladka-$v';/" sw.js
git add -A
git commit -q -m "${1:-Обновление сайта}" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push -q
echo "Отправлено, версия $v"
