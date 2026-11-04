"""Проверяет файлы библиотеки: каждый EPUB/CBZ открывается, внутри есть текст или страницы,
и у каждого файла есть запись в каталоге. Битые файлы и сироты перечисляет; с ключом --fix убирает их.
Запуск из корня репозитория:  python tools/check_library.py [--fix]
"""
import glob
import json
import os
import sys
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)


def ok_archive(path):
    with zipfile.ZipFile(path) as z:
        names = z.namelist()
        if path.endswith('.epub'):
            good = any(n.endswith('.opf') for n in names) and any(n.lower().endswith(('.xhtml', '.html', '.htm')) for n in names)
        else:
            good = any(n.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')) for n in names)
        return good and z.testzip() is None


def main():
    fix = '--fix' in sys.argv
    files = [f.replace(os.sep, '/') for f in glob.glob('library/books-*/*.epub') + glob.glob('library/manga/*.cbz')]
    bad = []
    for f in files:
        try:
            if not ok_archive(f):
                bad.append(f)
        except Exception:
            bad.append(f)
    listed = set()
    for p in glob.glob('library/index-*.json'):
        with open(p, encoding='utf-8') as fh:
            for it in json.load(fh):
                listed.add(it.get('file'))
    orphans = [f for f in files if f not in listed]
    print(f'файлов: {len(files)}, битых: {len(bad)}, без записи в каталоге: {len(orphans)}')
    for f in bad[:20]:
        print('  битый:', f)
    for f in orphans[:20]:
        print('  сирота:', f)
    if fix:
        for f in set(bad) | set(orphans):
            os.remove(f)
        print('удалено:', len(set(bad) | set(orphans)))
    return 0


if __name__ == '__main__':
    sys.exit(main())
