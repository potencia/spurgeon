'use strict';

var bookRegex = /^([0-9]?[a-zA-Z]{2,})?\.?(.*)/,
rangeRegex = /^([0-9]+(?:\:[0-9]+)?)-([0-9]+(?:\:[0-9]+)?)$/,
numbersRegex = /^(?:([0-9]*):)?([0-9]*)$/,
fullBook = ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
            'I Samuel', 'II Samuel', 'I Kings', 'II Kings', 'I Chronicles', 'II Chronicles', 'Ezra',
            'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Songs',
            'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
            'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah',
            'Malachi', 'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', 'I Corinthians',
            'II Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', 'I Thessalonians',
            'II Thessalonians', 'I Timothy', 'II Timothy', 'Titus', 'Philemon', 'Hebrews', 'James',
            'I Peter', 'II Peter', 'I John', 'II John', 'III John', 'Jude', 'Revelation'],
oneChapter = ['Obadiah', 'Philemon', 'II John', 'III John', 'Jude'],
bookAbbrMap = {
    'GENESIS' : 0,
    'GEN' : 0,
    'GE' : 0,

    'EXODUS' : 1,
    'EXO' : 1,
    'EX' : 1,

    'LEVITICUS' : 2,
    'LEVI' : 2,
    'LEV' : 2,
    'LE' : 2,

    'NUMBERS' : 3,
    'NUMBER' : 3,
    'NUM' : 3,
    'NU' : 3,

    'DEUTERONOMY' : 4,
    'DEUT' : 4,
    'DE' : 4,

    'JOSHUA' : 5,
    'JOSH' : 5,
    'JOS' : 5,

    'JUDGES' : 6,
    'JUDGE' : 6,
    'JU' : 6,

    'RUTH' : 7,
    'RU' : 7,

    'ISAMUEL' : 8,
    'ISAMU' : 8,
    'ISAM' : 8,
    '1SAMUEL' : 8,
    '1SAMU' : 8,
    '1SAM' : 8,
    '1SA' : 8,

    'IISAMUEL' : 9,
    'IISAMU' : 9,
    'IISAM' : 9,
    'IISA' : 9,
    '2SAMUEL' : 9,
    '2SAMU' : 9,
    '2SAM' : 9,
    '2SA' : 9,

    'IKINGS' : 10,
    'IKING' : 10,
    'IKN' : 10,
    'IKG' : 10,
    '1KINGS' : 10,
    '1KING' : 10,
    '1KN' : 10,
    '1KG' : 10,

    'IIKINGS' : 11,
    'IIKING' : 11,
    'IIKN' : 11,
    'IIKG' : 11,
    '2KINGS' : 11,
    '2KING' : 11,
    '2KN' : 11,
    '2KG' : 11,

    'ICHRONICLES' : 12,
    'ICHRONICLE' : 12,
    'ICHRON' : 12,
    'ICRON' : 12,
    'ICHRO' : 12,
    'ICHR' : 12,
    'ICH' : 12,
    '1CHRONICLES' : 12,
    '1CHRONICLE' : 12,
    '1CHRON' : 12,
    '1CRON' : 12,
    '1CHRO' : 12,
    '1CHR' : 12,
    '1CH' : 12,

    'IICHRONICLES' : 13,
    'IICHRONICLE' : 13,
    'IICHRON' : 13,
    'IICRON' : 13,
    'IICHRO' : 13,
    'IICHR' : 13,
    'IICH' : 13,
    '2CHRONICLES' : 13,
    '2CHRONICLE' : 13,
    '2CHRON' : 13,
    '2CRON' : 13,
    '2CHRO' : 13,
    '2CHR' : 13,
    '2CH' : 13,

    'EZRA' : 14,
    'EZR' : 14,

    'NEHEMIAH' : 15,
    'NEHE' : 15,
    'NEH' : 15,
    'NE' : 15,

    'ESTHER' : 16,
    'ESTH' : 16,
    'EST' : 16,
    'ES' : 16,

    'JOB' : 17,
    'JB' : 17,

    'PSALMS' : 18,
    'PSALM' : 18,
    'PSA' : 18,
    'PS' : 18,

    'PROVERBS' : 19,
    'PROVERB' : 19,
    'PROV' : 19,
    'PRO' : 19,
    'PR' : 19,

    'ECCLESIASTES' : 20,
    'ECCL' : 20,
    'ECC' : 20,
    'EC' : 20,

    'SONGOFSONGS' : 21,
    'SONGOFSOLOMON' : 21,
    'SONGOFSOL' : 21,
    'SONG' : 21,
    'SOL' : 21,
    'SOS' : 21,
    'SO' : 21,

    'ISAIAH' : 22,
    'ISA' : 22,
    'IS' : 22,

    'JEREMIAH' : 23,
    'JERE' : 23,
    'JER' : 23,
    'JE' : 23,

    'LAMENTATIONS' : 24,
    'LAMENTATION' : 24,
    'LAM' : 24,
    'LA' : 24,

    'EZEKIEL' : 25,
    'EZEK' : 25,
    'EZE' : 25,

    'DANIEL' : 26,
    'DAN' : 26,
    'DA' : 26,

    'HOSEA' : 27,
    'HOS' : 27,
    'HO' : 27,

    'JOEL' : 28,
    'JOE' : 28,
    'JO' : 28,

    'AMOS' : 29,
    'AMO' : 29,
    'AM' : 29,

    'OBADIAH' : 30,
    'OBAD' : 30,
    'OBA' : 30,
    'OB' : 30,

    'JONAH' : 31,
    'JON' : 31,
    'JH' : 31,

    'MICAH' : 32,
    'MIC' : 32,
    'MI' : 32,

    'NAHUM' : 33,
    'NAH' : 33,
    'NA' : 33,

    'HABAKKUK' : 34,
    'HABAK' : 34,
    'HAB' : 34,

    'ZEPHANIAH' : 35,
    'ZEPH' : 35,
    'ZEP' : 35,

    'HAGGAI' : 36,
    'HAGG' : 36,
    'HAG' : 36,

    'ZECHARIAH' : 37,
    'ZECH' : 37,
    'ZEC' : 37,

    'MALACHI' : 38,
    'MAL' : 38,
    'MA' : 38,

    'MATTHEW' : 39,
    'MATT' : 39,
    'MAT' : 39,
    'MT' : 39,

    'MARK' : 40,
    'MAR' : 40,
    'MK' : 40,

    'LUKE' : 41,
    'LUK' : 41,
    'LK' : 41,

    'JOHN' : 42,
    'JOH' : 42,
    'JN' : 42,

    'ACTS' : 43,
    'ACT' : 43,
    'AC' : 43,

    'ROMANS' : 44,
    'ROMAN' : 44,
    'ROM' : 44,
    'RO' : 44,

    'ICORINTHIANS' : 45,
    'ICORINTHIAN' : 45,
    'ICOR' : 45,
    'ICO' : 45,
    '1CORINTHIANS' : 45,
    '1CORINTHIAN' : 45,
    '1COR' : 45,
    '1CO' : 45,

    'IICORINTHIANS' : 46,
    'IICORINTHIAN' : 46,
    'IICOR' : 46,
    'IICO' : 46,
    '2CORINTHIANS' : 46,
    '2CORINTHIAN' : 46,
    '2COR' : 46,
    '2CO' : 46,

    'GALATIANS' : 47,
    'GALATIAN' : 47,
    'GAL' : 47,
    'GA' : 47,

    'EPHESIANS' : 48,
    'EPHESIAN' : 48,
    'EPH' : 48,
    'EP' : 48,

    'PHILIPPIANS' : 49,
    'PHILIPPIAN' : 49,
    'PHIL' : 49,
    'PH' : 49,

    'COLOSSIANS' : 50,
    'COLOSSIAN' : 50,
    'COL' : 50,
    'CO' : 50,

    'ITHESSALONIANS' : 51,
    'ITHESSALONIAN' : 51,
    'ITHES' : 51,
    'ITH' : 51,
    '1THESSALONIANS' : 51,
    '1THESSALONIAN' : 51,
    '1THES' : 51,
    '1TH' : 51,

    'IITHESSALONIANS' : 52,
    'IITHESSALONIAN' : 52,
    'IITHES' : 52,
    'IITH' : 52,
    '2THESSALONIANS' : 52,
    '2THESSALONIAN' : 52,
    '2THES' : 52,
    '2TH' : 52,

    'ITIMOTHY' : 53,
    'ITIMO' : 53,
    'ITIM' : 53,
    'ITI' : 53,
    '1TIMOTHY' : 53,
    '1TIMO' : 53,
    '1TIM' : 53,
    '1TI' : 53,

    'IITIMOTHY' : 54,
    'IITIMO' : 54,
    'IITIM' : 54,
    'IITI' : 54,
    '2TIMOTHY' : 54,
    '2TIMO' : 54,
    '2TIM' : 54,
    '2TI' : 54,

    'TITUS' : 55,
    'TIT' : 55,
    'TI' : 55,

    'PHILEMON' : 56,
    'PN' : 56,

    'HEBREWS' : 57,
    'HEBREW' : 57,
    'HEB' : 57,
    'HE' : 57,

    'JAMES' : 58,
    'JAM' : 58,
    'JA' : 58,
    'JS' : 58,

    'IPETER' : 59,
    'IPETE' : 59,
    'IPET' : 59,
    'IPE' : 59,
    '1PETER' : 59,
    '1PETE' : 59,
    '1PET' : 59,
    '1PE' : 59,

    'IIPETER' : 60,
    'IIPETE' : 60,
    'IIPET' : 60,
    'IIPE' : 60,
    '2PETER' : 60,
    '2PETE' : 60,
    '2PET' : 60,
    '2PE' : 60,

    'IJOHN' : 61,
    'IJHN' : 61,
    'IJN' : 61,
    '1JOHN' : 61,
    '1JHN' : 61,
    '1JN' : 61,

    'IIJOHN' : 62,
    'IIJHN' : 62,
    'IIJN' : 62,
    '2JOHN' : 62,
    '2JHN' : 62,
    '2JN' : 62,

    'IIIJOHN' : 63,
    'IIIJHN' : 63,
    'IIIJN' : 63,
    '3JOHN' : 63,
    '3JHN' : 63,
    '3JN' : 63,

    'JUDE' : 64,
    'JD' : 64,

    'REVELATION' : 65,
    'REVE' : 65,
    'REV' : 65,
    'RE' : 65
};

