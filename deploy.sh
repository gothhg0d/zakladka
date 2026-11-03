#!/usr/bin/env bash
# Выкладка на GitHub Pages: ставит свежую версию в ссылки на файлы (сброс кэша браузера), коммитит и отправляет.
# Использование: ./deploy.sh "Что изменилось"
set -euo pipefail
cd "$(dirname "$0")"
v=$(date +%s)
sed -i -E "s/(href=\"fonts\/liberation-serif\.css|src=\"hero3d\.js|src=\"app\.js)(\?v=[0-9]+)?\"/\1?v=$v\"/g" index.html
git add -A
git commit -q -m "${1:-Обновление сайта}" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push -q
echo "Отправлено, версия $v"
