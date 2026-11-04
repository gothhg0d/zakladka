"""Собирает library/index.json из частей library/index-*.json и library/CREDITS.md из CREDITS-*.md.

Проверяет, что у каждой записи есть файл и обложка, выкидывает дубликаты и битые записи.
Запуск из корня репозитория:  python tools/build_library_index.py
"""
import glob
import json
import re
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIB = os.path.join(ROOT, 'library')
LIMIT = 95 * 1024 * 1024  # GitHub не принимает файлы больше 100 МБ


def main():
    items, seen, dropped = [], set(), []
    for part in sorted(glob.glob(os.path.join(LIB, 'index-*.json'))):
        with open(part, encoding='utf-8') as f:
            data = json.load(f)
        for it in data if isinstance(data, list) else data.get('items', []):
            path = os.path.join(ROOT, it.get('file', ''))
            if not it.get('id') or it['id'] in seen:
                dropped.append((it.get('id'), 'дубликат или без id'))
                continue
            if not os.path.isfile(path):
                dropped.append((it['id'], 'нет файла'))
                continue
            size = os.path.getsize(path)
            if size > LIMIT:
                dropped.append((it['id'], 'файл больше 95 МБ'))
                continue
            it['size'] = size
            # пометки из библиотечных каталогов (MARC «$b») и «автор …» из экспорта Викитеки
            for k in ('title', 'author'):
                if it.get(k):
                    v = it[k].replace(' : $b ', ': ').replace('$b ', '').replace('$b', '')
                    v = re.sub(r'^(автор|author)\s+', '', v, flags=re.I)
                    it[k] = re.sub(r'\s+', ' ', v).strip(' :;,/')
            if it.get('cover') and not os.path.isfile(os.path.join(ROOT, it['cover'])):
                it['cover'] = ''
            seen.add(it['id'])
            items.append(it)

    order = {'manga': 0, 'comic': 1, 'book': 2}
    items.sort(key=lambda i: (order.get(i.get('kind'), 3), i.get('lang') or '', i.get('series') or '', i.get('volume') or 0, i.get('author') or '', i.get('title') or ''))
    with open(os.path.join(LIB, 'index.json'), 'w', encoding='utf-8') as f:
        json.dump({'version': 1, 'items': items}, f, ensure_ascii=False, separators=(',', ':'))

    credits = ['# Библиотека Zakladka: источники и лицензии\n',
               'Все материалы библиотеки находятся в общественном достоянии или распространяются по свободным лицензиям. Ниже — авторы, переводчики и источники.\n']
    for part in sorted(glob.glob(os.path.join(LIB, 'CREDITS-*.md'))):
        with open(part, encoding='utf-8') as f:
            credits.append(f.read().strip() + '\n')
    with open(os.path.join(LIB, 'CREDITS.md'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(credits))

    total = sum(i['size'] for i in items)
    kinds = {}
    for i in items:
        kinds[(i.get('kind'), i.get('lang'))] = kinds.get((i.get('kind'), i.get('lang')), 0) + 1
    print(f'записей: {len(items)}, объём: {total / 1048576:.0f} МБ')
    for k, n in sorted(kinds.items()):
        print(f'  {k[0]}/{k[1]}: {n}')
    if dropped:
        print(f'отброшено: {len(dropped)}')
        for d in dropped[:20]:
            print('  ', d)
    return 0


if __name__ == '__main__':
    sys.exit(main())