function Reference () {}

function splitIndividualReference (raw) {
    var ref = {}, bookMatch, rangeMatch, numbersMatch;

    bookMatch = bookRegex.exec(raw);
    if (bookMatch[1]) {
        ref.book = normalizeBook(bookMatch[1]);
        if (!ref.book) {
            throw new Error('Could not determine the book from [ ' + bookMatch[1] + ' ].');
        }
    }

    rangeMatch = rangeRegex.exec(bookMatch[2]);
    if (rangeMatch) {
        ref.start = {};
        ref.end = {};
        numbersMatch = numbersRegex.exec(rangeMatch[1]);
        if (numbersMatch[1]) {
            ref.start.chapter = parseInt(numbersMatch[1], 10);
        }
        if (numbersMatch[2]) {
            ref.start.verse = parseInt(numbersMatch[2], 10);
        }
        numbersMatch = numbersRegex.exec(rangeMatch[2]);
        if (numbersMatch[1]) {
            ref.end.chapter = parseInt(numbersMatch[1], 10);
        } else if (ref.start.chapter) {
            ref.chapter = ref.start.chapter;
            delete ref.start.chapter;
        }
        if (numbersMatch[2]) {
            ref.end.verse = parseInt(numbersMatch[2], 10);
        }
    } else {
        numbersMatch = numbersRegex.exec(bookMatch[2]);
        if (numbersMatch) {
            if (numbersMatch[1]) {
                ref.chapter = parseInt(numbersMatch[1], 10);
            }

            if (numbersMatch[2]) {
                ref.verse = parseInt(numbersMatch[2], 10);
            }
        }
    }

    return ref;
}

