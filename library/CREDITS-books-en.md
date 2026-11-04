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
