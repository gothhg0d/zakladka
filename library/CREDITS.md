# Библиотека Zakladka: источники и лицензии

Все материалы библиотеки находятся в общественном достоянии или распространяются по свободным лицензиям. Ниже — авторы, переводчики и источники.

# English books — credits and licenses

The English books in `library/books-en/` (and their covers `library/covers/en-*.jpg`)
come from two sources. The `credit`, `license` and `source` fields of each entry in
`library/index-books-en.json` say which one.

## Standard Ebooks — https://standardebooks.org

- Standard Ebooks is a volunteer-driven project that produces carefully formatted,
  proofread editions of public domain works.
- License: the source texts and cover artwork are believed to be in the **United States
  public domain**. Standard Ebooks' own contributions (formatting, editing, cover
  composition) are dedicated to the worldwide public domain under the
  **CC0 1.0 Universal Public Domain Dedication**
  (https://creativecommons.org/publicdomain/zero/1.0/).
- Users outside the United States should check their local copyright laws.
- Files: the "compatible" EPUB editions, downloaded from each book's public page.
  Covers were downscaled to 360 px wide (JPEG).
- Selection: the most popular titles on standardebooks.org at build time (November 2026).
- The per-book source page is recorded in the `source` field of `library/index-books-en.json`.

## Project Gutenberg — https://www.gutenberg.org

- Entries with `"credit": "Project Gutenberg, gutenberg.org"` were downloaded from
  Project Gutenberg (EPUB3 "with images" edition, `pg<id>-images-3.epub`; where that file was
  large (over about 1 to 2.5 MB), the smaller no-images edition `pg<id>.epub` was used to
  stay within the size budget).
  Metadata, popularity order and summaries came from Gutendex (https://gutendex.com).
- License: these works are in the **public domain in the USA**. Each file is distributed
  unmodified and includes the **Project Gutenberg License**
  (https://www.gutenberg.org/policy/license.html). "Project Gutenberg" is a registered
  trademark of the Project Gutenberg Literary Archive Foundation.
- Users outside the United States should check their local copyright laws.
- Covers are the cover images embedded in the EPUB (or PG's `pg<id>.cover.medium.jpg`),
  downscaled to 360 px wide. The `source` field links to each book's page,
  `https://www.gutenberg.org/ebooks/<id>`.
- Titles already in the Standard Ebooks set (same author and title) were skipped.
- Descriptions and years come from PG's summaries, which PG marks as
  automatically generated.

## Thanks

Thank you to the Standard Ebooks and Project Gutenberg volunteers, and to the Internet
Archive, HathiTrust and the other archives whose scans these editions build on.
If you find these books useful, consider supporting them:
https://standardebooks.org/donate and https://www.gutenberg.org/donate/

# Русская классика — источники и лицензии

Всего произведений: 400. Общий объём EPUB: 48.7 МБ.

## Лицензия

* **Тексты** — общественное достояние: все авторы умерли до 1930 года, произведения впервые опубликованы до 1930 года (общественное достояние в России и США). В подборку включены только оригинальные русскоязычные произведения, переводов нет.
* **Оформление, вычитка и разметка** — участники русской Викитеки ([ru.wikisource.org](https://ru.wikisource.org)), лицензия [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.ru). EPUB-файлы созданы инструментом [WS Export](https://ws-export.wmcloud.org/). В каждом файле есть страница «about» со списком участников Викитеки, которые работали над текстом. При распространении сохраняйте указание авторства и ту же лицензию.
* Встроенные шрифты FreeSerif удалены из файлов, чтобы уменьшить размер. Других изменений в тексте нет.
* **Обложки** (`library/covers/ru-*.jpg`) — простые типографские обложки, созданные для проекта «Закладка».

## Список произведений

### Аркадий Аверченко

* «Дети» (1910), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%94%D0%B5%D1%82%D0%B8_(%D0%90%D0%B2%D0%B5%D1%80%D1%87%D0%B5%D0%BD%D0%BA%D0%BE)>
* «Круги по воде» (1912), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D1%80%D1%83%D0%B3%D0%B8_%D0%BF%D0%BE_%D0%B2%D0%BE%D0%B4%D0%B5_(%D0%90%D0%B2%D0%B5%D1%80%D1%87%D0%B5%D0%BD%D0%BA%D0%BE)>
* «Нечистая сила» (1920), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9D%D0%B5%D1%87%D0%B8%D1%81%D1%82%D0%B0%D1%8F_%D1%81%D0%B8%D0%BB%D0%B0_(%D0%90%D0%B2%D0%B5%D1%80%D1%87%D0%B5%D0%BD%D0%BA%D0%BE)>
* «Отдых на крапиве» (1924), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9E%D1%82%D0%B4%D1%8B%D1%85_%D0%BD%D0%B0_%D0%BA%D1%80%D0%B0%D0%BF%D0%B8%D0%B2%D0%B5_(%D0%90%D0%B2%D0%B5%D1%80%D1%87%D0%B5%D0%BD%D0%BA%D0%BE)>
* «Рассказы для выздоравливающих» (1912), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%A0%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D0%B7%D1%8B_%D0%B4%D0%BB%D1%8F_%D0%B2%D1%8B%D0%B7%D0%B4%D0%BE%D1%80%D0%B0%D0%B2%D0%BB%D0%B8%D0%B2%D0%B0%D1%8E%D1%89%D0%B8%D1%85_(%D0%90%D0%B2%D0%B5%D1%80%D1%87%D0%B5%D0%BD%D0%BA%D0%BE)>
* «Смешное в страшном» (1923), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%BC%D0%B5%D1%88%D0%BD%D0%BE%D0%B5_%D0%B2_%D1%81%D1%82%D1%80%D0%B0%D1%88%D0%BD%D0%BE%D0%BC_(%D0%90%D0%B2%D0%B5%D1%80%D1%87%D0%B5%D0%BD%D0%BA%D0%BE)>

### Сергей Аксаков

* «Аленький цветочек» (1858), сказка. Источник: <https://ru.wikisource.org/wiki/%D0%90%D0%BB%D0%B5%D0%BD%D1%8C%D0%BA%D0%B8%D0%B9_%D1%86%D0%B2%D0%B5%D1%82%D0%BE%D1%87%D0%B5%D0%BA_(%D0%90%D0%BA%D1%81%D0%B0%D0%BA%D0%BE%D0%B2)>
* «Детские годы Багрова-внука» (1858), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%94%D0%B5%D1%82%D1%81%D0%BA%D0%B8%D0%B5_%D0%B3%D0%BE%D0%B4%D1%8B_%D0%91%D0%B0%D0%B3%D1%80%D0%BE%D0%B2%D0%B0-%D0%B2%D0%BD%D1%83%D0%BA%D0%B0_(%D0%A1._%D0%A2._%D0%90%D0%BA%D1%81%D0%B0%D0%BA%D0%BE%D0%B2)>
* «Семейная хроника» (1856), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%B5%D0%BC%D0%B5%D0%B9%D0%BD%D0%B0%D1%8F_%D1%85%D1%80%D0%BE%D0%BD%D0%B8%D0%BA%D0%B0_(%D0%A1._%D0%A2._%D0%90%D0%BA%D1%81%D0%B0%D0%BA%D0%BE%D0%B2)>

### Леонид Андреев

* «Ангелочек» (1899), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%90%D0%BD%D0%B3%D0%B5%D0%BB%D0%BE%D1%87%D0%B5%D0%BA_(%D0%90%D0%BD%D0%B4%D1%80%D0%B5%D0%B5%D0%B2)>
* «Баргамот и Гараська» (1898), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%91%D0%B0%D1%80%D0%B3%D0%B0%D0%BC%D0%BE%D1%82_%D0%B8_%D0%93%D0%B0%D1%80%D0%B0%D1%81%D1%8C%D0%BA%D0%B0_(%D0%90%D0%BD%D0%B4%D1%80%D0%B5%D0%B5%D0%B2)>
* «Бездна» (1902), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%91%D0%B5%D0%B7%D0%B4%D0%BD%D0%B0_(%D0%90%D0%BD%D0%B4%D1%80%D0%B5%D0%B5%D0%B2)>
* «Большой шлем» (1899), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%91%D0%BE%D0%BB%D1%8C%D1%88%D0%BE%D0%B9_%D1%88%D0%BB%D0%B5%D0%BC_(%D0%90%D0%BD%D0%B4%D1%80%D0%B5%D0%B5%D0%B2)>
* «В тумане» (1902), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%92_%D1%82%D1%83%D0%BC%D0%B0%D0%BD%D0%B5_(%D0%90%D0%BD%D0%B4%D1%80%D0%B5%D0%B5%D0%B2)>
* «Губернатор» (1905), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%93%D1%83%D0%B1%D0%B5%D1%80%D0%BD%D0%B0%D1%82%D0%BE%D1%80_(%D0%90%D0%BD%D0%B4%D1%80%D0%B5%D0%B5%D0%B2)>
* «Жизнь Василия Фивейского» (1903), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%96%D0%B8%D0%B7%D0%BD%D1%8C_%D0%92%D0%B0%D1%81%D0%B8%D0%BB%D0%B8%D1%8F_%D0%A4%D0%B8%D0%B2%D0%B5%D0%B9%D1%81%D0%BA%D0%BE%D0%B3%D0%BE_(%D0%90%D0%BD%D0%B4%D1%80%D0%B5%D0%B5%D0%B2)>
* «Жили-были» (1901), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%96%D0%B8%D0%BB%D0%B8-%D0%B1%D1%8B%D0%BB%D0%B8_(%D0%90%D0%BD%D0%B4%D1%80%D0%B5%D0%B5%D0%B2)>
* «Иуда Искариот» (1907), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%98%D1%83%D0%B4%D0%B0_%D0%98%D1%81%D0%BA%D0%B0%D1%80%D0%B8%D0%BE%D1%82_(%D0%90%D0%BD%D0%B4%D1%80%D0%B5%D0%B5%D0%B2)>
* «Красный смех» (1904), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D1%80%D0%B0%D1%81%D0%BD%D1%8B%D0%B9_%D1%81%D0%BC%D0%B5%D1%85_(%D0%90%D0%BD%D0%B4%D1%80%D0%B5%D0%B5%D0%B2)>
* «Кусака» (1901), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D1%83%D1%81%D0%B0%D0%BA%D0%B0_(%D0%90%D0%BD%D0%B4%D1%80%D0%B5%D0%B5%D0%B2)>
* «Мысль» (1902), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9C%D1%8B%D1%81%D0%BB%D1%8C_(%D0%90%D0%BD%D0%B4%D1%80%D0%B5%D0%B5%D0%B2)>
* «Петька на даче» (1899), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%B5%D1%82%D1%8C%D0%BA%D0%B0_%D0%BD%D0%B0_%D0%B4%D0%B0%D1%87%D0%B5_(%D0%90%D0%BD%D0%B4%D1%80%D0%B5%D0%B5%D0%B2)>
* «Рассказ о семи повешенных» (1908), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%A0%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D0%B7_%D0%BE_%D1%81%D0%B5%D0%BC%D0%B8_%D0%BF%D0%BE%D0%B2%D0%B5%D1%88%D0%B5%D0%BD%D0%BD%D1%8B%D1%85_(%D0%90%D0%BD%D0%B4%D1%80%D0%B5%D0%B5%D0%B2)>
* «Тьма» (1907), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%A2%D1%8C%D0%BC%D0%B0_(%D0%90%D0%BD%D0%B4%D1%80%D0%B5%D0%B5%D0%B2)>

### Иннокентий Анненский

* «Лаодамия» (1906), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%9B%D0%B0%D0%BE%D0%B4%D0%B0%D0%BC%D0%B8%D1%8F_(%D0%90%D0%BD%D0%BD%D0%B5%D0%BD%D1%81%D0%BA%D0%B8%D0%B9)>
* «Меланиппа-философ», пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%9C%D0%B5%D0%BB%D0%B0%D0%BD%D0%B8%D0%BF%D0%BF%D0%B0-%D1%84%D0%B8%D0%BB%D0%BE%D1%81%D0%BE%D1%84_(%D0%90%D0%BD%D0%BD%D0%B5%D0%BD%D1%81%D0%BA%D0%B8%D0%B9)>
* «Царь Иксион», пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%A6%D0%B0%D1%80%D1%8C_%D0%98%D0%BA%D1%81%D0%B8%D0%BE%D0%BD_(%D0%90%D0%BD%D0%BD%D0%B5%D0%BD%D1%81%D0%BA%D0%B8%D0%B9)>

### Алексей Апухтин

* «Дневник Павлика Дольского» (1891), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%94%D0%BD%D0%B5%D0%B2%D0%BD%D0%B8%D0%BA_%D0%9F%D0%B0%D0%B2%D0%BB%D0%B8%D0%BA%D0%B0_%D0%94%D0%BE%D0%BB%D1%8C%D1%81%D0%BA%D0%BE%D0%B3%D0%BE_(%D0%90%D0%BF%D1%83%D1%85%D1%82%D0%B8%D0%BD)>
* «Между жизнью и смертью» (1892), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9C%D0%B5%D0%B6%D0%B4%D1%83_%D0%B6%D0%B8%D0%B7%D0%BD%D1%8C%D1%8E_%D0%B8_%D1%81%D0%BC%D0%B5%D1%80%D1%82%D1%8C%D1%8E_(%D0%90%D0%BF%D1%83%D1%85%D1%82%D0%B8%D0%BD)>
* «Неоконченная повесть» (1888), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9D%D0%B5%D0%BE%D0%BA%D0%BE%D0%BD%D1%87%D0%B5%D0%BD%D0%BD%D0%B0%D1%8F_%D0%BF%D0%BE%D0%B2%D0%B5%D1%81%D1%82%D1%8C_(%D0%90%D0%BF%D1%83%D1%85%D1%82%D0%B8%D0%BD)>

### Михаил Арцыбашев

* «Жена» (1905), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%96%D0%B5%D0%BD%D0%B0_(%D0%90%D1%80%D1%86%D1%8B%D0%B1%D0%B0%D1%88%D0%B5%D0%B2)>
* «Миллионы» (1912), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9C%D0%B8%D0%BB%D0%BB%D0%B8%D0%BE%D0%BD%D1%8B_(%D0%90%D1%80%D1%86%D1%8B%D0%B1%D0%B0%D1%88%D0%B5%D0%B2)>
* «Санин» (1907), роман. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%B0%D0%BD%D0%B8%D0%BD_(%D0%90%D1%80%D1%86%D1%8B%D0%B1%D0%B0%D1%88%D0%B5%D0%B2)>
* «Смерть Ланде» (1904), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%BC%D0%B5%D1%80%D1%82%D1%8C_%D0%9B%D0%B0%D0%BD%D0%B4%D0%B5_(%D0%90%D1%80%D1%86%D1%8B%D0%B1%D0%B0%D1%88%D0%B5%D0%B2)>
* «Тени утра» (1905), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%A2%D0%B5%D0%BD%D0%B8_%D1%83%D1%82%D1%80%D0%B0_(%D0%90%D1%80%D1%86%D1%8B%D0%B1%D0%B0%D1%88%D0%B5%D0%B2)>
* «У последней черты» (1912), роман. Источник: <https://ru.wikisource.org/wiki/%D0%A3_%D0%BF%D0%BE%D1%81%D0%BB%D0%B5%D0%B4%D0%BD%D0%B5%D0%B9_%D1%87%D0%B5%D1%80%D1%82%D1%8B_(%D0%90%D1%80%D1%86%D1%8B%D0%B1%D0%B0%D1%88%D0%B5%D0%B2)>

### Евгений Баратынский

* «Бал» (1828), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%91%D0%B0%D0%BB_(%D0%91%D0%B0%D1%80%D0%B0%D1%82%D1%8B%D0%BD%D1%81%D0%BA%D0%B8%D0%B9)>
* «Пиры» (1821), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%B8%D1%80%D1%8B_(%D0%91%D0%B0%D1%80%D0%B0%D1%82%D1%8B%D0%BD%D1%81%D0%BA%D0%B8%D0%B9)>
* «Сумерки» (1842), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D1%83%D0%BC%D0%B5%D1%80%D0%BA%D0%B8_(%D0%91%D0%B0%D1%80%D0%B0%D1%82%D1%8B%D0%BD%D1%81%D0%BA%D0%B8%D0%B9)>
* «Цыганка» (1831), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%A6%D1%8B%D0%B3%D0%B0%D0%BD%D0%BA%D0%B0_(%D0%91%D0%B0%D1%80%D0%B0%D1%82%D1%8B%D0%BD%D1%81%D0%BA%D0%B8%D0%B9)>
* «Эда» (1826), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%AD%D0%B4%D0%B0_(%D0%91%D0%B0%D1%80%D0%B0%D1%82%D1%8B%D0%BD%D1%81%D0%BA%D0%B8%D0%B9)>

### Константин Батюшков

* «Странствователь и домосед» (1815), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D1%82%D1%80%D0%B0%D0%BD%D1%81%D1%82%D0%B2%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D1%8C_%D0%B8_%D0%B4%D0%BE%D0%BC%D0%BE%D1%81%D0%B5%D0%B4_(%D0%91%D0%B0%D1%82%D1%8E%D1%88%D0%BA%D0%BE%D0%B2)>

### Александр Блок

* «Балаганчик» (1906), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%91%D0%B0%D0%BB%D0%B0%D0%B3%D0%B0%D0%BD%D1%87%D0%B8%D0%BA_(%D0%91%D0%BB%D0%BE%D0%BA)>
* «Возмездие» (1917), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%92%D0%BE%D0%B7%D0%BC%D0%B5%D0%B7%D0%B4%D0%B8%D0%B5_(%D0%91%D0%BB%D0%BE%D0%BA)>
* «Двенадцать» (1918), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%94%D0%B2%D0%B5%D0%BD%D0%B0%D0%B4%D1%86%D0%B0%D1%82%D1%8C_(%D0%91%D0%BB%D0%BE%D0%BA)>
* «Король на площади» (1906), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D0%BE%D1%80%D0%BE%D0%BB%D1%8C_%D0%BD%D0%B0_%D0%BF%D0%BB%D0%BE%D1%89%D0%B0%D0%B4%D0%B8_(%D0%91%D0%BB%D0%BE%D0%BA)>
* «Незнакомка» (1907), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%9D%D0%B5%D0%B7%D0%BD%D0%B0%D0%BA%D0%BE%D0%BC%D0%BA%D0%B0_(%D0%B4%D1%80%D0%B0%D0%BC%D0%B0,_%D0%91%D0%BB%D0%BE%D0%BA)>
* «Рамзес» (1919), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%A0%D0%B0%D0%BC%D0%B7%D0%B5%D1%81_(%D0%91%D0%BB%D0%BE%D0%BA)>
* «Роза и Крест» (1913), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%A0%D0%BE%D0%B7%D0%B0_%D0%B8_%D0%BA%D1%80%D0%B5%D1%81%D1%82_(%D0%91%D0%BB%D0%BE%D0%BA)>

### Валерий Брюсов

* «Алтарь победы» (1912), роман. Источник: <https://ru.wikisource.org/wiki/%D0%90%D0%BB%D1%82%D0%B0%D1%80%D1%8C_%D0%BF%D0%BE%D0%B1%D0%B5%D0%B4%D1%8B_(%D0%91%D1%80%D1%8E%D1%81%D0%BE%D0%B2)>
* «Восстание машин» (1908), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%92%D0%BE%D1%81%D1%81%D1%82%D0%B0%D0%BD%D0%B8%D0%B5_%D0%BC%D0%B0%D1%88%D0%B8%D0%BD_(%D0%91%D1%80%D1%8E%D1%81%D0%BE%D0%B2)>
* «Земля» (1904), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%97%D0%B5%D0%BC%D0%BB%D1%8F_(%D0%91%D1%80%D1%8E%D1%81%D0%BE%D0%B2)>
* «Огненный ангел» (1908), роман. Источник: <https://ru.wikisource.org/wiki/%D0%9E%D0%B3%D0%BD%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9_%D0%B0%D0%BD%D0%B3%D0%B5%D0%BB_(%D0%91%D1%80%D1%8E%D1%81%D0%BE%D0%B2)>
* «Последние страницы из дневника женщины» (1910), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%BE%D1%81%D0%BB%D0%B5%D0%B4%D0%BD%D0%B8%D0%B5_%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%8B_%D0%B8%D0%B7_%D0%B4%D0%BD%D0%B5%D0%B2%D0%BD%D0%B8%D0%BA%D0%B0_%D0%B6%D0%B5%D0%BD%D1%89%D0%B8%D0%BD%D1%8B_(%D0%91%D1%80%D1%8E%D1%81%D0%BE%D0%B2)>
* «Республика Южного Креста» (1905), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%A0%D0%B5%D1%81%D0%BF%D1%83%D0%B1%D0%BB%D0%B8%D0%BA%D0%B0_%D0%AE%D0%B6%D0%BD%D0%BE%D0%B3%D0%BE_%D0%9A%D1%80%D0%B5%D1%81%D1%82%D0%B0_(%D0%91%D1%80%D1%8E%D1%81%D0%BE%D0%B2)/1911_(%D0%92%D0%A2)>
* «Рея Сильвия» (1914), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%A0%D0%B5%D1%8F_%D0%A1%D0%B8%D0%BB%D1%8C%D0%B2%D0%B8%D1%8F_(%D0%91%D1%80%D1%8E%D1%81%D0%BE%D0%B2)>
* «Через пятнадцать лет» (1909), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%A7%D0%B5%D1%80%D0%B5%D0%B7_%D0%BF%D1%8F%D1%82%D0%BD%D0%B0%D0%B4%D1%86%D0%B0%D1%82%D1%8C_%D0%BB%D0%B5%D1%82_(%D0%91%D1%80%D1%8E%D1%81%D0%BE%D0%B2)>

### Николай Гарин-Михайловский

* «Бабушка», рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%91%D0%B0%D0%B1%D1%83%D1%88%D0%BA%D0%B0_(%D0%93%D0%B0%D1%80%D0%B8%D0%BD-%D0%9C%D0%B8%D1%85%D0%B0%D0%B9%D0%BB%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Гимназисты» (1895), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%93%D0%B8%D0%BC%D0%BD%D0%B0%D0%B7%D0%B8%D1%81%D1%82%D1%8B_(%D0%93%D0%B0%D1%80%D0%B8%D0%BD-%D0%9C%D0%B8%D1%85%D0%B0%D0%B9%D0%BB%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Детство Тёмы» (1892), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%94%D0%B5%D1%82%D1%81%D1%82%D0%B2%D0%BE_%D0%A2%D1%91%D0%BC%D1%8B_(%D0%93%D0%B0%D1%80%D0%B8%D0%BD-%D0%9C%D0%B8%D1%85%D0%B0%D0%B9%D0%BB%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Инженеры» (1906), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%98%D0%BD%D0%B6%D0%B5%D0%BD%D0%B5%D1%80%D1%8B_(%D0%93%D0%B0%D1%80%D0%B8%D0%BD-%D0%9C%D0%B8%D1%85%D0%B0%D0%B9%D0%BB%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Несколько лет в деревне», повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9D%D0%B5%D1%81%D0%BA%D0%BE%D0%BB%D1%8C%D0%BA%D0%BE_%D0%BB%D0%B5%D1%82_%D0%B2_%D0%B4%D0%B5%D1%80%D0%B5%D0%B2%D0%BD%D0%B5_(%D0%93%D0%B0%D1%80%D0%B8%D0%BD-%D0%9C%D0%B8%D1%85%D0%B0%D0%B9%D0%BB%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Студенты» (1895), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D1%82%D1%83%D0%B4%D0%B5%D0%BD%D1%82%D1%8B_(%D0%93%D0%B0%D1%80%D0%B8%D0%BD-%D0%9C%D0%B8%D1%85%D0%B0%D0%B9%D0%BB%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>

### Всеволод Гаршин

* «Attalea princeps» (1880), сказка. Источник: <https://ru.wikisource.org/wiki/Attalea_princeps_(%D0%93%D0%B0%D1%80%D1%88%D0%B8%D0%BD)>
* «Встреча» (1879), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%92%D1%81%D1%82%D1%80%D0%B5%D1%87%D0%B0_(%D0%93%D0%B0%D1%80%D1%88%D0%B8%D0%BD)>
* «Из воспоминаний рядового Иванова» (1883), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%98%D0%B7_%D0%B2%D0%BE%D1%81%D0%BF%D0%BE%D0%BC%D0%B8%D0%BD%D0%B0%D0%BD%D0%B8%D0%B9_%D1%80%D1%8F%D0%B4%D0%BE%D0%B2%D0%BE%D0%B3%D0%BE_%D0%98%D0%B2%D0%B0%D0%BD%D0%BE%D0%B2%D0%B0_(%D0%93%D0%B0%D1%80%D1%88%D0%B8%D0%BD)>
* «Красный цветок» (1883), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D1%80%D0%B0%D1%81%D0%BD%D1%8B%D0%B9_%D1%86%D0%B2%D0%B5%D1%82%D0%BE%D0%BA_(%D0%93%D0%B0%D1%80%D1%88%D0%B8%D0%BD)>
* «Лягушка-путешественница» (1887), сказка. Источник: <https://ru.wikisource.org/wiki/%D0%9B%D1%8F%D0%B3%D1%83%D1%88%D0%BA%D0%B0-%D0%BF%D1%83%D1%82%D0%B5%D1%88%D0%B5%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%B8%D1%86%D0%B0_(%D0%93%D0%B0%D1%80%D1%88%D0%B8%D0%BD)>
* «Медведи» (1883), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9C%D0%B5%D0%B4%D0%B2%D0%B5%D0%B4%D0%B8_(%D0%93%D0%B0%D1%80%D1%88%D0%B8%D0%BD)>
* «Надежда Николаевна» (1885), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9D%D0%B0%D0%B4%D0%B5%D0%B6%D0%B4%D0%B0_%D0%9D%D0%B8%D0%BA%D0%BE%D0%BB%D0%B0%D0%B5%D0%B2%D0%BD%D0%B0_(%D0%93%D0%B0%D1%80%D1%88%D0%B8%D0%BD)>
* «Происшествие» (1878), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D1%80%D0%BE%D0%B8%D1%81%D1%88%D0%B5%D1%81%D1%82%D0%B2%D0%B8%D0%B5_(%D0%93%D0%B0%D1%80%D1%88%D0%B8%D0%BD)>
* «Сигнал» (1887), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%B8%D0%B3%D0%BD%D0%B0%D0%BB_(%D0%93%D0%B0%D1%80%D1%88%D0%B8%D0%BD)>
* «Сказание о гордом Аггее» (1886), сказка. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B5_%D0%BE_%D0%B3%D0%BE%D1%80%D0%B4%D0%BE%D0%BC_%D0%90%D0%B3%D0%B3%D0%B5%D0%B5_(%D0%93%D0%B0%D1%80%D1%88%D0%B8%D0%BD)>
* «Сказка о жабе и розе» (1884), сказка. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%BA%D0%B0%D0%B7%D0%BA%D0%B0_%D0%BE_%D0%B6%D0%B0%D0%B1%D0%B5_%D0%B8_%D1%80%D0%BE%D0%B7%D0%B5_(%D0%93%D0%B0%D1%80%D1%88%D0%B8%D0%BD)>
* «То, чего не было» (1882), сказка. Источник: <https://ru.wikisource.org/wiki/%D0%A2%D0%BE,_%D1%87%D0%B5%D0%B3%D0%BE_%D0%BD%D0%B5_%D0%B1%D1%8B%D0%BB%D0%BE_(%D0%93%D0%B0%D1%80%D1%88%D0%B8%D0%BD)>
* «Трус» (1879), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%A2%D1%80%D1%83%D1%81_(%D0%93%D0%B0%D1%80%D1%88%D0%B8%D0%BD)>
* «Художники» (1879), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%A5%D1%83%D0%B4%D0%BE%D0%B6%D0%BD%D0%B8%D0%BA%D0%B8_(%D0%93%D0%B0%D1%80%D1%88%D0%B8%D0%BD)>
* «Четыре дня» (1877), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%A7%D0%B5%D1%82%D1%8B%D1%80%D0%B5_%D0%B4%D0%BD%D1%8F_(%D0%93%D0%B0%D1%80%D1%88%D0%B8%D0%BD)>

### Александр Герцен

* «Доктор Крупов» (1847), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%94%D0%BE%D0%BA%D1%82%D0%BE%D1%80_%D0%9A%D1%80%D1%83%D0%BF%D0%BE%D0%B2_(%D0%93%D0%B5%D1%80%D1%86%D0%B5%D0%BD)>
* «Долг прежде всего» (1851), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%94%D0%BE%D0%BB%D0%B3_%D0%BF%D1%80%D0%B5%D0%B6%D0%B4%D0%B5_%D0%B2%D1%81%D0%B5%D0%B3%D0%BE_(%D0%93%D0%B5%D1%80%D1%86%D0%B5%D0%BD)>
* «Записки одного молодого человека» (1840), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%97%D0%B0%D0%BF%D0%B8%D1%81%D0%BA%D0%B8_%D0%BE%D0%B4%D0%BD%D0%BE%D0%B3%D0%BE_%D0%BC%D0%BE%D0%BB%D0%BE%D0%B4%D0%BE%D0%B3%D0%BE_%D1%87%D0%B5%D0%BB%D0%BE%D0%B2%D0%B5%D0%BA%D0%B0_(%D0%93%D0%B5%D1%80%D1%86%D0%B5%D0%BD)>
* «Кто виноват?» (1846), роман. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D1%82%D0%BE_%D0%B2%D0%B8%D0%BD%D0%BE%D0%B2%D0%B0%D1%82%3F_(%D0%93%D0%B5%D1%80%D1%86%D0%B5%D0%BD)>
* «Повреждённый» (1851), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%BE%D0%B2%D1%80%D0%B5%D0%B6%D0%B4%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9_(%D0%93%D0%B5%D1%80%D1%86%D0%B5%D0%BD)>
* «Сорока-воровка» (1848), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%BE%D1%80%D0%BE%D0%BA%D0%B0-%D0%B2%D0%BE%D1%80%D0%BE%D0%B2%D0%BA%D0%B0_(%D0%93%D0%B5%D1%80%D1%86%D0%B5%D0%BD)>

### Николай Гоголь

* «Вечер накануне Ивана Купала» (1830), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%92%D0%B5%D1%87%D0%B5%D1%80_%D0%BD%D0%B0%D0%BA%D0%B0%D0%BD%D1%83%D0%BD%D0%B5_%D0%98%D0%B2%D0%B0%D0%BD%D0%B0_%D0%9A%D1%83%D0%BF%D0%B0%D0%BB%D0%B0_(%D0%93%D0%BE%D0%B3%D0%BE%D0%BB%D1%8C)>
* «Вий» (1842), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%92%D0%B8%D0%B9_(%D0%93%D0%BE%D0%B3%D0%BE%D0%BB%D1%8C)>
* «Женитьба» (1842), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%96%D0%B5%D0%BD%D0%B8%D1%82%D1%8C%D0%B1%D0%B0_(%D0%93%D0%BE%D0%B3%D0%BE%D0%BB%D1%8C)>
* «Записки сумасшедшего» (1834), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%97%D0%B0%D0%BF%D0%B8%D1%81%D0%BA%D0%B8_%D1%81%D1%83%D0%BC%D0%B0%D1%81%D1%88%D0%B5%D0%B4%D1%88%D0%B5%D0%B3%D0%BE_(%D0%93%D0%BE%D0%B3%D0%BE%D0%BB%D1%8C)>
* «Игроки», пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%98%D0%B3%D1%80%D0%BE%D0%BA%D0%B8_(%D0%93%D0%BE%D0%B3%D0%BE%D0%BB%D1%8C)>
* «Коляска» (1836), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D0%BE%D0%BB%D1%8F%D1%81%D0%BA%D0%B0_(%D0%93%D0%BE%D0%B3%D0%BE%D0%BB%D1%8C)>
* «Мёртвые души» (1842), роман. Источник: <https://ru.wikisource.org/wiki/%D0%9C%D1%91%D1%80%D1%82%D0%B2%D1%8B%D0%B5_%D0%B4%D1%83%D1%88%D0%B8_(%D0%93%D0%BE%D0%B3%D0%BE%D0%BB%D1%8C)>
* «Невский проспект» (1835), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9D%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9_%D0%BF%D1%80%D0%BE%D1%81%D0%BF%D0%B5%D0%BA%D1%82_(%D0%93%D0%BE%D0%B3%D0%BE%D0%BB%D1%8C)>
* «Нос» (1835), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9D%D0%BE%D1%81_(%D0%93%D0%BE%D0%B3%D0%BE%D0%BB%D1%8C)>
* «Ночь перед Рождеством» (1832), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9D%D0%BE%D1%87%D1%8C_%D0%BF%D0%B5%D1%80%D0%B5%D0%B4_%D0%A0%D0%BE%D0%B6%D0%B4%D0%B5%D1%81%D1%82%D0%B2%D0%BE%D0%BC_(%D0%93%D0%BE%D0%B3%D0%BE%D0%BB%D1%8C)>
* «Повесть о том, как поссорился Иван Иванович с Иваном Никифоровичем» (1842), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%BE%D0%B2%D0%B5%D1%81%D1%82%D1%8C_%D0%BE_%D1%82%D0%BE%D0%BC,_%D0%BA%D0%B0%D0%BA_%D0%BF%D0%BE%D1%81%D1%81%D0%BE%D1%80%D0%B8%D0%BB%D1%81%D1%8F_%D0%98%D0%B2%D0%B0%D0%BD_%D0%98%D0%B2%D0%B0%D0%BD%D0%BE%D0%B2%D0%B8%D1%87_%D1%81_%D0%98%D0%B2%D0%B0%D0%BD%D0%BE%D0%BC_%D0%9D%D0%B8%D0%BA%D0%B8%D1%84%D0%BE%D1%80%D0%BE%D0%B2%D0%B8%D1%87%D0%B5%D0%BC_(%D0%93%D0%BE%D0%B3%D0%BE%D0%BB%D1%8C)>
* «Ревизор» (1836), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%A0%D0%B5%D0%B2%D0%B8%D0%B7%D0%BE%D1%80_(%D0%93%D0%BE%D0%B3%D0%BE%D0%BB%D1%8C)>
* «Сорочинская ярмарка» (1831), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%BE%D1%80%D0%BE%D1%87%D0%B8%D0%BD%D1%81%D0%BA%D0%B0%D1%8F_%D1%8F%D1%80%D0%BC%D0%B0%D1%80%D0%BA%D0%B0_(%D0%93%D0%BE%D0%B3%D0%BE%D0%BB%D1%8C)>
* «Старосветские помещики» (1835), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D1%82%D0%B0%D1%80%D0%BE%D1%81%D0%B2%D0%B5%D1%82%D1%81%D0%BA%D0%B8%D0%B5_%D0%BF%D0%BE%D0%BC%D0%B5%D1%89%D0%B8%D0%BA%D0%B8_(%D0%93%D0%BE%D0%B3%D0%BE%D0%BB%D1%8C)>
* «Тарас Бульба» (1842), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%A2%D0%B0%D1%80%D0%B0%D1%81_%D0%91%D1%83%D0%BB%D1%8C%D0%B1%D0%B0_(%D0%93%D0%BE%D0%B3%D0%BE%D0%BB%D1%8C)>
* «Шинель» (1842), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%A8%D0%B8%D0%BD%D0%B5%D0%BB%D1%8C_(%D0%93%D0%BE%D0%B3%D0%BE%D0%BB%D1%8C)/%D0%9F%D0%A1%D0%A1_1938_(%D0%A1%D0%9E)>

### Иван Гончаров

* «Два случая из морской жизни» (1858), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%94%D0%B2%D0%B0_%D1%81%D0%BB%D1%83%D1%87%D0%B0%D1%8F_%D0%B8%D0%B7_%D0%BC%D0%BE%D1%80%D1%81%D0%BA%D0%BE%D0%B9_%D0%B6%D0%B8%D0%B7%D0%BD%D0%B8_(%D0%93%D0%BE%D0%BD%D1%87%D0%B0%D1%80%D0%BE%D0%B2)>
* «Обломов» (1859), роман. Источник: <https://ru.wikisource.org/wiki/%D0%9E%D0%B1%D0%BB%D0%BE%D0%BC%D0%BE%D0%B2_(%D0%93%D0%BE%D0%BD%D1%87%D0%B0%D1%80%D0%BE%D0%B2)>
* «Обрыв» (1869), роман. Источник: <https://ru.wikisource.org/wiki/%D0%9E%D0%B1%D1%80%D1%8B%D0%B2_(%D0%93%D0%BE%D0%BD%D1%87%D0%B0%D1%80%D0%BE%D0%B2)>
* «Обыкновенная история» (1847), роман. Источник: <https://ru.wikisource.org/wiki/%D0%9E%D0%B1%D1%8B%D0%BA%D0%BD%D0%BE%D0%B2%D0%B5%D0%BD%D0%BD%D0%B0%D1%8F_%D0%B8%D1%81%D1%82%D0%BE%D1%80%D0%B8%D1%8F_(%D0%93%D0%BE%D0%BD%D1%87%D0%B0%D1%80%D0%BE%D0%B2)>

### Александр Грибоедов

* «Горе от ума» (1825), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%93%D0%BE%D1%80%D0%B5_%D0%BE%D1%82_%D1%83%D0%BC%D0%B0_(%D0%93%D1%80%D0%B8%D0%B1%D0%BE%D0%B5%D0%B4%D0%BE%D0%B2)/%D0%9F%D0%A1%D0%A1_1911_(%D0%92%D0%A2)>

### Николай Гумилёв

* «Актеон» (1913), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%90%D0%BA%D1%82%D0%B5%D0%BE%D0%BD_(%D0%93%D1%83%D0%BC%D0%B8%D0%BB%D1%91%D0%B2)>
* «Гондла» (1917), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%93%D0%BE%D0%BD%D0%B4%D0%BB%D0%B0_(%D0%93%D1%83%D0%BC%D0%B8%D0%BB%D1%91%D0%B2)>
* «Дитя Аллаха» (1917), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%94%D0%B8%D1%82%D1%8F_%D0%90%D0%BB%D0%BB%D0%B0%D1%85%D0%B0_(%D0%93%D1%83%D0%BC%D0%B8%D0%BB%D1%91%D0%B2)>
* «Записки кавалериста» (1915), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%97%D0%B0%D0%BF%D0%B8%D1%81%D0%BA%D0%B8_%D0%BA%D0%B0%D0%B2%D0%B0%D0%BB%D0%B5%D1%80%D0%B8%D1%81%D1%82%D0%B0_(%D0%93%D1%83%D0%BC%D0%B8%D0%BB%D1%91%D0%B2)>
* «Золотой рыцарь», рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%97%D0%BE%D0%BB%D0%BE%D1%82%D0%BE%D0%B9_%D1%80%D1%8B%D1%86%D0%B0%D1%80%D1%8C_(%D0%93%D1%83%D0%BC%D0%B8%D0%BB%D1%91%D0%B2)>
* «Мик» (1918), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%9C%D0%B8%D0%BA_(%D0%93%D1%83%D0%BC%D0%B8%D0%BB%D1%91%D0%B2)>

### Фёдор Достоевский

* «Бедные люди» (1846), роман. Источник: <https://ru.wikisource.org/wiki/%D0%91%D0%B5%D0%B4%D0%BD%D1%8B%D0%B5_%D0%BB%D1%8E%D0%B4%D0%B8_(%D0%94%D0%BE%D1%81%D1%82%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Белые ночи» (1848), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%91%D0%B5%D0%BB%D1%8B%D0%B5_%D0%BD%D0%BE%D1%87%D0%B8_(%D0%94%D0%BE%D1%81%D1%82%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Бесы» (1871), роман. Источник: <https://ru.wikisource.org/wiki/%D0%91%D0%B5%D1%81%D1%8B_(%D0%94%D0%BE%D1%81%D1%82%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Братья Карамазовы» (1878), роман. Источник: <https://ru.wikisource.org/wiki/%D0%91%D1%80%D0%B0%D1%82%D1%8C%D1%8F_%D0%9A%D0%B0%D1%80%D0%B0%D0%BC%D0%B0%D0%B7%D0%BE%D0%B2%D1%8B_(%D0%94%D0%BE%D1%81%D1%82%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Двойник» (1846), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%94%D0%B2%D0%BE%D0%B9%D0%BD%D0%B8%D0%BA_(%D0%94%D0%BE%D1%81%D1%82%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Дядюшкин сон» (1859), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%94%D1%8F%D0%B4%D1%8E%D1%88%D0%BA%D0%B8%D0%BD_%D1%81%D0%BE%D0%BD_(%D0%94%D0%BE%D1%81%D1%82%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Записки из мёртвого дома» (1860), роман. Источник: <https://ru.wikisource.org/wiki/%D0%97%D0%B0%D0%BF%D0%B8%D1%81%D0%BA%D0%B8_%D0%B8%D0%B7_%D0%9C%D1%91%D1%80%D1%82%D0%B2%D0%BE%D0%B3%D0%BE_%D0%B4%D0%BE%D0%BC%D0%B0_(%D0%94%D0%BE%D1%81%D1%82%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Записки из подполья» (1864), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%97%D0%B0%D0%BF%D0%B8%D1%81%D0%BA%D0%B8_%D0%B8%D0%B7_%D0%BF%D0%BE%D0%B4%D0%BF%D0%BE%D0%BB%D1%8C%D1%8F_(%D0%94%D0%BE%D1%81%D1%82%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Игрок» (1866), роман. Источник: <https://ru.wikisource.org/wiki/%D0%98%D0%B3%D1%80%D0%BE%D0%BA_(%D0%94%D0%BE%D1%81%D1%82%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Идиот» (1868), роман. Источник: <https://ru.wikisource.org/wiki/%D0%98%D0%B4%D0%B8%D0%BE%D1%82_(%D0%94%D0%BE%D1%81%D1%82%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Кроткая» (1876), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D1%80%D0%BE%D1%82%D0%BA%D0%B0%D1%8F_(%D0%94%D0%BE%D1%81%D1%82%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Неточка Незванова» (1849), роман. Источник: <https://ru.wikisource.org/wiki/%D0%9D%D0%B5%D1%82%D0%BE%D1%87%D0%BA%D0%B0_%D0%9D%D0%B5%D0%B7%D0%B2%D0%B0%D0%BD%D0%BE%D0%B2%D0%B0_(%D0%94%D0%BE%D1%81%D1%82%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Подросток» (1875), роман. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%BE%D0%B4%D1%80%D0%BE%D1%81%D1%82%D0%BE%D0%BA_(%D0%94%D0%BE%D1%81%D1%82%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Преступление и наказание» (1866), роман. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D1%80%D0%B5%D1%81%D1%82%D1%83%D0%BF%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5_%D0%B8_%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B5_(%D0%94%D0%BE%D1%81%D1%82%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Село Степанчиково и его обитатели» (1859), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%B5%D0%BB%D0%BE_%D0%A1%D1%82%D0%B5%D0%BF%D0%B0%D0%BD%D1%87%D0%B8%D0%BA%D0%BE%D0%B2%D0%BE_%D0%B8_%D0%B5%D0%B3%D0%BE_%D0%BE%D0%B1%D0%B8%D1%82%D0%B0%D1%82%D0%B5%D0%BB%D0%B8_(%D0%94%D0%BE%D1%81%D1%82%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Униженные и оскорблённые» (1861), роман. Источник: <https://ru.wikisource.org/wiki/%D0%A3%D0%BD%D0%B8%D0%B6%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5_%D0%B8_%D0%BE%D1%81%D0%BA%D0%BE%D1%80%D0%B1%D0%BB%D1%91%D0%BD%D0%BD%D1%8B%D0%B5_(%D0%94%D0%BE%D1%81%D1%82%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>

### Пётр Ершов

* «Конёк-горбунок» (1834), сказка. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D0%BE%D0%BD%D1%91%D0%BA-%D0%B3%D0%BE%D1%80%D0%B1%D1%83%D0%BD%D0%BE%D0%BA_(%D0%95%D1%80%D1%88%D0%BE%D0%B2)>

### Сергей Есенин

* «Анна Снегина» (1925), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%90%D0%BD%D0%BD%D0%B0_%D0%A1%D0%BD%D0%B5%D0%B3%D0%B8%D0%BD%D0%B0_(%D0%95%D1%81%D0%B5%D0%BD%D0%B8%D0%BD)>
* «Инония» (1918), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%98%D0%BD%D0%BE%D0%BD%D0%B8%D1%8F_(%D0%95%D1%81%D0%B5%D0%BD%D0%B8%D0%BD)>
* «Исповедь хулигана» (1920), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%98%D1%81%D0%BF%D0%BE%D0%B2%D0%B5%D0%B4%D1%8C_%D1%85%D1%83%D0%BB%D0%B8%D0%B3%D0%B0%D0%BD%D0%B0_(%D0%95%D1%81%D0%B5%D0%BD%D0%B8%D0%BD)>
* «Ключи Марии» (1918), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D0%BB%D1%8E%D1%87%D0%B8_%D0%9C%D0%B0%D1%80%D0%B8%D0%B8_(%D0%95%D1%81%D0%B5%D0%BD%D0%B8%D0%BD)>
* «Песнь о великом походе» (1924), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%B5%D1%81%D0%BD%D1%8C_%D0%BE_%D0%B2%D0%B5%D0%BB%D0%B8%D0%BA%D0%BE%D0%BC_%D0%BF%D0%BE%D1%85%D0%BE%D0%B4%D0%B5_(%D0%95%D1%81%D0%B5%D0%BD%D0%B8%D0%BD)>
* «Поэма о 36» (1925), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%BE%D1%8D%D0%BC%D0%B0_%D0%BE_36_(%D0%95%D1%81%D0%B5%D0%BD%D0%B8%D0%BD)>
* «Пугачёв» (1921), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D1%83%D0%B3%D0%B0%D1%87%D1%91%D0%B2_(%D0%95%D1%81%D0%B5%D0%BD%D0%B8%D0%BD)>
* «Русь Советская», стихи. Источник: <https://ru.wikisource.org/wiki/%D0%A0%D1%83%D1%81%D1%8C_%D1%81%D0%BE%D0%B2%D0%B5%D1%82%D1%81%D0%BA%D0%B0%D1%8F_(%D0%95%D1%81%D0%B5%D0%BD%D0%B8%D0%BD)>
* «Сорокоуст» (1920), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%BE%D1%80%D0%BE%D0%BA%D0%BE%D1%83%D1%81%D1%82_(%D0%95%D1%81%D0%B5%D0%BD%D0%B8%D0%BD)>
* «Страна негодяев» (1924), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D1%82%D1%80%D0%B0%D0%BD%D0%B0_%D0%BD%D0%B5%D0%B3%D0%BE%D0%B4%D1%8F%D0%B5%D0%B2_(%D0%95%D1%81%D0%B5%D0%BD%D0%B8%D0%BD)>
* «Чёрный человек» (1925), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%A7%D1%91%D1%80%D0%BD%D1%8B%D0%B9_%D1%87%D0%B5%D0%BB%D0%BE%D0%B2%D0%B5%D0%BA_(%D0%95%D1%81%D0%B5%D0%BD%D0%B8%D0%BD)>
* «Яр» (1916), роман. Источник: <https://ru.wikisource.org/wiki/%D0%AF%D1%80_(%D0%95%D1%81%D0%B5%D0%BD%D0%B8%D0%BD)>

### Николай Карамзин

* «Бедная Лиза» (1792), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%91%D0%B5%D0%B4%D0%BD%D0%B0%D1%8F_%D0%9B%D0%B8%D0%B7%D0%B0_(%D0%9A%D0%B0%D1%80%D0%B0%D0%BC%D0%B7%D0%B8%D0%BD)>
* «Евгений и Юлия» (1789), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%95%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D0%B9_%D0%B8_%D0%AE%D0%BB%D0%B8%D1%8F_(%D0%9A%D0%B0%D1%80%D0%B0%D0%BC%D0%B7%D0%B8%D0%BD)>
* «Марфа-посадница, или Покорение Новагорода» (1802), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9C%D0%B0%D1%80%D1%84%D0%B0-%D0%BF%D0%BE%D1%81%D0%B0%D0%B4%D0%BD%D0%B8%D1%86%D0%B0,_%D0%B8%D0%BB%D0%B8_%D0%BF%D0%BE%D0%BA%D0%BE%D1%80%D0%B5%D0%BD%D0%B8%D0%B5_%D0%9D%D0%BE%D0%B2%D0%B0%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0_(%D0%9A%D0%B0%D1%80%D0%B0%D0%BC%D0%B7%D0%B8%D0%BD)>
* «Моя исповедь» (1802), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9C%D0%BE%D1%8F_%D0%B8%D1%81%D0%BF%D0%BE%D0%B2%D0%B5%D0%B4%D1%8C_(%D0%9A%D0%B0%D1%80%D0%B0%D0%BC%D0%B7%D0%B8%D0%BD)>
* «Наталья, боярская дочь» (1792), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9D%D0%B0%D1%82%D0%B0%D0%BB%D1%8C%D1%8F,_%D0%B1%D0%BE%D1%8F%D1%80%D1%81%D0%BA%D0%B0%D1%8F_%D0%B4%D0%BE%D1%87%D1%8C_(%D0%9A%D0%B0%D1%80%D0%B0%D0%BC%D0%B7%D0%B8%D0%BD)>
* «Остров Борнгольм» (1794), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9E%D1%81%D1%82%D1%80%D0%BE%D0%B2_%D0%91%D0%BE%D1%80%D0%BD%D0%B3%D0%BE%D0%BB%D1%8C%D0%BC_(%D0%9A%D0%B0%D1%80%D0%B0%D0%BC%D0%B7%D0%B8%D0%BD)>
* «Рыцарь нашего времени» (1803), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%A0%D1%8B%D1%86%D0%B0%D1%80%D1%8C_%D0%BD%D0%B0%D1%88%D0%B5%D0%B3%D0%BE_%D0%B2%D1%80%D0%B5%D0%BC%D0%B5%D0%BD%D0%B8_(%D0%9A%D0%B0%D1%80%D0%B0%D0%BC%D0%B7%D0%B8%D0%BD)>
* «Сиерра-Морена» (1793), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%B8%D0%B5%D1%80%D1%80%D0%B0-%D0%9C%D0%BE%D1%80%D0%B5%D0%BD%D0%B0_(%D0%9A%D0%B0%D1%80%D0%B0%D0%BC%D0%B7%D0%B8%D0%BD)>
* «Чувствительный и холодный» (1803), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%A7%D1%83%D0%B2%D1%81%D1%82%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9_%D0%B8_%D1%85%D0%BE%D0%BB%D0%BE%D0%B4%D0%BD%D1%8B%D0%B9_(%D0%9A%D0%B0%D1%80%D0%B0%D0%BC%D0%B7%D0%B8%D0%BD)>
* «Юлия», повесть. Источник: <https://ru.wikisource.org/wiki/%D0%AE%D0%BB%D0%B8%D1%8F_(%D0%9A%D0%B0%D1%80%D0%B0%D0%BC%D0%B7%D0%B8%D0%BD)>

### Алексей Кольцов

* «Стихотворения» (1842), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D1%82%D0%B8%D1%85%D0%BE%D1%82%D0%B2%D0%BE%D1%80%D0%B5%D0%BD%D0%B8%D1%8F_(%D0%9A%D0%BE%D0%BB%D1%8C%D1%86%D0%BE%D0%B2)>

### Владимир Короленко

* «Ат-Даван» (1892), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%90%D1%82-%D0%94%D0%B0%D0%B2%D0%B0%D0%BD_(%D0%9A%D0%BE%D1%80%D0%BE%D0%BB%D0%B5%D0%BD%D0%BA%D0%BE)>
* «Без языка» (1895), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%91%D0%B5%D0%B7_%D1%8F%D0%B7%D1%8B%D0%BA%D0%B0_(%D0%9A%D0%BE%D1%80%D0%BE%D0%BB%D0%B5%D0%BD%D0%BA%D0%BE)>
* «В дурном обществе» (1885), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%92_%D0%B4%D1%83%D1%80%D0%BD%D0%BE%D0%BC_%D0%BE%D0%B1%D1%89%D0%B5%D1%81%D1%82%D0%B2%D0%B5_(%D0%9A%D0%BE%D1%80%D0%BE%D0%BB%D0%B5%D0%BD%D0%BA%D0%BE)/%D0%9F%D0%A1%D0%A1_1914_(%D0%92%D0%A2:%D0%81)>
* «Лес шумит» (1886), рассказ. Источник: <https://ru.wikisource.org/wiki/%C2%AB%D0%9B%D0%B5%D1%81_%D1%88%D1%83%D0%BC%D0%B8%D1%82%C2%BB_(%D0%9A%D0%BE%D1%80%D0%BE%D0%BB%D0%B5%D0%BD%D0%BA%D0%BE)/%D0%9F%D0%A1%D0%A1_1914_(%D0%92%D0%A2:%D0%81)>
* «Марусина заимка» (1899), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9C%D0%B0%D1%80%D1%83%D1%81%D0%B8%D0%BD%D0%B0_%D0%B7%D0%B0%D0%B8%D0%BC%D0%BA%D0%B0_(%D0%9A%D0%BE%D1%80%D0%BE%D0%BB%D0%B5%D0%BD%D0%BA%D0%BE)>
* «Мгновение» (1900), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9C%D0%B3%D0%BD%D0%BE%D0%B2%D0%B5%D0%BD%D0%B8%D0%B5_(%D0%9A%D0%BE%D1%80%D0%BE%D0%BB%D0%B5%D0%BD%D0%BA%D0%BE)/%D0%9F%D0%A1%D0%A1_1914_(%D0%92%D0%A2:%D0%81)>
* «Мороз» (1901), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9C%D0%BE%D1%80%D0%BE%D0%B7_(%D0%9A%D0%BE%D1%80%D0%BE%D0%BB%D0%B5%D0%BD%D0%BA%D0%BE)>
* «Парадокс» (1894), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%B0%D1%80%D0%B0%D0%B4%D0%BE%D0%BA%D1%81_(%D0%9A%D0%BE%D1%80%D0%BE%D0%BB%D0%B5%D0%BD%D0%BA%D0%BE)/%D0%9F%D0%A1%D0%A1_1914_(%D0%92%D0%A2:%D0%81)>
* «Река играет» (1892), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%A0%D0%B5%D0%BA%D0%B0_%D0%B8%D0%B3%D1%80%D0%B0%D0%B5%D1%82_(%D0%9A%D0%BE%D1%80%D0%BE%D0%BB%D0%B5%D0%BD%D0%BA%D0%BE)/%D0%9F%D0%A1%D0%A1_1914_(%D0%92%D0%A2:%D0%81)>
* «Слепой музыкант» (1886), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%BB%D0%B5%D0%BF%D0%BE%D0%B9_%D0%BC%D1%83%D0%B7%D1%8B%D0%BA%D0%B0%D0%BD%D1%82_(%D0%9A%D0%BE%D1%80%D0%BE%D0%BB%D0%B5%D0%BD%D0%BA%D0%BE)/%D0%9F%D0%A1%D0%A1_1914_(%D0%92%D0%A2)>
* «Соколинец» (1885), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%BE%D0%BA%D0%BE%D0%BB%D0%B8%D0%BD%D0%B5%D1%86_(%D0%9A%D0%BE%D1%80%D0%BE%D0%BB%D0%B5%D0%BD%D0%BA%D0%BE)>
* «Сон Макара» (1885), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%BE%D0%BD_%D0%9C%D0%B0%D0%BA%D0%B0%D1%80%D0%B0_(%D0%9A%D0%BE%D1%80%D0%BE%D0%BB%D0%B5%D0%BD%D0%BA%D0%BE)/%D0%9F%D0%A1%D0%A1_1914_(%D0%92%D0%A2:%D0%81)>
* «Тени» (1891), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%A2%D0%B5%D0%BD%D0%B8_(%D0%9A%D0%BE%D1%80%D0%BE%D0%BB%D0%B5%D0%BD%D0%BA%D0%BE)>
* «Чудная» (1893), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%A7%D1%83%D0%B4%D0%BD%D0%B0%D1%8F_(%D0%9A%D0%BE%D1%80%D0%BE%D0%BB%D0%B5%D0%BD%D0%BA%D0%BE)/%D0%98%D0%B7%D0%B1%D1%80%D0%B0%D0%BD%D0%BD%D0%BE%D0%B5,_1987_(%D0%A1%D0%9E)>

### Иван Крылов

* «Илья Богатырь» (1807), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%98%D0%BB%D1%8C%D1%8F_%D0%B1%D0%BE%D0%B3%D0%B0%D1%82%D1%8B%D1%80%D1%8C_(%D0%9A%D1%80%D1%8B%D0%BB%D0%BE%D0%B2)>
* «Каиб» (1792), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D0%B0%D0%B8%D0%B1_(%D0%9A%D1%80%D1%8B%D0%BB%D0%BE%D0%B2)>
* «Модная лавка» (1807), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%9C%D0%BE%D0%B4%D0%BD%D0%B0%D1%8F_%D0%BB%D0%B0%D0%B2%D0%BA%D0%B0_(%D0%9A%D1%80%D1%8B%D0%BB%D0%BE%D0%B2)>
* «Ночи» (1792), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9D%D0%BE%D1%87%D0%B8_(%D0%9A%D1%80%D1%8B%D0%BB%D0%BE%D0%B2)>
* «Пирог» (1869), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%B8%D1%80%D0%BE%D0%B3_(%D0%9A%D1%80%D1%8B%D0%BB%D0%BE%D0%B2)>
* «Подщипа» (1871), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%BE%D0%B4%D1%89%D0%B8%D0%BF%D0%B0_(%D0%9A%D1%80%D1%8B%D0%BB%D0%BE%D0%B2)>
* «Почта духов» (1789), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%BE%D1%87%D1%82%D0%B0_%D0%B4%D1%83%D1%85%D0%BE%D0%B2_(%D0%9A%D1%80%D1%8B%D0%BB%D0%BE%D0%B2)>
* «Проказники» (1793), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D1%80%D0%BE%D0%BA%D0%B0%D0%B7%D0%BD%D0%B8%D0%BA%D0%B8_(%D0%9A%D1%80%D1%8B%D0%BB%D0%BE%D0%B2)>
* «Сочинитель в прихожей» (1794), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%BE%D1%87%D0%B8%D0%BD%D0%B8%D1%82%D0%B5%D0%BB%D1%8C_%D0%B2_%D0%BF%D1%80%D0%B8%D1%85%D0%BE%D0%B6%D0%B5%D0%B9_(%D0%9A%D1%80%D1%8B%D0%BB%D0%BE%D0%B2)>
* «Урок дочкам» (1807), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%A3%D1%80%D0%BE%D0%BA_%D0%B4%D0%BE%D1%87%D0%BA%D0%B0%D0%BC_(%D0%9A%D1%80%D1%8B%D0%BB%D0%BE%D0%B2)>

### Михаил Лермонтов

* «Ашик-Кериб» (1846), сказка. Источник: <https://ru.wikisource.org/wiki/%D0%90%D1%88%D0%B8%D0%BA-%D0%9A%D0%B5%D1%80%D0%B8%D0%B1_(%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2)>
* «Беглец» (1846), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%91%D0%B5%D0%B3%D0%BB%D0%B5%D1%86_(%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2)>
* «Боярин Орша» (1842), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%91%D0%BE%D1%8F%D1%80%D0%B8%D0%BD_%D0%9E%D1%80%D1%88%D0%B0_(%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2)>
* «Вадим» (1873), роман. Источник: <https://ru.wikisource.org/wiki/%D0%92%D0%B0%D0%B4%D0%B8%D0%BC_(%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2)>
* «Герой нашего времени» (1840), роман. Источник: <https://ru.wikisource.org/wiki/%D0%93%D0%B5%D1%80%D0%BE%D0%B9_%D0%BD%D0%B0%D1%88%D0%B5%D0%B3%D0%BE_%D0%B2%D1%80%D0%B5%D0%BC%D0%B5%D0%BD%D0%B8_(%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2)/1969_(%D0%A1%D0%9E)>
* «Два брата. Драма» (1880), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%94%D0%B2%D0%B0_%D0%B1%D1%80%D0%B0%D1%82%D0%B0._%D0%94%D1%80%D0%B0%D0%BC%D0%B0_(%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2)>
* «Демон» (1842), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%94%D0%B5%D0%BC%D0%BE%D0%BD_(%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2)>
* «Княгиня Лиговская» (1882), роман. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D0%BD%D1%8F%D0%B3%D0%B8%D0%BD%D1%8F_%D0%9B%D0%B8%D0%B3%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F_(%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2)>
* «Маскарад» (1842), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%9C%D0%B0%D1%81%D0%BA%D0%B0%D1%80%D0%B0%D0%B4_(%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2)>
* «Мцыри» (1838), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%9C%D1%86%D1%8B%D1%80%D0%B8_(%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2)>
* «Песня про царя Ивана Васильевича, молодого опричника и удалого купца Калашникова» (1838), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%B5%D1%81%D0%BD%D1%8F_%D0%BF%D1%80%D0%BE_%D1%86%D0%B0%D1%80%D1%8F_%D0%98%D0%B2%D0%B0%D0%BD%D0%B0_%D0%92%D0%B0%D1%81%D0%B8%D0%BB%D1%8C%D0%B5%D0%B2%D0%B8%D1%87%D0%B0,_%D0%BC%D0%BE%D0%BB%D0%BE%D0%B4%D0%BE%D0%B3%D0%BE_%D0%BE%D0%BF%D1%80%D0%B8%D1%87%D0%BD%D0%B8%D0%BA%D0%B0_%D0%B8_%D1%83%D0%B4%D0%B0%D0%BB%D0%BE%D0%B3%D0%BE_%D0%BA%D1%83%D0%BF%D1%86%D0%B0_%D0%9A%D0%B0%D0%BB%D0%B0%D1%88%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2%D0%B0_(%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2)/%D0%9F%D0%A1%D0%A1_1989_(%D0%A1%D0%9E)>
* «Стихотворения Лермонтова 1828—1836», стихи. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D1%82%D0%B8%D1%85%D0%BE%D1%82%D0%B2%D0%BE%D1%80%D0%B5%D0%BD%D0%B8%D1%8F_%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2%D0%B0_1828%E2%80%941836>
* «Стихотворения Лермонтова 1837—1841», стихи. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D1%82%D0%B8%D1%85%D0%BE%D1%82%D0%B2%D0%BE%D1%80%D0%B5%D0%BD%D0%B8%D1%8F_%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2%D0%B0_1837%E2%80%941841>
* «Странный человек» (1860), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D1%82%D1%80%D0%B0%D0%BD%D0%BD%D1%8B%D0%B9_%D1%87%D0%B5%D0%BB%D0%BE%D0%B2%D0%B5%D0%BA_(%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2)>
* «Тамбовская казначейша» (1838), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%A2%D0%B0%D0%BC%D0%B1%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F_%D0%BA%D0%B0%D0%B7%D0%BD%D0%B0%D1%87%D0%B5%D0%B9%D1%88%D0%B0_(%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2)/%D0%A1%D0%BE%D1%87._%D0%B2_6_%D1%82._1955_(%D0%A1%D0%9E)>
* «Штосс» (1841), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%A8%D1%82%D0%BE%D1%81%D1%81_(%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2)>

### Николай Лесков

* «Грабёж» (1887), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%93%D1%80%D0%B0%D0%B1%D1%91%D0%B6_(%D0%9B%D0%B5%D1%81%D0%BA%D0%BE%D0%B2)>
* «Железная воля» (1876), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%96%D0%B5%D0%BB%D0%B5%D0%B7%D0%BD%D0%B0%D1%8F_%D0%B2%D0%BE%D0%BB%D1%8F_(%D0%9B%D0%B5%D1%81%D0%BA%D0%BE%D0%B2)>
* «Запечатленный ангел» (1873), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%97%D0%B0%D0%BF%D0%B5%D1%87%D0%B0%D1%82%D0%BB%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9_%D0%B0%D0%BD%D0%B3%D0%B5%D0%BB_(%D0%9B%D0%B5%D1%81%D0%BA%D0%BE%D0%B2)>
* «Левша» (1881), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9B%D0%B5%D0%B2%D1%88%D0%B0_(%D0%9B%D0%B5%D1%81%D0%BA%D0%BE%D0%B2)/%D0%9F%D0%A1%D0%A1_1902%E2%80%941903_(%D0%92%D0%A2)>
* «Леди Макбет Мценского уезда» (1865), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9B%D0%B5%D0%B4%D0%B8_%D0%9C%D0%B0%D0%BA%D0%B1%D0%B5%D1%82_%D0%9C%D1%86%D0%B5%D0%BD%D1%81%D0%BA%D0%BE%D0%B3%D0%BE_%D1%83%D0%B5%D0%B7%D0%B4%D0%B0_(%D0%9B%D0%B5%D1%81%D0%BA%D0%BE%D0%B2)>
* «Несмертельный Голован» (1880), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9D%D0%B5%D1%81%D0%BC%D0%B5%D1%80%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9_%D0%93%D0%BE%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD_(%D0%9B%D0%B5%D1%81%D0%BA%D0%BE%D0%B2)>
* «Однодум» (1880), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9E%D0%B4%D0%BD%D0%BE%D0%B4%D1%83%D0%BC_(%D0%9B%D0%B5%D1%81%D0%BA%D0%BE%D0%B2)>
* «Очарованный странник» (1873), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9E%D1%87%D0%B0%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B9_%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%BD%D0%B8%D0%BA_(%D0%9B%D0%B5%D1%81%D0%BA%D0%BE%D0%B2)>
* «Пугало» (1885), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D1%83%D0%B3%D0%B0%D0%BB%D0%BE_(%D0%9B%D0%B5%D1%81%D0%BA%D0%BE%D0%B2)>
* «Тупейный художник» (1883), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%A2%D1%83%D0%BF%D0%B5%D0%B9%D0%BD%D1%8B%D0%B9_%D1%85%D1%83%D0%B4%D0%BE%D0%B6%D0%BD%D0%B8%D0%BA_(%D0%9B%D0%B5%D1%81%D0%BA%D0%BE%D0%B2)>
* «Чертогон» (1879), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%A7%D0%B5%D1%80%D1%82%D0%BE%D0%B3%D0%BE%D0%BD_(%D0%9B%D0%B5%D1%81%D0%BA%D0%BE%D0%B2)>

### Дмитрий Мамин-Сибиряк

* «Вертел» (1885), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%92%D0%B5%D1%80%D1%82%D0%B5%D0%BB_(%D0%9C%D0%B0%D0%BC%D0%B8%D0%BD-%D0%A1%D0%B8%D0%B1%D0%B8%D1%80%D1%8F%D0%BA)>
* «Горное гнездо» (1884), роман. Источник: <https://ru.wikisource.org/wiki/%D0%93%D0%BE%D1%80%D0%BD%D0%BE%D0%B5_%D0%B3%D0%BD%D0%B5%D0%B7%D0%B4%D0%BE_(%D0%9C%D0%B0%D0%BC%D0%B8%D0%BD-%D0%A1%D0%B8%D0%B1%D0%B8%D1%80%D1%8F%D0%BA)>
* «Дикое счастье» (1884), роман. Источник: <https://ru.wikisource.org/wiki/%D0%94%D0%B8%D0%BA%D0%BE%D0%B5_%D1%81%D1%87%D0%B0%D1%81%D1%82%D1%8C%D0%B5_(%D0%9C%D0%B0%D0%BC%D0%B8%D0%BD-%D0%A1%D0%B8%D0%B1%D0%B8%D1%80%D1%8F%D0%BA)>
* «Емеля-охотник» (1884), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%95%D0%BC%D0%B5%D0%BB%D1%8F-%D0%BE%D1%85%D0%BE%D1%82%D0%BD%D0%B8%D0%BA_(%D0%9C%D0%B0%D0%BC%D0%B8%D0%BD-%D0%A1%D0%B8%D0%B1%D0%B8%D1%80%D1%8F%D0%BA)>
* «Зимовье на Студёной» (1885), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%97%D0%B8%D0%BC%D0%BE%D0%B2%D1%8C%D0%B5_%D0%BD%D0%B0_%D0%A1%D1%82%D1%83%D0%B4%D1%91%D0%BD%D0%BE%D0%B9_(%D0%9C%D0%B0%D0%BC%D0%B8%D0%BD-%D0%A1%D0%B8%D0%B1%D0%B8%D1%80%D1%8F%D0%BA)>
* «Золото» (1892), роман. Источник: <https://ru.wikisource.org/wiki/%D0%97%D0%BE%D0%BB%D0%BE%D1%82%D0%BE_(%D0%9C%D0%B0%D0%BC%D0%B8%D0%BD-%D0%A1%D0%B8%D0%B1%D0%B8%D1%80%D1%8F%D0%BA)>
* «Медведко» (1891), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9C%D0%B5%D0%B4%D0%B2%D0%B5%D0%B4%D0%BA%D0%BE_(%D0%9C%D0%B0%D0%BC%D0%B8%D0%BD-%D0%A1%D0%B8%D0%B1%D0%B8%D1%80%D1%8F%D0%BA)>
* «Постойко» (1891), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%BE%D1%81%D1%82%D0%BE%D0%B9%D0%BA%D0%BE_(%D0%9C%D0%B0%D0%BC%D0%B8%D0%BD-%D0%A1%D0%B8%D0%B1%D0%B8%D1%80%D1%8F%D0%BA)>
* «Приваловские миллионы» (1883), роман. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D1%80%D0%B8%D0%B2%D0%B0%D0%BB%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B5_%D0%BC%D0%B8%D0%BB%D0%BB%D0%B8%D0%BE%D0%BD%D1%8B_(%D0%9C%D0%B0%D0%BC%D0%B8%D0%BD-%D0%A1%D0%B8%D0%B1%D0%B8%D1%80%D1%8F%D0%BA)>
* «Приёмыш» (1891), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D1%80%D0%B8%D1%91%D0%BC%D1%8B%D1%88_(%D0%9C%D0%B0%D0%BC%D0%B8%D0%BD-%D0%A1%D0%B8%D0%B1%D0%B8%D1%80%D1%8F%D0%BA)>
* «Серая Шейка» (1891), сказка. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%B5%D1%80%D0%B0%D1%8F_%D1%88%D0%B5%D0%B9%D0%BA%D0%B0_(%D0%9C%D0%B0%D0%BC%D0%B8%D0%BD-%D0%A1%D0%B8%D0%B1%D0%B8%D1%80%D1%8F%D0%BA)>
* «Сказка про храброго Зайца — длинные уши, косые глаза, короткий хвост», сказка. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%BA%D0%B0%D0%B7%D0%BA%D0%B0_%D0%BF%D1%80%D0%BE_%D1%85%D1%80%D0%B0%D0%B1%D1%80%D0%BE%D0%B3%D0%BE_%D0%97%D0%B0%D0%B9%D1%86%D0%B0_%E2%80%94_%D0%B4%D0%BB%D0%B8%D0%BD%D0%BD%D1%8B%D0%B5_%D1%83%D1%88%D0%B8,_%D0%BA%D0%BE%D1%81%D1%8B%D0%B5_%D0%B3%D0%BB%D0%B0%D0%B7%D0%B0,_%D0%BA%D0%BE%D1%80%D0%BE%D1%82%D0%BA%D0%B8%D0%B9_%D1%85%D0%B2%D0%BE%D1%81%D1%82_(%D0%9C%D0%B0%D0%BC%D0%B8%D0%BD-%D0%A1%D0%B8%D0%B1%D0%B8%D1%80%D1%8F%D0%BA)>
* «Три конца» (1890), роман. Источник: <https://ru.wikisource.org/wiki/%D0%A2%D1%80%D0%B8_%D0%BA%D0%BE%D0%BD%D1%86%D0%B0_(%D0%9C%D0%B0%D0%BC%D0%B8%D0%BD-%D0%A1%D0%B8%D0%B1%D0%B8%D1%80%D1%8F%D0%BA)>
* «Хлеб» (1895), роман. Источник: <https://ru.wikisource.org/wiki/%D0%A5%D0%BB%D0%B5%D0%B1_(%D0%9C%D0%B0%D0%BC%D0%B8%D0%BD-%D0%A1%D0%B8%D0%B1%D0%B8%D1%80%D1%8F%D0%BA)>

### Николай Некрасов

* «Дедушка» (1870), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%94%D0%B5%D0%B4%D1%83%D1%88%D0%BA%D0%B0_(%D0%9D%D0%B5%D0%BA%D1%80%D0%B0%D1%81%D0%BE%D0%B2)>
* «Дедушка Мазай и зайцы» (1871), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D1%82%D0%B8%D1%85%D0%BE%D1%82%D0%B2%D0%BE%D1%80%D0%B5%D0%BD%D0%B8%D1%8F,_%D0%BF%D0%BE%D1%81%D0%B2%D1%8F%D1%89%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5_%D1%80%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%BC_%D0%B4%D0%B5%D1%82%D1%8F%D0%BC_(%D0%9D%D0%B5%D0%BA%D1%80%D0%B0%D1%81%D0%BE%D0%B2)/%D0%94%D0%B5%D0%B4%D1%83%D1%88%D0%BA%D0%B0_%D0%9C%D0%B0%D0%B7%D0%B0%D0%B9_%D0%B8_%D0%B7%D0%B0%D0%B9%D1%86%D1%8B>
* «Железная дорога» (1865), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%96%D0%B5%D0%BB%D0%B5%D0%B7%D0%BD%D0%B0%D1%8F_%D0%B4%D0%BE%D1%80%D0%BE%D0%B3%D0%B0_(%D0%9D%D0%B5%D0%BA%D1%80%D0%B0%D1%81%D0%BE%D0%B2)>
* «Кому на Руси жить хорошо» (1863), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D0%BE%D0%BC%D1%83_%D0%BD%D0%B0_%D0%A0%D1%83%D1%81%D0%B8_%D0%B6%D0%B8%D1%82%D1%8C_%D1%85%D0%BE%D1%80%D0%BE%D1%88%D0%BE_(%D0%9D%D0%B5%D0%BA%D1%80%D0%B0%D1%81%D0%BE%D0%B2)>
* «Коробейники» (1861), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D0%BE%D1%80%D0%BE%D0%B1%D0%B5%D0%B9%D0%BD%D0%B8%D0%BA%D0%B8_(%D0%9D%D0%B5%D0%BA%D1%80%D0%B0%D1%81%D0%BE%D0%B2)>
* «Крестьянские дети» (1861), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D1%80%D0%B5%D1%81%D1%82%D1%8C%D1%8F%D0%BD%D1%81%D0%BA%D0%B8%D0%B5_%D0%B4%D0%B5%D1%82%D0%B8_(%D0%9D%D0%B5%D0%BA%D1%80%D0%B0%D1%81%D0%BE%D0%B2)>
* «Мороз, Красный нос» (1863), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%9C%D0%BE%D1%80%D0%BE%D0%B7,_%D0%9A%D1%80%D0%B0%D1%81%D0%BD%D1%8B%D0%B9_%D0%BD%D0%BE%D1%81_(%D0%9D%D0%B5%D0%BA%D1%80%D0%B0%D1%81%D0%BE%D0%B2)>
* «Несчастные» (1856), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%9D%D0%B5%D1%81%D1%87%D0%B0%D1%81%D1%82%D0%BD%D1%8B%D0%B5_(%D0%9D%D0%B5%D0%BA%D1%80%D0%B0%D1%81%D0%BE%D0%B2)>
* «Размышления у парадного подъезда» (1860), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%A0%D0%B0%D0%B7%D0%BC%D1%8B%D1%88%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F_%D1%83_%D0%BF%D0%B0%D1%80%D0%B0%D0%B4%D0%BD%D0%BE%D0%B3%D0%BE_%D0%BF%D0%BE%D0%B4%D1%8A%D0%B5%D0%B7%D0%B4%D0%B0_(%D0%9D%D0%B5%D0%BA%D1%80%D0%B0%D1%81%D0%BE%D0%B2)>
* «Русские женщины» (1872), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B5_%D0%B6%D0%B5%D0%BD%D1%89%D0%B8%D0%BD%D1%8B_(%D0%9D%D0%B5%D0%BA%D1%80%D0%B0%D1%81%D0%BE%D0%B2)>
* «Рыцарь на час» (1863), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%A0%D1%8B%D1%86%D0%B0%D1%80%D1%8C_%D0%BD%D0%B0_%D1%87%D0%B0%D1%81_(%D0%9D%D0%B5%D0%BA%D1%80%D0%B0%D1%81%D0%BE%D0%B2)>
* «Саша» (1856), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%B0%D1%88%D0%B0_(%D0%9D%D0%B5%D0%BA%D1%80%D0%B0%D1%81%D0%BE%D0%B2)>
* «Современники» (1875), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%BE%D0%B2%D1%80%D0%B5%D0%BC%D0%B5%D0%BD%D0%BD%D0%B8%D0%BA%D0%B8_(%D0%9D%D0%B5%D0%BA%D1%80%D0%B0%D1%81%D0%BE%D0%B2)>
* «Тишина» (1857), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%A2%D0%B8%D1%88%D0%B8%D0%BD%D0%B0_(%D0%9D%D0%B5%D0%BA%D1%80%D0%B0%D1%81%D0%BE%D0%B2)>

### Владимир Одоевский

* «4338-й год» (1835), повесть. Источник: <https://ru.wikisource.org/wiki/4338-%D0%B9_%D0%B3%D0%BE%D0%B4_(%D0%9E%D0%B4%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Бал» (1835), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%91%D0%B0%D0%BB_(%D0%92.%D0%A4._%D0%9E%D0%B4%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Город без имени» (1843), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%93%D0%BE%D1%80%D0%BE%D0%B4_%D0%B1%D0%B5%D0%B7_%D0%B8%D0%BC%D0%B5%D0%BD%D0%B8_(%D0%9E%D0%B4%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Городок в табакерке» (1834), сказка. Источник: <https://ru.wikisource.org/wiki/%D0%93%D0%BE%D1%80%D0%BE%D0%B4%D0%BE%D0%BA_%D0%B2_%D1%82%D0%B0%D0%B1%D0%B0%D0%BA%D0%B5%D1%80%D0%BA%D0%B5_(%D0%9E%D0%B4%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Живой мертвец» (1838), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%96%D0%B8%D0%B2%D0%BE%D0%B9_%D0%BC%D0%B5%D1%80%D1%82%D0%B2%D0%B5%D1%86_(%D0%9E%D0%B4%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Импровизатор» (1832), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B5_%D0%BD%D0%BE%D1%87%D0%B8_(%D0%9E%D0%B4%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)/%D0%9D%D0%BE%D1%87%D1%8C_%D1%81%D0%B5%D0%B4%D1%8C%D0%BC%D0%B0%D1%8F._%D0%98%D0%BC%D0%BF%D1%80%D0%BE%D0%B2%D0%B8%D0%B7%D0%B0%D1%82%D0%BE%D1%80>
* «Индийская сказка о четырёх глухих» (1835), сказка. Источник: <https://ru.wikisource.org/wiki/%D0%98%D0%BD%D0%B4%D0%B8%D0%B9%D1%81%D0%BA%D0%B0%D1%8F_%D1%81%D0%BA%D0%B0%D0%B7%D0%BA%D0%B0_%D0%BE_%D1%87%D0%B5%D1%82%D1%8B%D1%80%D1%91%D1%85_%D0%B3%D0%BB%D1%83%D1%85%D0%B8%D1%85_(%D0%9E%D0%B4%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Княжна Зизи» (1839), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D0%BD%D1%8F%D0%B6%D0%BD%D0%B0_%D0%97%D0%B8%D0%B7%D0%B8_(%D0%9E%D0%B4%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Княжна Мими» (1835), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D0%BD%D1%8F%D0%B6%D0%BD%D0%B0_%D0%9C%D0%B8%D0%BC%D0%B8_(%D0%9E%D0%B4%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Косморама» (1840), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D0%BE%D1%81%D0%BC%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_(%D0%9E%D0%B4%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Мороз Иванович» (1841), сказка. Источник: <https://ru.wikisource.org/wiki/%D0%9C%D0%BE%D1%80%D0%BE%D0%B7_%D0%98%D0%B2%D0%B0%D0%BD%D0%BE%D0%B2%D0%B8%D1%87_(%D0%9E%D0%B4%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Русские ночи» (1835), роман. Источник: <https://ru.wikisource.org/wiki/%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B5_%D0%BD%D0%BE%D1%87%D0%B8_(%D0%9E%D0%B4%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Саламандра» (1844), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%B0%D0%BB%D0%B0%D0%BC%D0%B0%D0%BD%D0%B4%D1%80%D0%B0_(%D0%9E%D0%B4%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Сильфида» (1837), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%B8%D0%BB%D1%8C%D1%84%D0%B8%D0%B4%D0%B0_(%D0%9E%D0%B4%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Червячок» (1835), сказка. Источник: <https://ru.wikisource.org/wiki/%D0%A7%D0%B5%D1%80%D0%B2%D1%8F%D1%87%D0%BE%D0%BA_(%D0%9E%D0%B4%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>

### Александр Островский

* «Бедность не порок» (1854), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%91%D0%B5%D0%B4%D0%BD%D0%BE%D1%81%D1%82%D1%8C_%D0%BD%D0%B5_%D0%BF%D0%BE%D1%80%D0%BE%D0%BA_(%D0%9E%D1%81%D1%82%D1%80%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Без вины виноватые» (1884), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%91%D0%B5%D0%B7_%D0%B2%D0%B8%D0%BD%D1%8B_%D0%B2%D0%B8%D0%BD%D0%BE%D0%B2%D0%B0%D1%82%D1%8B%D0%B5_(%D0%9E%D1%81%D1%82%D1%80%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Бесприданница» (1879), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%91%D0%B5%D1%81%D0%BF%D1%80%D0%B8%D0%B4%D0%B0%D0%BD%D0%BD%D0%B8%D1%86%D0%B0_(%D0%9E%D1%81%D1%82%D1%80%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Бешеные деньги» (1870), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%91%D0%B5%D1%88%D0%B5%D0%BD%D1%8B%D0%B5_%D0%B4%D0%B5%D0%BD%D1%8C%D0%B3%D0%B8_(%D0%9E%D1%81%D1%82%D1%80%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Волки и овцы» (1875), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%92%D0%BE%D0%BB%D0%BA%D0%B8_%D0%B8_%D0%BE%D0%B2%D1%86%D1%8B_(%D0%9E%D1%81%D1%82%D1%80%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Горячее сердце» (1869), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%93%D0%BE%D1%80%D1%8F%D1%87%D0%B5%D0%B5_%D1%81%D0%B5%D1%80%D0%B4%D1%86%D0%B5_(%D0%9E%D1%81%D1%82%D1%80%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Гроза» (1860), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%93%D1%80%D0%BE%D0%B7%D0%B0_(%D0%9E%D1%81%D1%82%D1%80%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)/%D0%9F%D0%A1%D0%A1_1950_(%D0%A1%D0%9E)>
* «Доходное место» (1857), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%94%D0%BE%D1%85%D0%BE%D0%B4%D0%BD%D0%BE%D0%B5_%D0%BC%D0%B5%D1%81%D1%82%D0%BE_(%D0%9E%D1%81%D1%82%D1%80%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Лес» (1870), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%9B%D0%B5%D1%81_(%D0%9E%D1%81%D1%82%D1%80%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «На всякого мудреца довольно простоты» (1868), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%9D%D0%B0_%D0%B2%D1%81%D1%8F%D0%BA%D0%BE%D0%B3%D0%BE_%D0%BC%D1%83%D0%B4%D1%80%D0%B5%D1%86%D0%B0_%D0%B4%D0%BE%D0%B2%D0%BE%D0%BB%D1%8C%D0%BD%D0%BE_%D0%BF%D1%80%D0%BE%D1%81%D1%82%D0%BE%D1%82%D1%8B_(%D0%9E%D1%81%D1%82%D1%80%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Не в свои сани не садись» (1852), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%9D%D0%B5_%D0%B2_%D1%81%D0%B2%D0%BE%D0%B8_%D1%81%D0%B0%D0%BD%D0%B8_%D0%BD%D0%B5_%D1%81%D0%B0%D0%B4%D0%B8%D1%81%D1%8C_(%D0%9E%D1%81%D1%82%D1%80%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Последняя жертва» (1877), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%BE%D1%81%D0%BB%D0%B5%D0%B4%D0%BD%D1%8F%D1%8F_%D0%B6%D0%B5%D1%80%D1%82%D0%B2%D0%B0_(%D0%9E%D1%81%D1%82%D1%80%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Свои люди — сочтёмся» (1850), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%B2%D0%BE%D0%B8_%D0%BB%D1%8E%D0%B4%D0%B8_%E2%80%94_%D1%81%D0%BE%D1%87%D1%82%D1%91%D0%BC%D1%81%D1%8F_(%D0%9E%D1%81%D1%82%D1%80%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Снегурочка» (1873), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%BD%D0%B5%D0%B3%D1%83%D1%80%D0%BE%D1%87%D0%BA%D0%B0_(%D0%9E%D1%81%D1%82%D1%80%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Таланты и поклонники» (1882), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%A2%D0%B0%D0%BB%D0%B0%D0%BD%D1%82%D1%8B_%D0%B8_%D0%BF%D0%BE%D0%BA%D0%BB%D0%BE%D0%BD%D0%BD%D0%B8%D0%BA%D0%B8_(%D0%9E%D1%81%D1%82%D1%80%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>

### Алексей Писемский

* «Боярщина» (1858), роман. Источник: <https://ru.wikisource.org/wiki/%D0%91%D0%BE%D1%8F%D1%80%D1%89%D0%B8%D0%BD%D0%B0_(%D0%9F%D0%B8%D1%81%D0%B5%D0%BC%D1%81%D0%BA%D0%B8%D0%B9)>
* «Взбаламученное море» (1863), роман. Источник: <https://ru.wikisource.org/wiki/%D0%92%D0%B7%D0%B1%D0%B0%D0%BB%D0%B0%D0%BC%D1%83%D1%87%D0%B5%D0%BD%D0%BD%D0%BE%D0%B5_%D0%BC%D0%BE%D1%80%D0%B5_(%D0%9F%D0%B8%D1%81%D0%B5%D0%BC%D1%81%D0%BA%D0%B8%D0%B9)>
* «Горькая судьбина» (1859), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%93%D0%BE%D1%80%D1%8C%D0%BA%D0%B0%D1%8F_%D1%81%D1%83%D0%B4%D1%8C%D0%B1%D0%B8%D0%BD%D0%B0_(%D0%9F%D0%B8%D1%81%D0%B5%D0%BC%D1%81%D0%BA%D0%B8%D0%B9)>
* «Леший» (1853), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9B%D0%B5%D1%88%D0%B8%D0%B9_(%D0%9F%D0%B8%D1%81%D0%B5%D0%BC%D1%81%D0%BA%D0%B8%D0%B9)>
* «Питерщик» (1852), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%B8%D1%82%D0%B5%D1%80%D1%89%D0%B8%D0%BA_(%D0%9F%D0%B8%D1%81%D0%B5%D0%BC%D1%81%D0%BA%D0%B8%D0%B9)>
* «Плотничья артель» (1855), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%BB%D0%BE%D1%82%D0%BD%D0%B8%D1%87%D1%8C%D1%8F_%D0%B0%D1%80%D1%82%D0%B5%D0%BB%D1%8C_(%D0%9F%D0%B8%D1%81%D0%B5%D0%BC%D1%81%D0%BA%D0%B8%D0%B9)>
* «Тюфяк» (1850), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%A2%D1%8E%D1%84%D1%8F%D0%BA_(%D0%9F%D0%B8%D1%81%D0%B5%D0%BC%D1%81%D0%BA%D0%B8%D0%B9)>

### Антоний Погорельский

* «Двойник, или Мои вечера в Малороссии» (1828), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%94%D0%B2%D0%BE%D0%B9%D0%BD%D0%B8%D0%BA,_%D0%B8%D0%BB%D0%B8_%D0%9C%D0%BE%D0%B8_%D0%B2%D0%B5%D1%87%D0%B5%D1%80%D0%B0_%D0%B2_%D0%9C%D0%B0%D0%BB%D0%BE%D1%80%D0%BE%D1%81%D1%81%D0%B8%D0%B8_(%D0%9F%D0%BE%D0%B3%D0%BE%D1%80%D0%B5%D0%BB%D1%8C%D1%81%D0%BA%D0%B8%D0%B9)>
* «Монастырка» (1833), роман. Источник: <https://ru.wikisource.org/wiki/%D0%9C%D0%BE%D0%BD%D0%B0%D1%81%D1%82%D1%8B%D1%80%D0%BA%D0%B0_(%D0%9F%D0%BE%D0%B3%D0%BE%D1%80%D0%B5%D0%BB%D1%8C%D1%81%D0%BA%D0%B8%D0%B9)>
* «Чёрная курица, или Подземные жители» (1829), сказка. Источник: <https://ru.wikisource.org/wiki/%D0%A7%D1%91%D1%80%D0%BD%D0%B0%D1%8F_%D0%BA%D1%83%D1%80%D0%B8%D1%86%D0%B0,_%D0%B8%D0%BB%D0%B8_%D0%9F%D0%BE%D0%B4%D0%B7%D0%B5%D0%BC%D0%BD%D1%8B%D0%B5_%D0%B6%D0%B8%D1%82%D0%B5%D0%BB%D0%B8_(%D0%9F%D0%BE%D0%B3%D0%BE%D1%80%D0%B5%D0%BB%D1%8C%D1%81%D0%BA%D0%B8%D0%B9)>

### Николай Помяловский

* «Мещанское счастье» (1861), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9C%D0%B5%D1%89%D0%B0%D0%BD%D1%81%D0%BA%D0%BE%D0%B5_%D1%81%D1%87%D0%B0%D1%81%D1%82%D1%8C%D0%B5_(%D0%9F%D0%BE%D0%BC%D1%8F%D0%BB%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Молотов» (1861), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9C%D0%BE%D0%BB%D0%BE%D1%82%D0%BE%D0%B2_(%D0%9F%D0%BE%D0%BC%D1%8F%D0%BB%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Очерки бурсы» (1863), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9E%D1%87%D0%B5%D1%80%D0%BA%D0%B8_%D0%B1%D1%83%D1%80%D1%81%D1%8B_(%D0%9F%D0%BE%D0%BC%D1%8F%D0%BB%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>

### Александр Пушкин

* «Арап Петра Великого» (1837), роман. Источник: <https://ru.wikisource.org/wiki/%D0%90%D1%80%D0%B0%D0%BF_%D0%9F%D0%B5%D1%82%D1%80%D0%B0_%D0%92%D0%B5%D0%BB%D0%B8%D0%BA%D0%BE%D0%B3%D0%BE_(%D0%9F%D1%83%D1%88%D0%BA%D0%B8%D0%BD)>
* «Барышня-крестьянка» (1831), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%BE%D0%B2%D0%B5%D1%81%D1%82%D0%B8_%D0%BF%D0%BE%D0%BA%D0%BE%D0%B9%D0%BD%D0%BE%D0%B3%D0%BE_%D0%98%D0%B2%D0%B0%D0%BD%D0%B0_%D0%9F%D0%B5%D1%82%D1%80%D0%BE%D0%B2%D0%B8%D1%87%D0%B0_%D0%91%D0%B5%D0%BB%D0%BA%D0%B8%D0%BD%D0%B0_(%D0%9F%D1%83%D1%88%D0%BA%D0%B8%D0%BD)/%D0%91%D0%B0%D1%80%D1%8B%D1%88%D0%BD%D1%8F-%D0%BA%D1%80%D0%B5%D1%81%D1%82%D1%8C%D1%8F%D0%BD%D0%BA%D0%B0>
* «Борис Годунов», пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%91%D0%BE%D1%80%D0%B8%D1%81_%D0%93%D0%BE%D0%B4%D1%83%D0%BD%D0%BE%D0%B2_(%D0%9F%D1%83%D1%88%D0%BA%D0%B8%D0%BD)>
* «Выстрел» (1831), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%BE%D0%B2%D0%B5%D1%81%D1%82%D0%B8_%D0%BF%D0%BE%D0%BA%D0%BE%D0%B9%D0%BD%D0%BE%D0%B3%D0%BE_%D0%98%D0%B2%D0%B0%D0%BD%D0%B0_%D0%9F%D0%B5%D1%82%D1%80%D0%BE%D0%B2%D0%B8%D1%87%D0%B0_%D0%91%D0%B5%D0%BB%D0%BA%D0%B8%D0%BD%D0%B0_(%D0%9F%D1%83%D1%88%D0%BA%D0%B8%D0%BD)/%D0%92%D1%8B%D1%81%D1%82%D1%80%D0%B5%D0%BB>
* «Гробовщик» (1831), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%BE%D0%B2%D0%B5%D1%81%D1%82%D0%B8_%D0%BF%D0%BE%D0%BA%D0%BE%D0%B9%D0%BD%D0%BE%D0%B3%D0%BE_%D0%98%D0%B2%D0%B0%D0%BD%D0%B0_%D0%9F%D0%B5%D1%82%D1%80%D0%BE%D0%B2%D0%B8%D1%87%D0%B0_%D0%91%D0%B5%D0%BB%D0%BA%D0%B8%D0%BD%D0%B0_(%D0%9F%D1%83%D1%88%D0%BA%D0%B8%D0%BD)/%D0%93%D1%80%D0%BE%D0%B1%D0%BE%D0%B2%D1%89%D0%B8%D0%BA>
* «Дубровский» (1833), роман. Источник: <https://ru.wikisource.org/wiki/%D0%94%D1%83%D0%B1%D1%80%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9_(%D0%9F%D1%83%D1%88%D0%BA%D0%B8%D0%BD)>
* «Евгений Онегин» (1830), роман. Источник: <https://ru.wikisource.org/wiki/%D0%95%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D0%B9_%D0%9E%D0%BD%D0%B5%D0%B3%D0%B8%D0%BD_(%D0%9F%D1%83%D1%88%D0%BA%D0%B8%D0%BD)/%D0%A1%D0%A1_1959_(%D0%A1%D0%9E)>
* «Каменный гость» (1830), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D0%B0%D0%BC%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9_%D0%B3%D0%BE%D1%81%D1%82%D1%8C_(%D0%9F%D1%83%D1%88%D0%BA%D0%B8%D0%BD)>
* «Капитанская дочка» (1836), роман. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D0%B0%D0%BF%D0%B8%D1%82%D0%B0%D0%BD%D1%81%D0%BA%D0%B0%D1%8F_%D0%B4%D0%BE%D1%87%D0%BA%D0%B0_(%D0%9F%D1%83%D1%88%D0%BA%D0%B8%D0%BD)/1960_(%D0%A1%D0%9E)>
* «Медный всадник» (1834), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%9C%D0%B5%D0%B4%D0%BD%D1%8B%D0%B9_%D0%B2%D1%81%D0%B0%D0%B4%D0%BD%D0%B8%D0%BA_(%D0%9F%D1%83%D1%88%D0%BA%D0%B8%D0%BD)>
* «Метель» (1831), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%BE%D0%B2%D0%B5%D1%81%D1%82%D0%B8_%D0%BF%D0%BE%D0%BA%D0%BE%D0%B9%D0%BD%D0%BE%D0%B3%D0%BE_%D0%98%D0%B2%D0%B0%D0%BD%D0%B0_%D0%9F%D0%B5%D1%82%D1%80%D0%BE%D0%B2%D0%B8%D1%87%D0%B0_%D0%91%D0%B5%D0%BB%D0%BA%D0%B8%D0%BD%D0%B0_(%D0%9F%D1%83%D1%88%D0%BA%D0%B8%D0%BD)/%D0%9C%D0%B5%D1%82%D0%B5%D0%BB%D1%8C>
* «Моцарт и Сальери» (1832), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%9C%D0%BE%D1%86%D0%B0%D1%80%D1%82_%D0%B8_%D0%A1%D0%B0%D0%BB%D1%8C%D0%B5%D1%80%D0%B8_(%D0%9F%D1%83%D1%88%D0%BA%D0%B8%D0%BD)>
* «Пиковая дама» (1834), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%B8%D0%BA%D0%BE%D0%B2%D0%B0%D1%8F_%D0%B4%D0%B0%D0%BC%D0%B0_(%D0%9F%D1%83%D1%88%D0%BA%D0%B8%D0%BD)>
* «Пир во время чумы» (1832), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%B8%D1%80_%D0%B2%D0%BE_%D0%B2%D1%80%D0%B5%D0%BC%D1%8F_%D1%87%D1%83%D0%BC%D1%8B_(%D0%9F%D1%83%D1%88%D0%BA%D0%B8%D0%BD)>
* «Скупой рыцарь» (1836), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%BA%D1%83%D0%BF%D0%BE%D0%B9_%D1%80%D1%8B%D1%86%D0%B0%D1%80%D1%8C_(%D0%9F%D1%83%D1%88%D0%BA%D0%B8%D0%BD)>
* «Станционный смотритель» (1831), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%BE%D0%B2%D0%B5%D1%81%D1%82%D0%B8_%D0%BF%D0%BE%D0%BA%D0%BE%D0%B9%D0%BD%D0%BE%D0%B3%D0%BE_%D0%98%D0%B2%D0%B0%D0%BD%D0%B0_%D0%9F%D0%B5%D1%82%D1%80%D0%BE%D0%B2%D0%B8%D1%87%D0%B0_%D0%91%D0%B5%D0%BB%D0%BA%D0%B8%D0%BD%D0%B0_(%D0%9F%D1%83%D1%88%D0%BA%D0%B8%D0%BD)/%D0%A1%D1%82%D0%B0%D0%BD%D1%86%D0%B8%D0%BE%D0%BD%D0%BD%D1%8B%D0%B9_%D1%81%D0%BC%D0%BE%D1%82%D1%80%D0%B8%D1%82%D0%B5%D0%BB%D1%8C>

### Александр Радищев

* «Вольность» (1781), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%92%D0%BE%D0%BB%D1%8C%D0%BD%D0%BE%D1%81%D1%82%D1%8C_(%D0%A0%D0%B0%D0%B4%D0%B8%D1%89%D0%B5%D0%B2)>
* «Путешествие из Петербурга в Москву» (1790), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D1%83%D1%82%D0%B5%D1%88%D0%B5%D1%81%D1%82%D0%B2%D0%B8%D0%B5_%D0%B8%D0%B7_%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3%D0%B0_%D0%B2_%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D1%83_(%D0%A0%D0%B0%D0%B4%D0%B8%D1%89%D0%B5%D0%B2)>

### Михаил Салтыков-Щедрин

* «Богатырь» (1922), сказка. Источник: <https://ru.wikisource.org/wiki/%D0%91%D0%BE%D0%B3%D0%B0%D1%82%D1%8B%D1%80%D1%8C_(%D0%A1%D0%B0%D0%BB%D1%82%D1%8B%D0%BA%D0%BE%D0%B2-%D0%A9%D0%B5%D0%B4%D1%80%D0%B8%D0%BD)>
* «Господа Головлёвы» (1875), роман. Источник: <https://ru.wikisource.org/wiki/%D0%93%D0%BE%D1%81%D0%BF%D0%BE%D0%B4%D0%B0_%D0%93%D0%BE%D0%BB%D0%BE%D0%B2%D0%BB%D1%91%D0%B2%D1%8B_(%D0%A1%D0%B0%D0%BB%D1%82%D1%8B%D0%BA%D0%BE%D0%B2-%D0%A9%D0%B5%D0%B4%D1%80%D0%B8%D0%BD)>
* «Дикий помещик» (1869), сказка. Источник: <https://ru.wikisource.org/wiki/%D0%94%D0%B8%D0%BA%D0%B8%D0%B9_%D0%BF%D0%BE%D0%BC%D0%B5%D1%89%D0%B8%D0%BA_(%D0%A1%D0%B0%D0%BB%D1%82%D1%8B%D0%BA%D0%BE%D0%B2-%D0%A9%D0%B5%D0%B4%D1%80%D0%B8%D0%BD)>
* «Добродетели и пороки» (1884), сказка. Источник: <https://ru.wikisource.org/wiki/%D0%94%D0%BE%D0%B1%D1%80%D0%BE%D0%B4%D0%B5%D1%82%D0%B5%D0%BB%D0%B8_%D0%B8_%D0%9F%D0%BE%D1%80%D0%BE%D0%BA%D0%B8_(%D0%A1%D0%B0%D0%BB%D1%82%D1%8B%D0%BA%D0%BE%D0%B2-%D0%A9%D0%B5%D0%B4%D1%80%D0%B8%D0%BD)>
* «Здравомысленный заяц» (1885), сказка. Источник: <https://ru.wikisource.org/wiki/%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D0%BE%D0%BC%D1%8B%D1%81%D0%BB%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9_%D0%B7%D0%B0%D1%8F%D1%86_(%D0%A1%D0%B0%D0%BB%D1%82%D1%8B%D0%BA%D0%BE%D0%B2-%D0%A9%D0%B5%D0%B4%D1%80%D0%B8%D0%BD)>
* «История одного города» (1869), роман. Источник: <https://ru.wikisource.org/wiki/%D0%98%D1%81%D1%82%D0%BE%D1%80%D0%B8%D1%8F_%D0%BE%D0%B4%D0%BD%D0%BE%D0%B3%D0%BE_%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0_(%D0%A1%D0%B0%D0%BB%D1%82%D1%8B%D0%BA%D0%BE%D0%B2-%D0%A9%D0%B5%D0%B4%D1%80%D0%B8%D0%BD)>
* «Карась-идеалист» (1884), сказка. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D0%B0%D1%80%D0%B0%D1%81%D1%8C-%D0%B8%D0%B4%D0%B5%D0%B0%D0%BB%D0%B8%D1%81%D1%82_(%D0%A1%D0%B0%D0%BB%D1%82%D1%8B%D0%BA%D0%BE%D0%B2-%D0%A9%D0%B5%D0%B4%D1%80%D0%B8%D0%BD)>
* «Коняга» (1855), сказка. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D0%BE%D0%BD%D1%8F%D0%B3%D0%B0_(%D0%A1%D0%B0%D0%BB%D1%82%D1%8B%D0%BA%D0%BE%D0%B2-%D0%A9%D0%B5%D0%B4%D1%80%D0%B8%D0%BD)>
* «Медведь на воеводстве» (1884), сказка. Источник: <https://ru.wikisource.org/wiki/%D0%9C%D0%B5%D0%B4%D0%B2%D0%B5%D0%B4%D1%8C_%D0%BD%D0%B0_%D0%B2%D0%BE%D0%B5%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B5_(%D0%A1%D0%B0%D0%BB%D1%82%D1%8B%D0%BA%D0%BE%D0%B2-%D0%A9%D0%B5%D0%B4%D1%80%D0%B8%D0%BD)>
* «Орёл-меценат» (1886), сказка. Источник: <https://ru.wikisource.org/wiki/%D0%9E%D1%80%D1%91%D0%BB-%D0%BC%D0%B5%D1%86%D0%B5%D0%BD%D0%B0%D1%82_(%D0%A1%D0%B0%D0%BB%D1%82%D1%8B%D0%BA%D0%BE%D0%B2-%D0%A9%D0%B5%D0%B4%D1%80%D0%B8%D0%BD)>
* «Повесть о том, как один мужик двух генералов прокормил» (1869), сказка. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%BE%D0%B2%D0%B5%D1%81%D1%82%D1%8C_%D0%BE_%D1%82%D0%BE%D0%BC,_%D0%BA%D0%B0%D0%BA_%D0%BE%D0%B4%D0%B8%D0%BD_%D0%BC%D1%83%D0%B6%D0%B8%D0%BA_%D0%B4%D0%B2%D1%83%D1%85_%D0%B3%D0%B5%D0%BD%D0%B5%D1%80%D0%B0%D0%BB%D0%BE%D0%B2_%D0%BF%D1%80%D0%BE%D0%BA%D0%BE%D1%80%D0%BC%D0%B8%D0%BB_(%D0%A1%D0%B0%D0%BB%D1%82%D1%8B%D0%BA%D0%BE%D0%B2-%D0%A9%D0%B5%D0%B4%D1%80%D0%B8%D0%BD)>
* «Премудрый пискарь» (1883), сказка. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D1%80%D0%B5%D0%BC%D1%83%D0%B4%D1%80%D1%8B%D0%B9_%D0%BF%D0%B8%D1%81%D0%BA%D0%B0%D1%80%D1%8C_(%D0%A1%D0%B0%D0%BB%D1%82%D1%8B%D0%BA%D0%BE%D0%B2-%D0%A9%D0%B5%D0%B4%D1%80%D0%B8%D0%BD)>
* «Пропала совесть» (1869), сказка. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D1%80%D0%BE%D0%BF%D0%B0%D0%BB%D0%B0_%D1%81%D0%BE%D0%B2%D0%B5%D1%81%D1%82%D1%8C_(%D0%A1%D0%B0%D0%BB%D1%82%D1%8B%D0%BA%D0%BE%D0%B2-%D0%A9%D0%B5%D0%B4%D1%80%D0%B8%D0%BD)>
* «Самоотверженный заяц» (1883), сказка. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%B0%D0%BC%D0%BE%D0%BE%D1%82%D0%B2%D0%B5%D1%80%D0%B6%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9_%D0%B7%D0%B0%D1%8F%D1%86_(%D0%A1%D0%B0%D0%BB%D1%82%D1%8B%D0%BA%D0%BE%D0%B2-%D0%A9%D0%B5%D0%B4%D1%80%D0%B8%D0%BD)>
* «Христова ночь» (1886), сказка. Источник: <https://ru.wikisource.org/wiki/%D0%A5%D1%80%D0%B8%D1%81%D1%82%D0%BE%D0%B2%D0%B0_%D0%BD%D0%BE%D1%87%D1%8C_(%D0%A1%D0%B0%D0%BB%D1%82%D1%8B%D0%BA%D0%BE%D0%B2-%D0%A9%D0%B5%D0%B4%D1%80%D0%B8%D0%BD)>

### Фёдор Сологуб

* «Капли крови» (1905), роман. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D0%B0%D0%BF%D0%BB%D0%B8_%D0%BA%D1%80%D0%BE%D0%B2%D0%B8_(%D0%A1%D0%BE%D0%BB%D0%BE%D0%B3%D1%83%D0%B1)>
* «Королева Ортруда» (1909), роман. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D0%BE%D1%80%D0%BE%D0%BB%D0%B5%D0%B2%D0%B0_%D0%9E%D1%80%D1%82%D1%80%D1%83%D0%B4%D0%B0_(%D0%A1%D0%BE%D0%BB%D0%BE%D0%B3%D1%83%D0%B1)>
* «Мелкий бес» (1908), роман. Источник: <https://ru.wikisource.org/wiki/%D0%9C%D0%B5%D0%BB%D0%BA%D0%B8%D0%B9_%D0%B1%D0%B5%D1%81_(%D0%A1%D0%BE%D0%BB%D0%BE%D0%B3%D1%83%D0%B1)>
* «Победа смерти» (1907), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%BE%D0%B1%D0%B5%D0%B4%D0%B0_%D0%A1%D0%BC%D0%B5%D1%80%D1%82%D0%B8_(%D0%A1%D0%BE%D0%BB%D0%BE%D0%B3%D1%83%D0%B1)>
* «Тяжёлые сны» (1895), роман. Источник: <https://ru.wikisource.org/wiki/%D0%A2%D1%8F%D0%B6%D1%91%D0%BB%D1%8B%D0%B5_%D1%81%D0%BD%D1%8B_(%D0%A1%D0%BE%D0%BB%D0%BE%D0%B3%D1%83%D0%B1)>
* «Червяк» (1896), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%A7%D0%B5%D1%80%D0%B2%D1%8F%D0%BA_(%D0%A1%D0%BE%D0%BB%D0%BE%D0%B3%D1%83%D0%B1)>

### Константин Станюкович

* «Беглец» (1886), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%91%D0%B5%D0%B3%D0%BB%D0%B5%D1%86_(%D0%A1%D1%82%D0%B0%D0%BD%D1%8E%D0%BA%D0%BE%D0%B2%D0%B8%D1%87)>
* «В шторм» (1890), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%92_%D1%88%D1%82%D0%BE%D1%80%D0%BC_(%D0%A1%D1%82%D0%B0%D0%BD%D1%8E%D0%BA%D0%BE%D0%B2%D0%B8%D1%87)>
* «Василий Иванович» (1886), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%92%D0%B0%D1%81%D0%B8%D0%BB%D0%B8%D0%B9_%D0%98%D0%B2%D0%B0%D0%BD%D0%BE%D0%B2%D0%B8%D1%87_(%D0%A1%D1%82%D0%B0%D0%BD%D1%8E%D0%BA%D0%BE%D0%B2%D0%B8%D1%87)>
* «Вокруг света на «Коршуне»» (1895), роман. Источник: <https://ru.wikisource.org/wiki/%D0%92%D0%BE%D0%BA%D1%80%D1%83%D0%B3_%D1%81%D0%B2%D0%B5%D1%82%D0%B0_%D0%BD%D0%B0_%C2%AB%D0%9A%D0%BE%D1%80%D1%88%D1%83%D0%BD%D0%B5%C2%BB_(%D0%A1%D1%82%D0%B0%D0%BD%D1%8E%D0%BA%D0%BE%D0%B2%D0%B8%D1%87)>
* «Грозный адмирал» (1891), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%93%D1%80%D0%BE%D0%B7%D0%BD%D1%8B%D0%B9_%D0%B0%D0%B4%D0%BC%D0%B8%D1%80%D0%B0%D0%BB_(%D0%A1%D1%82%D0%B0%D0%BD%D1%8E%D0%BA%D0%BE%D0%B2%D0%B8%D1%87)>
* «Куцый» (1894), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D1%83%D1%86%D1%8B%D0%B9_(%D0%A1%D1%82%D0%B0%D0%BD%D1%8E%D0%BA%D0%BE%D0%B2%D0%B8%D1%87)>
* «Максимка» (1896), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9C%D0%B0%D0%BA%D1%81%D0%B8%D0%BC%D0%BA%D0%B0_(%D0%A1%D1%82%D0%B0%D0%BD%D1%8E%D0%BA%D0%BE%D0%B2%D0%B8%D1%87)>
* «Матросик» (1898), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9C%D0%B0%D1%82%D1%80%D0%BE%D1%81%D0%B8%D0%BA_(%D0%A1%D1%82%D0%B0%D0%BD%D1%8E%D0%BA%D0%BE%D0%B2%D0%B8%D1%87)>
* «Месть» (1893), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9C%D0%B5%D1%81%D1%82%D1%8C_(%D0%A1%D1%82%D0%B0%D0%BD%D1%8E%D0%BA%D0%BE%D0%B2%D0%B8%D1%87)>
* «Нянька» (1895), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9D%D1%8F%D0%BD%D1%8C%D0%BA%D0%B0_(%D0%A1%D1%82%D0%B0%D0%BD%D1%8E%D0%BA%D0%BE%D0%B2%D0%B8%D1%87)>
* «Пассажирка» (1892), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%B0%D1%81%D1%81%D0%B0%D0%B6%D0%B8%D1%80%D0%BA%D0%B0_(%D0%A1%D1%82%D0%B0%D0%BD%D1%8E%D0%BA%D0%BE%D0%B2%D0%B8%D1%87)>
* «Похождения одного матроса» (1899), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%BE%D1%85%D0%BE%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F_%D0%BE%D0%B4%D0%BD%D0%BE%D0%B3%D0%BE_%D0%BC%D0%B0%D1%82%D1%80%D0%BE%D1%81%D0%B0_(%D0%A1%D1%82%D0%B0%D0%BD%D1%8E%D0%BA%D0%BE%D0%B2%D0%B8%D1%87)>
* «Событие» (1902), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%BE%D0%B1%D1%8B%D1%82%D0%B8%D0%B5_(%D0%A1%D1%82%D0%B0%D0%BD%D1%8E%D0%BA%D0%BE%D0%B2%D0%B8%D1%87)>
* «Ужасный день» (1893), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%A3%D0%B6%D0%B0%D1%81%D0%BD%D1%8B%D0%B9_%D0%B4%D0%B5%D0%BD%D1%8C_(%D0%A1%D1%82%D0%B0%D0%BD%D1%8E%D0%BA%D0%BE%D0%B2%D0%B8%D1%87)>
* «Человек за бортом!» (1887), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%A7%D0%B5%D0%BB%D0%BE%D0%B2%D0%B5%D0%BA_%D0%B7%D0%B0_%D0%B1%D0%BE%D1%80%D1%82%D0%BE%D0%BC%21_(%D0%A1%D1%82%D0%B0%D0%BD%D1%8E%D0%BA%D0%BE%D0%B2%D0%B8%D1%87)>

### Александр Сухово-Кобылин

* «Дело» (1869), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%94%D0%B5%D0%BB%D0%BE_(%D0%A1%D1%83%D1%85%D0%BE%D0%B2%D0%BE-%D0%9A%D0%BE%D0%B1%D1%8B%D0%BB%D0%B8%D0%BD)>
* «Свадьба Кречинского» (1856), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%B2%D0%B0%D0%B4%D1%8C%D0%B1%D0%B0_%D0%9A%D1%80%D0%B5%D1%87%D0%B8%D0%BD%D1%81%D0%BA%D0%BE%D0%B3%D0%BE_(%D0%A1%D1%83%D1%85%D0%BE%D0%B2%D0%BE-%D0%9A%D0%BE%D0%B1%D1%8B%D0%BB%D0%B8%D0%BD)>
* «Смерть Тарелкина» (1869), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%BC%D0%B5%D1%80%D1%82%D1%8C_%D0%A2%D0%B0%D1%80%D0%B5%D0%BB%D0%BA%D0%B8%D0%BD%D0%B0_(%D0%A1%D1%83%D1%85%D0%BE%D0%B2%D0%BE-%D0%9A%D0%BE%D0%B1%D1%8B%D0%BB%D0%B8%D0%BD)>

### Лев Толстой

* «Анна Каренина» (1875), роман. Источник: <https://ru.wikisource.org/wiki/%D0%90%D0%BD%D0%BD%D0%B0_%D0%9A%D0%B0%D1%80%D0%B5%D0%BD%D0%B8%D0%BD%D0%B0_(%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B9)>
* «Война и мир» (1805), роман. Источник: <https://ru.wikisource.org/wiki/%D0%92%D0%BE%D0%B9%D0%BD%D0%B0_%D0%B8_%D0%BC%D0%B8%D1%80_(%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B9)>
* «Воскресение» (1889), роман. Источник: <https://ru.wikisource.org/wiki/%D0%92%D0%BE%D1%81%D0%BA%D1%80%D0%B5%D1%81%D0%B5%D0%BD%D0%B8%D0%B5_(%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B9)>
* «Детство» (1852), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%94%D0%B5%D1%82%D1%81%D1%82%D0%B2%D0%BE_(%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B9)>
* «Кавказский пленник», рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D0%B0%D0%B2%D0%BA%D0%B0%D0%B7%D1%81%D0%BA%D0%B8%D0%B9_%D0%BF%D0%BB%D0%B5%D0%BD%D0%BD%D0%B8%D0%BA_(%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B9)>
* «Казаки» (1863), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D0%B0%D0%B7%D0%B0%D0%BA%D0%B8_(%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B9)>
* «Крейцерова соната» (1889), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D1%80%D0%B5%D0%B9%D1%86%D0%B5%D1%80%D0%BE%D0%B2%D0%B0_%D1%81%D0%BE%D0%BD%D0%B0%D1%82%D0%B0_(%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B9)>
* «Отец Сергий» (1898), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9E%D1%82%D0%B5%D1%86_%D0%A1%D0%B5%D1%80%D0%B3%D0%B8%D0%B9_(%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B9)>
* «Отрочество» (1854), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9E%D1%82%D1%80%D0%BE%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%BE_(%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B9)>
* «Севастополь в августе 1855 года» (1855), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%B5%D0%B2%D0%B0%D1%81%D1%82%D0%BE%D0%BF%D0%BE%D0%BB%D1%8C_%D0%B2_%D0%B0%D0%B2%D0%B3%D1%83%D1%81%D1%82%D0%B5_1855_%D0%B3%D0%BE%D0%B4%D0%B0_(%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B9)>
* «Севастополь в декабре месяце» (1855), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%B5%D0%B2%D0%B0%D1%81%D1%82%D0%BE%D0%BF%D0%BE%D0%BB%D1%8C_%D0%B2_%D0%B4%D0%B5%D0%BA%D0%B0%D0%B1%D1%80%D0%B5_%D0%BC%D0%B5%D1%81%D1%8F%D1%86%D0%B5_(%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B9)>
* «Севастополь в мае» (1855), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%B5%D0%B2%D0%B0%D1%81%D1%82%D0%BE%D0%BF%D0%BE%D0%BB%D1%8C_%D0%B2_%D0%BC%D0%B0%D0%B5_(%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B9)>
* «Смерть Ивана Ильича» (1886), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%BC%D0%B5%D1%80%D1%82%D1%8C_%D0%98%D0%B2%D0%B0%D0%BD%D0%B0_%D0%98%D0%BB%D1%8C%D0%B8%D1%87%D0%B0_(%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B9)>
* «Хаджи-Мурат» (1904), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%A5%D0%B0%D0%B4%D0%B6%D0%B8-%D0%9C%D1%83%D1%80%D0%B0%D1%82_(%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B9)>
* «Юность» (1857), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%AE%D0%BD%D0%BE%D1%81%D1%82%D1%8C_(%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B9)>

### Алексей Константинович Толстой

* «Алхимик» (1867), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%90%D0%BB%D1%85%D0%B8%D0%BC%D0%B8%D0%BA_(%D0%90._%D0%9A._%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B9)>
* «Амена» (1846), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%90%D0%BC%D0%B5%D0%BD%D0%B0_(%D0%90._%D0%9A._%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B9)>
* «Встреча через триста лет» (1839), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%92%D1%81%D1%82%D1%80%D0%B5%D1%87%D0%B0_%D1%87%D0%B5%D1%80%D0%B5%D0%B7_%D1%82%D1%80%D0%B8%D1%81%D1%82%D0%B0_%D0%BB%D0%B5%D1%82_(%D0%90._%D0%9A._%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B9)>
* «Грешница», стихи. Источник: <https://ru.wikisource.org/wiki/%D0%93%D1%80%D0%B5%D1%88%D0%BD%D0%B8%D1%86%D0%B0_(%D0%90._%D0%9A._%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B9)>
* «Дон Жуан», пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%94%D0%BE%D0%BD_%D0%96%D1%83%D0%B0%D0%BD_(%D0%90._%D0%9A._%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B9)>
* «Дракон» (1875), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%94%D1%80%D0%B0%D0%BA%D0%BE%D0%BD_(%D0%90._%D0%9A._%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B9)>
* «Иоанн Дамаскин», стихи. Источник: <https://ru.wikisource.org/wiki/%D0%98%D0%BE%D0%B0%D0%BD%D0%BD_%D0%94%D0%B0%D0%BC%D0%B0%D1%81%D0%BA%D0%B8%D0%BD_(%D0%90._%D0%9A._%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B9)>
* «История государства Российского от Гостомысла до Тимашева», стихи. Источник: <https://ru.wikisource.org/wiki/%D0%98%D1%81%D1%82%D0%BE%D1%80%D0%B8%D1%8F_%D0%B3%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B0_%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B9%D1%81%D0%BA%D0%BE%D0%B3%D0%BE_%D0%BE%D1%82_%D0%93%D0%BE%D1%81%D1%82%D0%BE%D0%BC%D1%8B%D1%81%D0%BB%D0%B0_%D0%B4%D0%BE_%D0%A2%D0%B8%D0%BC%D0%B0%D1%88%D0%B5%D0%B2%D0%B0_(%D0%90._%D0%9A._%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B9)>
* «Князь Серебряный» (1861), роман. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D0%BD%D1%8F%D0%B7%D1%8C_%D0%A1%D0%B5%D1%80%D0%B5%D0%B1%D1%80%D1%8F%D0%BD%D1%8B%D0%B9_(%D0%90._%D0%9A._%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B9)>
* «Портрет», стихи. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82_(%D0%90._%D0%9A._%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B9)>
* «Смерть Иоанна Грозного», пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%BC%D0%B5%D1%80%D1%82%D1%8C_%D0%98%D0%BE%D0%B0%D0%BD%D0%BD%D0%B0_%D0%93%D1%80%D0%BE%D0%B7%D0%BD%D0%BE%D0%B3%D0%BE_(%D0%90._%D0%9A._%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B9)>
* «Сон Попова» (1906), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D0%BE%D0%BD_%D0%9F%D0%BE%D0%BF%D0%BE%D0%B2%D0%B0_(%D0%90._%D0%9A._%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B9)>
* «Упырь» (1841), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%A3%D0%BF%D1%8B%D1%80%D1%8C_(%D0%90._%D0%9A._%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B9)>
* «Царь Борис», пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%A6%D0%B0%D1%80%D1%8C_%D0%91%D0%BE%D1%80%D0%B8%D1%81_(%D0%90._%D0%9A._%D0%A2%D0%BE%D0%BB%D1%81%D1%82%D0%BE%D0%B9)>

### Иван Тургенев

* «Ася» (1858), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%90%D1%81%D1%8F_(%D0%A2%D1%83%D1%80%D0%B3%D0%B5%D0%BD%D0%B5%D0%B2)>
* «Вешние воды» (1872), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%92%D0%B5%D1%88%D0%BD%D0%B8%D0%B5_%D0%B2%D0%BE%D0%B4%D1%8B_(%D0%A2%D1%83%D1%80%D0%B3%D0%B5%D0%BD%D0%B5%D0%B2)>
* «Дворянское гнездо» (1859), роман. Источник: <https://ru.wikisource.org/wiki/%D0%94%D0%B2%D0%BE%D1%80%D1%8F%D0%BD%D1%81%D0%BA%D0%BE%D0%B5_%D0%B3%D0%BD%D0%B5%D0%B7%D0%B4%D0%BE_(%D0%A2%D1%83%D1%80%D0%B3%D0%B5%D0%BD%D0%B5%D0%B2)>
* «Дневник лишнего человека» (1850), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%94%D0%BD%D0%B5%D0%B2%D0%BD%D0%B8%D0%BA_%D0%BB%D0%B8%D1%88%D0%BD%D0%B5%D0%B3%D0%BE_%D1%87%D0%B5%D0%BB%D0%BE%D0%B2%D0%B5%D0%BA%D0%B0_(%D0%A2%D1%83%D1%80%D0%B3%D0%B5%D0%BD%D0%B5%D0%B2)>
* «Дым» (1867), роман. Источник: <https://ru.wikisource.org/wiki/%D0%94%D1%8B%D0%BC_(%D0%A2%D1%83%D1%80%D0%B3%D0%B5%D0%BD%D0%B5%D0%B2)>
* «Клара Милич» (1883), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%BE%D1%81%D0%BB%D0%B5_%D1%81%D0%BC%D0%B5%D1%80%D1%82%D0%B8_(%D0%9A%D0%BB%D0%B0%D1%80%D0%B0_%D0%9C%D0%B8%D0%BB%D0%B8%D1%87)_(%D0%A2%D1%83%D1%80%D0%B3%D0%B5%D0%BD%D0%B5%D0%B2)>
* «Муму» (1854), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9C%D1%83%D0%BC%D1%83_(%D0%A2%D1%83%D1%80%D0%B3%D0%B5%D0%BD%D0%B5%D0%B2)>
* «Накануне» (1860), роман. Источник: <https://ru.wikisource.org/wiki/%D0%9D%D0%B0%D0%BA%D0%B0%D0%BD%D1%83%D0%BD%D0%B5_(%D0%A2%D1%83%D1%80%D0%B3%D0%B5%D0%BD%D0%B5%D0%B2)>
* «Новь» (1877), роман. Источник: <https://ru.wikisource.org/wiki/%D0%9D%D0%BE%D0%B2%D1%8C_(%D0%A2%D1%83%D1%80%D0%B3%D0%B5%D0%BD%D0%B5%D0%B2)>
* «Отцы и дети» (1862), роман. Источник: <https://ru.wikisource.org/wiki/%D0%9E%D1%82%D1%86%D1%8B_%D0%B8_%D0%B4%D0%B5%D1%82%D0%B8_(%D0%A2%D1%83%D1%80%D0%B3%D0%B5%D0%BD%D0%B5%D0%B2)>
* «Первая любовь» (1860), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%B5%D1%80%D0%B2%D0%B0%D1%8F_%D0%BB%D1%8E%D0%B1%D0%BE%D0%B2%D1%8C_(%D0%A2%D1%83%D1%80%D0%B3%D0%B5%D0%BD%D0%B5%D0%B2)>
* «Постоялый двор» (1855), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%BE%D1%81%D1%82%D0%BE%D1%8F%D0%BB%D1%8B%D0%B9_%D0%B4%D0%B2%D0%BE%D1%80_(%D0%A2%D1%83%D1%80%D0%B3%D0%B5%D0%BD%D0%B5%D0%B2)>
* «Призраки» (1864), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D1%80%D0%B8%D0%B7%D1%80%D0%B0%D0%BA%D0%B8_(%D0%A2%D1%83%D1%80%D0%B3%D0%B5%D0%BD%D0%B5%D0%B2)>
* «Рудин» (1856), роман. Источник: <https://ru.wikisource.org/wiki/%D0%A0%D1%83%D0%B4%D0%B8%D0%BD_(%D0%A2%D1%83%D1%80%D0%B3%D0%B5%D0%BD%D0%B5%D0%B2)>
* «Степной король Лир» (1870), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D1%82%D0%B5%D0%BF%D0%BD%D0%BE%D0%B9_%D0%BA%D0%BE%D1%80%D0%BE%D0%BB%D1%8C_%D0%9B%D0%B8%D1%80_(%D0%A2%D1%83%D1%80%D0%B3%D0%B5%D0%BD%D0%B5%D0%B2)>

### Глеб Успенский

* «Будка» (1868), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%91%D1%83%D0%B4%D0%BA%D0%B0_(%D0%A3%D1%81%D0%BF%D0%B5%D0%BD%D1%81%D0%BA%D0%B8%D0%B9)>
* «Власть земли» (1882), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%92%D0%BB%D0%B0%D1%81%D1%82%D1%8C_%D0%B7%D0%B5%D0%BC%D0%BB%D0%B8_(%D0%A3%D1%81%D0%BF%D0%B5%D0%BD%D1%81%D0%BA%D0%B8%D0%B9)>
* «Нравы Растеряевой улицы» (1866), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9D%D1%80%D0%B0%D0%B2%D1%8B_%D0%A0%D0%B0%D1%81%D1%82%D0%B5%D1%80%D1%8F%D0%B5%D0%B2%D0%BE%D0%B9_%D1%83%D0%BB%D0%B8%D1%86%D1%8B_(%D0%A3%D1%81%D0%BF%D0%B5%D0%BD%D1%81%D0%BA%D0%B8%D0%B9)>

### Денис Фонвизин

* «Бригадир» (1786), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%91%D1%80%D0%B8%D0%B3%D0%B0%D0%B4%D0%B8%D1%80_(%D0%A4%D0%BE%D0%BD%D0%B2%D0%B8%D0%B7%D0%B8%D0%BD)>
* «Недоросль» (1781), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%9D%D0%B5%D0%B4%D0%BE%D1%80%D0%BE%D1%81%D0%BB%D1%8C_(%D0%A4%D0%BE%D0%BD%D0%B2%D0%B8%D0%B7%D0%B8%D0%BD)/1952>

### Велимир Хлебников

* «Война в мышеловке» (1928), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%92%D0%BE%D0%B9%D0%BD%D0%B0_%D0%B2_%D0%BC%D1%8B%D1%88%D0%B5%D0%BB%D0%BE%D0%B2%D0%BA%D0%B5_(%D0%A5%D0%BB%D0%B5%D0%B1%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2)>
* «Зангези» (1922), стихи. Источник: <https://ru.wikisource.org/wiki/%D0%97%D0%B0%D0%BD%D0%B3%D0%B5%D0%B7%D0%B8_(%D0%A5%D0%BB%D0%B5%D0%B1%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2)>

### Николай Чернышевский

* «Пролог» (1871), роман. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D1%80%D0%BE%D0%BB%D0%BE%D0%B3_(%D0%A7%D0%B5%D1%80%D0%BD%D1%8B%D1%88%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>
* «Что делать?» (1863), роман. Источник: <https://ru.wikisource.org/wiki/%D0%A7%D1%82%D0%BE_%D0%B4%D0%B5%D0%BB%D0%B0%D1%82%D1%8C%3F_(%D0%A7%D0%B5%D1%80%D0%BD%D1%8B%D1%88%D0%B5%D0%B2%D1%81%D0%BA%D0%B8%D0%B9)>

### Антон Чехов

* «Вишнёвый сад» (1904), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%92%D0%B8%D1%88%D0%BD%D1%91%D0%B2%D1%8B%D0%B9_%D1%81%D0%B0%D0%B4_(%D0%A7%D0%B5%D1%85%D0%BE%D0%B2)>
* «Дама с собачкой» (1899), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%94%D0%B0%D0%BC%D0%B0_%D1%81_%D1%81%D0%BE%D0%B1%D0%B0%D1%87%D0%BA%D0%BE%D0%B9_(%D0%A7%D0%B5%D1%85%D0%BE%D0%B2)>
* «Дядя Ваня» (1897), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%94%D1%8F%D0%B4%D1%8F_%D0%92%D0%B0%D0%BD%D1%8F_(%D0%A7%D0%B5%D1%85%D0%BE%D0%B2)>
* «Иванов» (1889), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%98%D0%B2%D0%B0%D0%BD%D0%BE%D0%B2_(%D0%B4%D1%80%D0%B0%D0%BC%D0%B0,_%D0%A7%D0%B5%D1%85%D0%BE%D0%B2)>
* «Ионыч» (1898), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%98%D0%BE%D0%BD%D1%8B%D1%87_(%D0%A7%D0%B5%D1%85%D0%BE%D0%B2)>
* «Каштанка» (1887), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D0%B0%D1%88%D1%82%D0%B0%D0%BD%D0%BA%D0%B0_(%D0%A7%D0%B5%D1%85%D0%BE%D0%B2)>
* «Крыжовник» (1898), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9A%D1%80%D1%8B%D0%B6%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA_(%D0%A7%D0%B5%D1%85%D0%BE%D0%B2)>
* «Медведь» (1888), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%9C%D0%B5%D0%B4%D0%B2%D0%B5%D0%B4%D1%8C_(%D0%A7%D0%B5%D1%85%D0%BE%D0%B2)>
* «О любви» (1898), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9E_%D0%BB%D1%8E%D0%B1%D0%B2%D0%B8_(%D0%A7%D0%B5%D1%85%D0%BE%D0%B2)>
* «Палата № 6» (1892), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%B0%D0%BB%D0%B0%D1%82%D0%B0_%E2%84%96_6_(%D0%A7%D0%B5%D1%85%D0%BE%D0%B2)>
* «Попрыгунья» (1892), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D0%BE%D0%BF%D1%80%D1%8B%D0%B3%D1%83%D0%BD%D1%8C%D1%8F_(%D0%A7%D0%B5%D1%85%D0%BE%D0%B2)>
* «Предложение» (1888), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%9F%D1%80%D0%B5%D0%B4%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5_(%D0%BF%D1%8C%D0%B5%D1%81%D0%B0,_%D0%A7%D0%B5%D1%85%D0%BE%D0%B2)>
* «Степь» (1888), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%A1%D1%82%D0%B5%D0%BF%D1%8C_(%D0%A7%D0%B5%D1%85%D0%BE%D0%B2)>
* «Три сестры» (1901), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%A2%D1%80%D0%B8_%D1%81%D0%B5%D1%81%D1%82%D1%80%D1%8B_(%D0%A7%D0%B5%D1%85%D0%BE%D0%B2)>
* «Чайка» (1896), пьеса. Источник: <https://ru.wikisource.org/wiki/%D0%A7%D0%B0%D0%B9%D0%BA%D0%B0_(%D0%A7%D0%B5%D1%85%D0%BE%D0%B2)>
* «Человек в футляре» (1898), рассказ. Источник: <https://ru.wikisource.org/wiki/%D0%A7%D0%B5%D0%BB%D0%BE%D0%B2%D0%B5%D0%BA_%D0%B2_%D1%84%D1%83%D1%82%D0%BB%D1%8F%D1%80%D0%B5_(%D0%A7%D0%B5%D1%85%D0%BE%D0%B2)>

### Александр Эртель

* «Волхонская барышня» (1883), повесть. Источник: <https://ru.wikisource.org/wiki/%D0%92%D0%BE%D0%BB%D1%85%D0%BE%D0%BD%D1%81%D0%BA%D0%B0%D1%8F_%D0%B1%D0%B0%D1%80%D1%8B%D1%88%D0%BD%D1%8F_(%D0%AD%D1%80%D1%82%D0%B5%D0%BB%D1%8C)>

# Credits — manga & comics

Files in `library/manga/` (and their covers in `library/covers/`) are repackaged, resized copies of the works below. Pages were resized and re-encoded; the content is otherwise unchanged.

## Pepper&Carrot

Pepper&Carrot by **David Revoy** — https://www.peppercarrot.com — licensed under [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). Translations are by the Pepper&Carrot community translators credited per episode below (per-episode credits from the official `0_sources/<episode>/lang/<lang>/info.json`).

| File | Title | Lang | License | Author | Translation / credits | Source |
|---|---|---|---|---|---|---|
| `peppercarrot-ru-e01.cbz` | Pepper&Carrot — Эпизод 1: Зелье полета | ru | CC BY 4.0 | David Revoy | translation: Andrew "Akari" Alexeyew; contributions: GunChleoc, Hồ Nhựt Châu, Denis Prisukhin | https://www.peppercarrot.com/ru/webcomic/ep01_Potion-of-Flight.html |
| `peppercarrot-ru-e02.cbz` | Pepper&Carrot — Эпизод 2: Радужные зелья | ru | CC BY 4.0 | David Revoy | translation: Denis Prisukhin; contributions: Hồ Nhựt Châu | https://www.peppercarrot.com/ru/webcomic/ep02_Rainbow-potions.html |
| `peppercarrot-ru-e03.cbz` | Pepper&Carrot — Эпизод 3: Секретные ингредиенты | ru | CC BY 4.0 | David Revoy | translation: Denis Prisukhin | https://www.peppercarrot.com/ru/webcomic/ep03_The-secret-ingredients.html |
| `peppercarrot-ru-e04.cbz` | Pepper&Carrot — Эпизод 4: Приступ гениальности | ru | CC BY 4.0 | David Revoy | translation: Denis Prisukhin; contributions: Hồ Nhựt Châu | https://www.peppercarrot.com/ru/webcomic/ep04_Stroke-of-genius.html |
| `peppercarrot-ru-e05.cbz` | Pepper&Carrot — Эпизод 5: Праздничный спецвыпуск | ru | CC BY 4.0 | David Revoy | translation: Denis Prisukhin; contributions: Hồ Nhựt Châu | https://www.peppercarrot.com/ru/webcomic/ep05_Special-holiday-episode.html |
| `peppercarrot-ru-e06.cbz` | Pepper&Carrot — Эпизод 6: Конкурс зельеварения | ru | CC BY 4.0 | David Revoy | translation: Denis Prisukhin; proofreading: Skybladev2, Denis Prisukhin; contributions: Hồ Nhựt Châu | https://www.peppercarrot.com/ru/webcomic/ep06_The-Potion-Contest.html |
| `peppercarrot-ru-e07.cbz` | Pepper&Carrot — Эпизод 7: Желание | ru | CC BY 4.0 | David Revoy | translation: Denis Prisukhin; contributions: Hồ Nhựt Châu, GunChleoc | https://www.peppercarrot.com/ru/webcomic/ep07_The-Wish.html |
| `peppercarrot-ru-e08.cbz` | Pepper&Carrot — Эпизод 8: Вечеринка в день рождения | ru | CC BY 4.0 | David Revoy | translation: Denis Prisukhin | https://www.peppercarrot.com/ru/webcomic/ep08_Pepper-s-Birthday-Party.html |
| `peppercarrot-ru-e09.cbz` | Pepper&Carrot — Эпизод 9: Снадобье | ru | CC BY 4.0 | David Revoy | translation: Denis Prisukhin; contributions: Hồ Nhựt Châu, GunChleoc | https://www.peppercarrot.com/ru/webcomic/ep09_The-Remedy.html |
| `peppercarrot-ru-e10.cbz` | Pepper&Carrot — Эпизод 10: Летний спецвыпуск | ru | CC BY 4.0 | David Revoy | translation: Denis Prisukhin; contributions: Hồ Nhựt Châu, GunChleoc | https://www.peppercarrot.com/ru/webcomic/ep10_Summer-Special.html |
| `peppercarrot-ru-e11.cbz` | Pepper&Carrot — Эпизод 11: Ведьмы Хаоса | ru | CC BY 4.0 | David Revoy | translation: Denis Prisukhin; contributions: Hồ Nhựt Châu, GunChleoc | https://www.peppercarrot.com/ru/webcomic/ep11_The-Witches-of-Chaosah.html |
| `peppercarrot-ru-e12.cbz` | Pepper&Carrot — Эпизод 12: Осенняя уборка | ru | CC BY 4.0 | David Revoy | translation: Denis Prisukhin; contributions: GunChleoc, Hồ Nhựt Châu | https://www.peppercarrot.com/ru/webcomic/ep12_Autumn-Clearout.html |
| `peppercarrot-ru-e13.cbz` | Pepper&Carrot — Эпизод 13: Пижамная вечеринка | ru | CC BY 4.0 | David Revoy | translation: Denis Prisukhin; contributions: Hồ Nhựt Châu, GunChleoc | https://www.peppercarrot.com/ru/webcomic/ep13_The-Pyjama-Party.html |
| `peppercarrot-ru-e14.cbz` | Pepper&Carrot — Эпизод 14: Драконий Зуб | ru | CC BY 4.0 | David Revoy | translation: Denis Prisukhin; contributions: GunChleoc, Hồ Nhựt Châu | https://www.peppercarrot.com/ru/webcomic/ep14_The-Dragon-s-Tooth.html |
| `peppercarrot-ru-e15.cbz` | Pepper&Carrot — Эпизод 15: Хрустальный шар | ru | CC BY 4.0 | David Revoy | translation: Denis Prisukhin; contributions: GunChleoc, Hồ Nhựt Châu | https://www.peppercarrot.com/ru/webcomic/ep15_The-Crystal-Ball.html |
| `peppercarrot-ru-e16.cbz` | Pepper&Carrot — Эпизод 16: Горный Мудрец | ru | CC BY 4.0 | David Revoy | translation: Denis Prisukhin; contributions: GunChleoc, Hồ Nhựt Châu | https://www.peppercarrot.com/ru/webcomic/ep16_The-Sage-of-the-Mountain.html |
| `peppercarrot-ru-e17.cbz` | Pepper&Carrot — Эпизод 17: Новое начало | ru | CC BY 4.0 | David Revoy | translation: Denis Prisukhin; contributions: GunChleoc, Hồ Nhựt Châu | https://www.peppercarrot.com/ru/webcomic/ep17_A-Fresh-Start.html |
| `peppercarrot-ru-e18.cbz` | Pepper&Carrot — Эпизод 18: Неожиданная встреча | ru | CC BY 4.0 | David Revoy | translation: Denis Prisukhin; contributions: GunChleoc, Hồ Nhựt Châu | https://www.peppercarrot.com/ru/webcomic/ep18_The-Encounter.html |
| `peppercarrot-ru-e19.cbz` | Pepper&Carrot — Эпизод 19: Загрязнение | ru | CC BY 4.0 | David Revoy | translation: Denis Prisukhin | https://www.peppercarrot.com/ru/webcomic/ep19_Pollution.html |
| `peppercarrot-ru-e20.cbz` | Pepper&Carrot — Эпизод 20: Пикник | ru | CC BY 4.0 | David Revoy | translation: la gleki .arxokuna; contributions: GunChleoc, Hồ Nhựt Châu | https://www.peppercarrot.com/ru/webcomic/ep20_The-Picnic.html |
| `peppercarrot-ru-e21.cbz` | Pepper&Carrot — Эпизод 21: Конкурс магов | ru | CC BY 4.0 | David Revoy | translation: la gleki .arxokuna; proofreading: Denis Prisukhin | https://www.peppercarrot.com/ru/webcomic/ep21_The-Magic-Contest.html |
| `peppercarrot-ru-e22.cbz` | Pepper&Carrot — Эпизод 22: Голосование | ru | CC BY 4.0 | David Revoy | translation: la gleki .arxokuna; proofreading: Denis Prisukhin; contributions: GunChleoc, Hồ Nhựt Châu | https://www.peppercarrot.com/ru/webcomic/ep22_The-Voting-System.html |
| `peppercarrot-ru-e23.cbz` | Pepper&Carrot — Эпизод 23: Рискованный шаг | ru | CC BY 4.0 | David Revoy | translation: la gleki .arxokuna; contributions: GunChleoc, Hồ Nhựt Châu | https://www.peppercarrot.com/ru/webcomic/ep23_Take-a-Chance.html |
| `peppercarrot-ru-e24.cbz` | Pepper&Carrot — Эпизод 24: Дерево Единства | ru | CC BY 4.0 | David Revoy | translation: la gleki .arxokuna, Nikitin Stanislav; proofreading: Denis Prisukhin | https://www.peppercarrot.com/ru/webcomic/ep24_The-Unity-Tree.html |
| `peppercarrot-ru-e25.cbz` | Pepper&Carrot — Эпизод 25: Без коротких путей | ru | CC BY 4.0 | David Revoy | translation: Nikitin Stanislav; contributions: GunChleoc, Hồ Nhựt Châu | https://www.peppercarrot.com/ru/webcomic/ep25_There-are-no-Shortcuts.html |
| `peppercarrot-ru-e26.cbz` | Pepper&Carrot — Эпизод 26: Книги так хороши! | ru | CC BY 4.0 | David Revoy | translation: Mishvanda; proofreading: Nikitin Stanislav; contributions: Hồ Nhựt Châu, GunChleoc | https://www.peppercarrot.com/ru/webcomic/ep26_Books-Are-Great.html |
| `peppercarrot-ru-e27.cbz` | Pepper&Carrot — Эпизод 27: Изобретение Кориандры | ru | CC BY 4.0 | David Revoy | translation: Mishvanda; proofreading: Nikitin Stanislav, Konstantin Morenko; contributions: GunChleoc, Hồ Nhựt Châu | https://www.peppercarrot.com/ru/webcomic/ep27_Coriander-s-Invention.html |
| `peppercarrot-ru-e28.cbz` | Pepper&Carrot — Эпизод 28: Торжественная часть | ru | CC BY 4.0 | David Revoy | translation: Konstantin Morenko; proofreading: Nikitin Stanislav, Igor Berdiy, la gleki .arxokuna | https://www.peppercarrot.com/ru/webcomic/ep28_The-Festivities.html |
| `peppercarrot-ru-e29.cbz` | Pepper&Carrot — Эпизод 29: Разрушитель миров | ru | CC BY 4.0 | David Revoy | translation: Mishvanda; contributions: GunChleoc, Hồ Nhựt Châu | https://www.peppercarrot.com/ru/webcomic/ep29_Destroyer-of-Worlds.html |
| `peppercarrot-ru-e30.cbz` | Pepper&Carrot — Эпизод 30: Жажда ласки | ru | CC BY 4.0 | David Revoy | translation: Hồ Nhựt Châu | https://www.peppercarrot.com/ru/webcomic/ep30_Need-a-Hug.html |
| `peppercarrot-ru-e31.cbz` | Pepper&Carrot — Эпизод 31: Схватка | ru | CC BY 4.0 | David Revoy | translation: Mishvanda | https://www.peppercarrot.com/ru/webcomic/ep31_The-Fight.html |
| `peppercarrot-ru-e32.cbz` | Pepper&Carrot — Эпизод 32: Поле битвы | ru | CC BY 4.0 | David Revoy | translation: Mishvanda; contributions: GunChleoc, Hồ Nhựt Châu | https://www.peppercarrot.com/ru/webcomic/ep32_The-Battlefield.html |
| `peppercarrot-ru-e33.cbz` | Pepper&Carrot — Эпизод 33: Заклинание Войны | ru | CC BY 4.0 | David Revoy | translation: Mishvanda | https://www.peppercarrot.com/ru/webcomic/ep33_Spell-of-War.html |
| `peppercarrot-ru-e34.cbz` | Pepper&Carrot — Эпизод 34: Посвящение Ситими | ru | CC BY 4.0 | David Revoy | translation: Gracheva Marie | https://www.peppercarrot.com/ru/webcomic/ep34_The-Knighting-of-Shichimi.html |
| `peppercarrot-ru-e35.cbz` | Pepper&Carrot — Эпизод 35: Отражение | ru | CC BY 4.0 | David Revoy | translation: Alexander Chumovitskiy | https://www.peppercarrot.com/ru/webcomic/ep35_The-Reflection.html |
| `peppercarrot-en-e01.cbz` | Pepper&Carrot — Episode 1: The Potion of Flight | en | CC BY 4.0 | David Revoy | original version; proofreading: Amireeti, Alex Gryson | https://www.peppercarrot.com/en/webcomic/ep01_Potion-of-Flight.html |
| `peppercarrot-en-e02.cbz` | Pepper&Carrot — Episode 2: Rainbow Potions | en | CC BY 4.0 | David Revoy | original version; proofreading: Amireeti, Alex Gryson | https://www.peppercarrot.com/en/webcomic/ep02_Rainbow-potions.html |
| `peppercarrot-en-e03.cbz` | Pepper&Carrot — Episode 3: The Secret Ingredients | en | CC BY 4.0 | David Revoy | original version; proofreading: Amireeti, Alex Gryson | https://www.peppercarrot.com/en/webcomic/ep03_The-secret-ingredients.html |
| `peppercarrot-en-e04.cbz` | Pepper&Carrot — Episode 4: Stroke of Genius | en | CC BY 4.0 | David Revoy | original version; proofreading: Alex Gryson, Amireeti, Willem Sonke, Luke Bertot, Rémi Rampin | https://www.peppercarrot.com/en/webcomic/ep04_Stroke-of-genius.html |
| `peppercarrot-en-e05.cbz` | Pepper&Carrot — Episode 5: Special holiday episode | en | CC BY 4.0 | David Revoy | original version; proofreading: Alex Gryson, Amireeti, Jihoon Kim | https://www.peppercarrot.com/en/webcomic/ep05_Special-holiday-episode.html |
| `peppercarrot-en-e06.cbz` | Pepper&Carrot — Episode 6: The Potion Contest | en | CC BY 4.0 | David Revoy | translation: Alex Gryson | https://www.peppercarrot.com/en/webcomic/ep06_The-Potion-Contest.html |
| `peppercarrot-en-e07.cbz` | Pepper&Carrot — Episode 7: The Wish | en | CC BY 4.0 | David Revoy | translation: Alex Gryson; proofreading: GunChleoc | https://www.peppercarrot.com/en/webcomic/ep07_The-Wish.html |
| `peppercarrot-en-e08.cbz` | Pepper&Carrot — Episode 8: Pepper's Birthday Party | en | CC BY 4.0 | David Revoy | translation: Alex Gryson | https://www.peppercarrot.com/en/webcomic/ep08_Pepper-s-Birthday-Party.html |
| `peppercarrot-en-e09.cbz` | Pepper&Carrot — Episode 9: The Remedy | en | CC BY 4.0 | David Revoy | translation: Alex Gryson | https://www.peppercarrot.com/en/webcomic/ep09_The-Remedy.html |
| `peppercarrot-en-e10.cbz` | Pepper&Carrot — Episode 10: Summer Special | en | CC BY 4.0 | David Revoy | translation: Alex Gryson | https://www.peppercarrot.com/en/webcomic/ep10_Summer-Special.html |
| `peppercarrot-en-e11.cbz` | Pepper&Carrot — Episode 11: The Witches of Chaosah | en | CC BY 4.0 | David Revoy | translation: Alex Gryson; proofreading: Luke Bertot | https://www.peppercarrot.com/en/webcomic/ep11_The-Witches-of-Chaosah.html |
| `peppercarrot-en-e12.cbz` | Pepper&Carrot — Episode 12: Autumn Clearout | en | CC BY 4.0 | David Revoy | translation: Alex Gryson; proofreading: GunChleoc | https://www.peppercarrot.com/en/webcomic/ep12_Autumn-Clearout.html |
| `peppercarrot-en-e13.cbz` | Pepper&Carrot — Episode 13: The Pyjama Party | en | CC BY 4.0 | David Revoy | translation: Alex Gryson | https://www.peppercarrot.com/en/webcomic/ep13_The-Pyjama-Party.html |
| `peppercarrot-en-e14.cbz` | Pepper&Carrot — Episode 14: The Dragon's Tooth | en | CC BY 4.0 | David Revoy | translation: Alex Gryson; proofreading: Rémi Rampin | https://www.peppercarrot.com/en/webcomic/ep14_The-Dragon-s-Tooth.html |
| `peppercarrot-en-e15.cbz` | Pepper&Carrot — Episode 15: The Crystal Ball | en | CC BY 4.0 | David Revoy | translation: David Revoy; proofreading: Rémi Rampin | https://www.peppercarrot.com/en/webcomic/ep15_The-Crystal-Ball.html |
| `peppercarrot-en-e16.cbz` | Pepper&Carrot — Episode 16: The Sage of the Mountain | en | CC BY 4.0 | David Revoy | translation: Alex Gryson; proofreading: Irina | https://www.peppercarrot.com/en/webcomic/ep16_The-Sage-of-the-Mountain.html |
| `peppercarrot-en-e17.cbz` | Pepper&Carrot — Episode 17: A Fresh Start | en | CC BY 4.0 | David Revoy | translation: Alex Gryson | https://www.peppercarrot.com/en/webcomic/ep17_A-Fresh-Start.html |
| `peppercarrot-en-e18.cbz` | Pepper&Carrot — Episode 18: The Encounter | en | CC BY 4.0 | David Revoy | translation: Alex Gryson | https://www.peppercarrot.com/en/webcomic/ep18_The-Encounter.html |
| `peppercarrot-en-e19.cbz` | Pepper&Carrot — Episode 19: Pollution | en | CC BY 4.0 | David Revoy | translation: Alex Gryson; proofreading: GunChleoc | https://www.peppercarrot.com/en/webcomic/ep19_Pollution.html |
| `peppercarrot-en-e20.cbz` | Pepper&Carrot — Episode 20: The Picnic | en | CC BY 4.0 | David Revoy | translation: David Revoy; proofreading: Alex Gryson | https://www.peppercarrot.com/en/webcomic/ep20_The-Picnic.html |
| `peppercarrot-en-e21.cbz` | Pepper&Carrot — Episode 21: The Magic Contest | en | CC BY 4.0 | David Revoy | translation: Alex Gryson; proofreading: Craig Maloney, sn0wmonster | https://www.peppercarrot.com/en/webcomic/ep21_The-Magic-Contest.html |
| `peppercarrot-en-e22.cbz` | Pepper&Carrot — Episode 22: The Voting System | en | CC BY 4.0 | David Revoy | translation: Alex Gryson; proofreading: Craig Maloney | https://www.peppercarrot.com/en/webcomic/ep22_The-Voting-System.html |
| `peppercarrot-en-e23.cbz` | Pepper&Carrot — Episode 23: Take a Chance | en | CC BY 4.0 | David Revoy | translation: Alex Gryson; proofreading: Craig Maloney, CalimeroTeknik | https://www.peppercarrot.com/en/webcomic/ep23_Take-a-Chance.html |
| `peppercarrot-en-e24.cbz` | Pepper&Carrot — Episode 24: The Unity Tree | en | CC BY 4.0 | David Revoy | original version; proofreading: Midgard, Craig Maloney, Jookia, CalimeroTeknik | https://www.peppercarrot.com/en/webcomic/ep24_The-Unity-Tree.html |
| `peppercarrot-en-e25.cbz` | Pepper&Carrot — Episode 25: There Are No Shortcuts | en | CC BY 4.0 | David Revoy | translation: Alex Gryson | https://www.peppercarrot.com/en/webcomic/ep25_There-are-no-Shortcuts.html |
| `peppercarrot-en-e26.cbz` | Pepper&Carrot — Episode 26: Books Are Great | en | CC BY 4.0 | David Revoy | original version; proofreading: Craig Maloney, CalimeroTeknik | https://www.peppercarrot.com/en/webcomic/ep26_Books-Are-Great.html |
| `peppercarrot-en-e27.cbz` | Pepper&Carrot — Episode 27: Coriander's Invention | en | CC BY 4.0 | David Revoy | original version; proofreading: CalimeroTeknik, Craig Maloney, Martin Disch, Midgard | https://www.peppercarrot.com/en/webcomic/ep27_Coriander-s-Invention.html |
| `peppercarrot-en-e28.cbz` | Pepper&Carrot — Episode 28: The Festivities | en | CC BY 4.0 | David Revoy | original version; proofreading: CalimeroTeknik, Craig Maloney, Martin Disch | https://www.peppercarrot.com/en/webcomic/ep28_The-Festivities.html |
| `peppercarrot-en-e29.cbz` | Pepper&Carrot — Episode 29: Destroyer of Worlds | en | CC BY 4.0 | David Revoy | translation: CalimeroTeknik, Craig Maloney, Martin Disch, Midgard | https://www.peppercarrot.com/en/webcomic/ep29_Destroyer-of-Worlds.html |
| `peppercarrot-en-e30.cbz` | Pepper&Carrot — Episode 30: Need a Hug | en | CC BY 4.0 | David Revoy | original version | https://www.peppercarrot.com/en/webcomic/ep30_Need-a-Hug.html |
| `peppercarrot-en-e31.cbz` | Pepper&Carrot — Episode 31: The Fight | en | CC BY 4.0 | David Revoy | translation: Craig Maloney, Martin Disch; contributions: GunChleoc | https://www.peppercarrot.com/en/webcomic/ep31_The-Fight.html |
| `peppercarrot-en-e32.cbz` | Pepper&Carrot — Episode 32: The Battlefield | en | CC BY 4.0 | David Revoy | original version; proofreading: Craig Maloney, Martin Disch | https://www.peppercarrot.com/en/webcomic/ep32_The-Battlefield.html |
| `peppercarrot-en-e33.cbz` | Pepper&Carrot — Episode 33: Spell of War | en | CC BY 4.0 | David Revoy | original version; proofreading: Craig Maloney, GunChleoc, Karl Ove Hufthammer, Martin Disch | https://www.peppercarrot.com/en/webcomic/ep33_Spell-of-War.html |
| `peppercarrot-en-e34.cbz` | Pepper&Carrot — Episode 34: The Knighting of Shichimi | en | CC BY 4.0 | David Revoy | original version; proofreading: Arlo James Barnes, Carotte, Craig Maloney, GunChleoc, Karl Ove Hufthammer, Martin Disch | https://www.peppercarrot.com/en/webcomic/ep34_The-Knighting-of-Shichimi.html |
| `peppercarrot-en-e35.cbz` | Pepper&Carrot — Episode 35: The Reflection | en | CC BY 4.0 | David Revoy | original version; proofreading: Arlo James Barnes, Craig Maloney, Karl Ove Hufthammer, Martin Disch | https://www.peppercarrot.com/en/webcomic/ep35_The-Reflection.html |
| `peppercarrot-en-e36.cbz` | Pepper&Carrot — Episode 36: The Surprise Attack | en | CC BY 4.0 | David Revoy | translation: Arlo James Barnes, Bobby Hiltz, Estefania de Vasconcellos Guimaraes, Frederic Mora, GunChleoc, Karl Ove Hufthammer, Pierre-Antoine Angelini, Zane Waldman; proofreading: Craig Maloney | https://www.peppercarrot.com/en/webcomic/ep36_The-Surprise-Attack.html |
| `peppercarrot-en-e37.cbz` | Pepper&Carrot — Episode 37: The Tears of the Phoenix | en | CC BY 4.0 | David Revoy | translation: Arlo James Barnes, Benjamin Loubet, Bobby Hiltz, Estefania de Vasconcellos Guimaraes; proofreading: Craig Maloney | https://www.peppercarrot.com/en/webcomic/ep37_The-Tears-of-the-Phoenix.html |
| `peppercarrot-en-e38.cbz` | Pepper&Carrot — Episode 38: The Healer | en | CC BY 4.0 | David Revoy | translation: Arlo James Barnes, Benjamin Loubet, Bobby Hiltz, CitizenK4te, Craig Maloney, Estefania de Vasconcellos Guimaraes, Frederic Mora, Jelfo, Marno van der Maas; proofreading: H-Games, Menhir | https://www.peppercarrot.com/en/webcomic/ep38_The-Healer.html |
| `peppercarrot-en-e39.cbz` | Pepper&Carrot — Episode 39: The Tavern | en | CC BY 4.0 | David Revoy | original version; proofreading: Bobby Hiltz, Estefania de Vasconcellos Guimaraes, Marno van der Maas, Karl Ove Hufthammer; contributions: Christian Aribaud, Emmiline, Nicolas Artance, Olivier Jolly, Rimas Kudelis, Valvin | https://www.peppercarrot.com/en/webcomic/ep39_The-Tavern.html |

## Hokusai Manga (北斎漫画)

By **Katsushika Hokusai** (1760–1849). Public domain. Edition: Eirakuya Tōshirō, Nagoya (an early reprint by the first edition's publisher, catalogued as 1868), 14 volumes. Scans by Harold B. Lee Library, Brigham Young University, via the Internet Archive.

| File | Title | Lang | License | Author | Edition / scan | Source |
|---|---|---|---|---|---|---|
| `hokusai-manga-v01.cbz` | Hokusai Manga, vol. 1 | ja | Public domain | Katsushika Hokusai (1760–1849) | edition: Bishū [Nagoya] : Eirakuya Tōshirō, 1868; scan: Harold B. Lee Library, Brigham Young University | https://archive.org/details/hokusaimangathes01kats |
| `hokusai-manga-v02.cbz` | Hokusai Manga, vol. 2 | ja | Public domain | Katsushika Hokusai (1760–1849) | edition: Bishū [Nagoya] : Eirakuya Tōshirō, 1868; scan: Harold B. Lee Library, Brigham Young University | https://archive.org/details/hokusaimangathes02kats |
| `hokusai-manga-v03.cbz` | Hokusai Manga, vol. 3 | ja | Public domain | Katsushika Hokusai (1760–1849) | edition: Bishū [Nagoya] : Eirakuya Tōshirō, 1868; scan: Harold B. Lee Library, Brigham Young University | https://archive.org/details/hokusaimangathes03kats |
| `hokusai-manga-v04.cbz` | Hokusai Manga, vol. 4 | ja | Public domain | Katsushika Hokusai (1760–1849) | edition: Bishū [Nagoya] : Eirakuya Tōshirō, 1868; scan: Harold B. Lee Library, Brigham Young University | https://archive.org/details/hokusaimangathes04kats |
| `hokusai-manga-v05.cbz` | Hokusai Manga, vol. 5 | ja | Public domain | Katsushika Hokusai (1760–1849) | edition: Bishū [Nagoya] : Eirakuya Tōshirō, 1868; scan: Harold B. Lee Library, Brigham Young University | https://archive.org/details/hokusaimangathes05kats |
| `hokusai-manga-v06.cbz` | Hokusai Manga, vol. 6 | ja | Public domain | Katsushika Hokusai (1760–1849) | edition: Bishū [Nagoya] : Eirakuya Tōshirō, 1868; scan: Harold B. Lee Library, Brigham Young University | https://archive.org/details/hokusaimangathes06kats |
| `hokusai-manga-v07.cbz` | Hokusai Manga, vol. 7 | ja | Public domain | Katsushika Hokusai (1760–1849) | edition: Bishū [Nagoya] : Eirakuya Tōshirō, 1868; scan: Harold B. Lee Library, Brigham Young University | https://archive.org/details/hokusaimangathes07kats |
| `hokusai-manga-v08.cbz` | Hokusai Manga, vol. 8 | ja | Public domain | Katsushika Hokusai (1760–1849) | edition: Bishū [Nagoya] : Eirakuya Tōshirō, 1868; scan: Harold B. Lee Library, Brigham Young University | https://archive.org/details/hokusaimangathes08kats |
| `hokusai-manga-v09.cbz` | Hokusai Manga, vol. 9 | ja | Public domain | Katsushika Hokusai (1760–1849) | edition: Bishū [Nagoya] : Eirakuya Tōshirō, 1868; scan: Harold B. Lee Library, Brigham Young University | https://archive.org/details/hokusaimangathes09kats |
| `hokusai-manga-v10.cbz` | Hokusai Manga, vol. 10 | ja | Public domain | Katsushika Hokusai (1760–1849) | edition: Bishū [Nagoya] : Eirakuya Tōshirō, 1868; scan: Harold B. Lee Library, Brigham Young University | https://archive.org/details/hokusaimangathes10kats |
| `hokusai-manga-v11.cbz` | Hokusai Manga, vol. 11 | ja | Public domain | Katsushika Hokusai (1760–1849) | edition: Bishū [Nagoya] : Eirakuya Tōshirō, 1868; scan: Harold B. Lee Library, Brigham Young University | https://archive.org/details/hokusaimangathes11kats |
| `hokusai-manga-v12.cbz` | Hokusai Manga, vol. 12 | ja | Public domain | Katsushika Hokusai (1760–1849) | edition: Bishū [Nagoya] : Eirakuya Tōshirō, 1868; scan: Harold B. Lee Library, Brigham Young University | https://archive.org/details/hokusaimangathes12kats |
| `hokusai-manga-v13.cbz` | Hokusai Manga, vol. 13 | ja | Public domain | Katsushika Hokusai (1760–1849) | edition: Bishū [Nagoya] : Eirakuya Tōshirō, 1868; scan: Harold B. Lee Library, Brigham Young University | https://archive.org/details/hokusaimangathes13kats |
| `hokusai-manga-v14.cbz` | Hokusai Manga, vol. 14 | ja | Public domain | Katsushika Hokusai (1760–1849) | edition: Bishū [Nagoya] : Eirakuya Tōshirō, 1868; scan: Harold B. Lee Library, Brigham Young University | https://archive.org/details/hokusaimangathes14kats |