function normalizeBook (book) {
    var idx = bookAbbrMap[book.toUpperCase()];
    if (idx !== undefined) {
        return fullBook[idx];
    }
    return undefined;
}

function throwInvalidReference (raw, error) {
    var message = 'Invalid Scripture Reference [ ' + raw + ' ]';
    if (error) {
        message += '. ' + error.message;
    }
    throw new Error(message);
}

Reference.split = function (raw) {
    var current = {}, noSpaces = raw.replace(/\s/g, ''), split, refs = [];

    try {
        split = noSpaces.replace(';', ',').split(',').map(splitIndividualReference);
    } catch (error) {
        throwInvalidReference(raw, error);
    }

    split.forEach(function (item) {
        var ctr, ref;
        if (!item.chapter && !item.verse && !item.start) {
            throwInvalidReference(raw);
        }

        if (item.book) {
            current = {
                book : item.book
            };
        } else {
            if (current.book) {
                item.book = current.book;
            } else {
                throwInvalidReference(raw);
            }
        }

        if (item.chapter) {
            current.chapter = item.chapter;
        } else {
            if (current.chapter) {
                item.chapter = current.chapter;
            } else {
                if (oneChapter.indexOf(item.book) === -1) {
                    if (item.verse) {
                        item.chapter = item.verse;
                        item.verse = {
                            $gte : 1
                        };
                    }
                    if (item.start && !item.start.chapter && item.start.verse) {
                        item.start.chapter = item.start.verse;
                        delete item.start.verse;
                        item.end.chapter = item.end.verse;
                        delete item.end.verse;
                    }
                } else {
                    item.chapter = 1;
                }
            }
        }

        if (item.start) {
            if (!item.start.chapter) {
                for (ctr = item.start.verse; ctr <= item.end.verse; ctr++) {
                    refs.push({
                        book : item.book,
                        chapter : item.chapter,
                        verse : ctr
                    });
                }
            } else {
                if (item.start.verse) {
                    for (ctr = item.start.chapter; ctr <= item.end.chapter; ctr++) {
                        ref = {
                            book : item.book,
                            chapter : ctr
                        };
                        if (ctr === item.start.chapter) {
                            ref.verse = {
                                $gte : item.start.verse
                            };
                        } else if (ctr === item.end.chapter) {
                            ref.verse = {
                                $lte : item.end.verse
                            };
                        } else {
                            ref.verse = {
                                $gte : 1
                            };
                        }
                        refs.push(ref);
                    }
                } else {
                    for (ctr = item.start.chapter; ctr <= item.end.chapter; ctr++) {
                        refs.push({
                            book : item.book,
                            chapter : ctr,
                            verse : {
                                $gte : 1
                            }
                        });
                    }
                }
            }
        } else {
            refs.push(item);
        }
    });

    return refs;
};

