import { books } from './bibleBooks';
import { Nullable } from '..';

interface ScriptureReference {
  book: string;
  chapter: number;
  verse: number;
}

export interface Range<T> {
  start: T;
  end: T;
}

export type RawScriptureRange = Range<Nullable<ScriptureReference>>;

export type ScriptureRange = Range<Required<ScriptureReference>>;

export const parseScriptureRange = (
  bookName: string,
  reference: string
): RawScriptureRange | [] => {
  if (!reference) return [];

  const bookIndex = bookIndexFromName(bookName);

  const [start, end] = reference.split('-');

  // want to be able to set startVerse later if necessary
  // eslint-disable-next-line prefer-const
  let [startChapter, startVerse] = start.split(':').map(Number);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const endParts = end?.split(':').map(Number);
  let endChapter: number | undefined = undefined;
  let endVerse: number | undefined = undefined;

  // it can be either a chapter or a verse
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (endParts?.length === 1) {
    // {chapter}:{verse}-{verse}
    if (startChapter && startVerse) {
      endChapter = startChapter;
      endVerse = endParts[0];
    }
    // {chapter}-{chapter}
    else if (startChapter && !startVerse) {
      startVerse = 1;
      endChapter = endParts[0];
      endVerse = books[bookIndex].chapters[endChapter - 1];
    }
  }
  // not normal, but we want to handle it
  // {chapter}-{chapter}:{verse}
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  else if (endParts?.length === 2 && !startVerse) {
    startVerse = 1;
    endChapter = endParts[0];
    endVerse = endParts[1];
  }
  // {chapter}:{verse}-{chapter}:{verse}
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  else if (endParts?.length > 0) {
    endChapter = endParts[0];
    endVerse = endParts[1];
  }

  // {chapter}
  if (!end && !startVerse) {
    startVerse = 1;
    endChapter = startChapter;
    endVerse = books[bookIndex].chapters[startChapter - 1];
  }

  return {
    start: {
      book: bookName,
      chapter: startChapter,
      verse: startVerse,
    },
    end: {
      book: bookName,
      // if the reference is only say "Ruth 1", then end of the range's chapter will be 1
      chapter: endChapter || startChapter,
      // if it's "Ruth 1:2", then the end of the range's verse will be 2, the same as the start of the range's verse
      verse: endVerse || startVerse,
    },
  };
};

export const validateScriptureRange = (
  range: RawScriptureRange
): ScriptureRange | void => {
  const { start, end } = range;

  if (!start || !end) return;

  // as a whole
  if (start.chapter > end.chapter) {
    throw new ScriptureError(
      'chapterOrder',
      `The first chapter must come before the last chapter`
    );
  } else if (start.chapter === end.chapter && start.verse > end.verse) {
    throw new ScriptureError(
      'verseOrder',
      `The first verse must come before the last verse`
    );
  }

  Object.keys(range).forEach((part: string) => {
    // part (p) being start or end
    const p = (range as any)[part];
    const bookName = p.book;
    const bookIndex = bookIndexFromName(bookName);
    const chaptersInBook = books[bookIndex].chapters.length;
    const chapterIndex = p.chapter - 1;
    const versesInChapter = books[bookIndex].chapters[chapterIndex];
    if (p.chapter > chaptersInBook) {
      throw new ScriptureError(
        'invalidChapter',
        `${bookName} only has ${chaptersInBook} ${
          chaptersInBook === 1 ? 'chapter' : 'chapters'
        }`
      );
    } else if (p.verse > versesInChapter) {
      throw new ScriptureError(
        'invalidVerse',
        `${bookName} ${p.chapter} only has ${versesInChapter} ${
          versesInChapter === 1 ? 'verse' : 'verses'
        }`
      );
    }
  });
  return range as ScriptureRange;
};

// Given a string of a book name (shortened or full length), get the book id
export const bookIndexFromName = (name: string) => {
  name = name.toLowerCase();
  const book = books.find((book) => {
    const bookNames = book.names.map((n) => n.toLowerCase());
    return bookNames.includes(name);
  });
  if (book) {
    return books.indexOf(book);
  }
  throw new ScriptureError('invalidBook', `No book matched '${name}'`);
};

export const formatScriptureRange = (
  range: ScriptureRange | RawScriptureRange
): string => {
  if (!range.start || !range.end) return '';
  // const
  const {
    start: { book: bookName, chapter: startChapter, verse: startVerse },
    end: { chapter: endChapter, verse: endVerse },
  } = range;

  const bookIndex = bookIndexFromName(bookName);
  const endChapterIndex = endChapter - 1;

  if (startChapter !== endChapter) {
    // {chapter}-{chapter}
    if (
      Number(startVerse) === 1 &&
      // if endVerse equals the number of verses in endChapter we know it's a chapter-chapter reference
      Number(endVerse) === books[bookIndex].chapters[endChapterIndex]
    ) {
      return `${startChapter}-${endChapter}`;
    }
    // {chapter}:{verse}-{chapter}:{verse}
    return `${startChapter}:${startVerse}-${endChapter}:${endVerse}`;
  }

  // __________ we know at this point that startChapter and endChapter are the same __________ //

  // {chapter}
  if (
    Number(startVerse) === 1 &&
    Number(endVerse) === books[bookIndex].chapters[endChapterIndex]
  ) {
    return `${startChapter}`;
  }
  // {chapter}:{verse}
  else if (startVerse === endVerse) {
    return `${startChapter}:${startVerse}`;
  }
  // {chapter}:{verse}-{verse}
  return `${startChapter}:${startVerse}-${endVerse}`;
};

class ScriptureError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = code;
    this.code = code;
  }
}