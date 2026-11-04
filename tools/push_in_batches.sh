#!/usr/bin/env bash
# Отправляет большие файлы библиотеки на GitHub частями: один огромный push сервер отклоняет.
# Каталог (library/index.json) и код сайта уходят последними, чтобы сайт не ссылался на ещё не загруженные файлы.
set -uo pipefail
cd "$(dirname "$0")/.."
msg_tail="Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"

push() { # повторяем при сбое сервера
  for try in 1 2 3 4; do
    if git push -q; then return 0; fi
    echo "push failed, retry $try"; sleep $((try * 20))
  done
  return 1
}
batch() { # $1 — описание, остальное — пути
  local title="$1"; shift
  git add -A -- "$@"
  if git diff --cached --quiet; then echo "skip: $title"; return 0; fi
  git commit -q -m "Библиотека: $title" -m "$msg_tail" && push && echo "ok: $title"
}

batch "русские книги" 'library/books-ru' 'library/covers/ru-*' || exit 1
batch "Pepper&Carrot" 'library/manga/peppercarrot-*' 'library/covers/peppercarrot-*' || exit 1
batch "Манга Хокусая" 'library/manga/hokusai-*' 'library/covers/hokusai-*' || exit 1
batch "английские книги A–H" 'library/books-en/[a-h]*' || exit 1
batch "английские книги I–Q" 'library/books-en/[i-q]*' || exit 1
batch "английские книги R–Z" 'library/books-en' || exit 1
batch "обложки английских книг" 'library/covers' || exit 1
batch "каталог и код сайта" '.' || exit 1
echo DONE