var INVALID_VERSE_DATA_MESSAGE = 'Invalid verse data encountered';

function validVerse (verse) {
    var error, tmp, missingProperties = [], emptyStrings = [], invalidTypes = {}, unrecognizedBook = false;

    [ { property : 'book',
        type : 'string' },
        { property : 'chapter',
            type : 'integer' },
        { property : 'verse',
            type : 'integer' },
        { property : 'version',
            type : 'string' },
        { property : 'text',
            type : 'string' } ].forEach(function (required) {
        if (!verse.hasOwnProperty(required.property)) {
            missingProperties.push(required.property);
            return;
        }
        if (required.type === 'string') {
            if (typeof verse[required.property] !== 'string') {
                invalidTypes[required.property] = {
                    expected : 'string',
                    got : typeof verse[required.property]
                };
                return;
            }
            if (verse[required.property].length < 1) {
                emptyStrings.push(required.property);
                return;
            }
        }
        if (required.type === 'integer') {
            tmp = verse[required.property];
            if (typeof tmp !== 'number') {
                tmp = parseInt(tmp);
            }
            if (isNaN(tmp)) {
                invalidTypes[required.property] = {
                    expected : 'integer',
                    got : 'NaN'
                };
                return;
            }
            if (parseInt(tmp) !== tmp) {
                invalidTypes[required.property] = {
                    expected : 'integer',
                    got : 'float'
                };
                return;
            }
            verse[required.property] = tmp;
        }
        if (required.property === 'book' && bookAbbrMap[verse.book.toUpperCase()] === undefined) {
            unrecognizedBook = true;
        }
    });

    if (unrecognizedBook) {
        error = new Error(INVALID_VERSE_DATA_MESSAGE);
        error.unrecognizedBook = true;
    }
    if (missingProperties.length > 0) {
        if (!error) {
            error = new Error(INVALID_VERSE_DATA_MESSAGE);
        }
        error.missing = missingProperties;
    }
    if (emptyStrings.length > 0) {
        if (!error) {
            error = new Error(INVALID_VERSE_DATA_MESSAGE);
        }
        error.empty = emptyStrings;
    }
    if (Object.keys(invalidTypes).length > 0) {
        if (!error) {
            error = new Error(INVALID_VERSE_DATA_MESSAGE);
        }
        error.invalid = invalidTypes;
    }
    if (error) {
        error.got = verse;
        throw error;
    }
    return verse;
}

function referenceComparator (a, b) {
    var comp = bookAbbrMap[a.book.toUpperCase()] - bookAbbrMap[b.book.toUpperCase()];
    if (comp !== 0) {
        return comp;
    }

    comp = a.chapter - b.chapter;
    if (comp !== 0) {
        return comp;
    }

    comp = a.verse - b.verse;
    if (comp !== 0) {
        return comp;
    }

    if (a.version < b.version) {
        return -1;
    }
    if (a.version > b.version) {
        return 1;
    }
    return 0;
}

function buildNormalized (verse) {
    return {
        reference : [verse.book, [verse.chapter, verse.verse].join(':')].join(' '),
        version : verse.version,
        verses : [{
            book : verse.book,
            chapter : verse.chapter,
            verse : verse.verse,
            text : verse.text
        }]
    };
}

Reference.normalize = function (verses) {
    if (Object.prototype.toString.call(verses) === '[object Object]') {
        return Reference.normalize([verses]);
    }
    if (Object.prototype.toString.call(verses) !== '[object Array]') {
        var error = new Error(INVALID_VERSE_DATA_MESSAGE);
        error.got = verses;
        throw error;
    }
    return verses.map(validVerse)
    .sort(referenceComparator)
    .map(buildNormalized);
};

module.exports = Reference;
