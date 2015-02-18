'use strict';

var expect = require('chai').expect,
Reference = require('../lib/reference');

describe('Reference', function () {
    describe('static .split()', function () {
        it('should return an array', function () {
            expect(Reference.split('Genesis 1:1')).to.be.an('array');
        });

        it('should split out the book name', function () {
            var ref = Reference.split('Genesis 1:1')[0];
            expect(ref.book).to.equal('Genesis');
        });

        it('should split out the chapter', function () {
            var ref = Reference.split('Genesis 3:2')[0];
            expect(ref.chapter).to.equal(3);
        });

        it('should split out the verse', function () {
            var ref = Reference.split('Genesis 1:2')[0];
            expect(ref.verse).to.equal(2);
        });

        it('should produce 2 references when comma separates verse numbers', function () {
            var refs = Reference.split('Genesis 1:1,2');
            expect(refs).to.deep.equal([{
                book : 'Genesis',
                chapter : 1,
                verse : 1
            },
            {
                book : 'Genesis',
                chapter : 1,
                verse : 2
            }]);
        });

        it('should produce 2 references when semicolon separates verse numbers', function () {
            var refs = Reference.split('II Peter 3:3;7');
            expect(refs).to.deep.equal([{
                book : 'II Peter',
                chapter : 3,
                verse : 3
            },
            {
                book : 'II Peter',
                chapter : 3,
                verse : 7
            }]);
        });

        it('should produce 2 references when comma separates chapter and verse numbers', function () {
            var refs = Reference.split('Genesis 1:3,2:1');
            expect(refs).to.deep.equal([{
                book : 'Genesis',
                chapter : 1,
                verse : 3
            },
            {
                book : 'Genesis',
                chapter : 2,
                verse : 1
            }]);
        });

        it('should produce 2 references when semicolon separates chapter and verse numbers', function () {
            var refs = Reference.split('Genesis 2:4;3:20');
            expect(refs).to.deep.equal([{
                book : 'Genesis',
                chapter : 2,
                verse : 4
            },
            {
                book : 'Genesis',
                chapter : 3,
                verse : 20
            }]);
        });

        it('should produce 2 references when comma separates books', function () {
            var refs = Reference.split('Genesis 2:4, Exodus 1:1');
            expect(refs).to.deep.equal([{
                book : 'Genesis',
                chapter : 2,
                verse : 4
            },
            {
                book : 'Exodus',
                chapter : 1,
                verse : 1
            }]);
        });

        it('should produce 2 references when semicolon separates books', function () {
            var refs = Reference.split('Genesis 2:4; Exodus 1:1');
            expect(refs).to.deep.equal([{
                book : 'Genesis',
                chapter : 2,
                verse : 4
            },
            {
                book : 'Exodus',
                chapter : 1,
                verse : 1
            }]);
        });

        it('should result in chapter only when verse number is not present in reference', function () {
            var refs = Reference.split('Genesis 50');
            expect(refs).to.deep.equal([{
                book : 'Genesis',
                chapter : 50,
                verse : {
                    $gte : 1
                }
            }]);
        });

        it('should result in chapter 1 and verse when only the verse number is present in a 1 chapter book reference', function () {
            var refs = Reference.split('Jude 25');
            expect(refs).to.deep.equal([{
                book : 'Jude',
                chapter : 1,
                verse : 25
            }]);
        });

        it('should result in chapter 1 and verses when only a verse range is present in a 1 chapter book reference', function () {
            var refs = Reference.split('Obadiah 1-3');
            expect(refs).to.deep.equal([{
                book : 'Obadiah',
                chapter : 1,
                verse : 1
            },
            {
                book : 'Obadiah',
                chapter : 1,
                verse : 2
            },
            {
                book : 'Obadiah',
                chapter : 1,
                verse : 3
            }]);
        });

        it('should result in chapter 1 and multiple verses when only a verse separated by commas are present in a 1 chapter book reference', function () {
            var refs = Reference.split('III John 1,3');
            expect(refs).to.deep.equal([{
                book : 'III John',
                chapter : 1,
                verse : 1
            },
            {
                book : 'III John',
                chapter : 1,
                verse : 3
            }]);
        });

        it('should result in in 2 chapter only references when chapters are separated by commas and verse numbers are not present', function () {
            var refs = Reference.split('Genesis 49, 50');
            expect(refs).to.deep.equal([{
                book : 'Genesis',
                chapter : 49,
                verse : {
                    $gte : 1
                }
            },
            {
                book : 'Genesis',
                chapter : 50,
                verse : {
                    $gte : 1
                }
            }]);
        });

        it('should produce multiple references when verse is a range', function () {
            var refs = Reference.split('Genesis 1:1-5');
            expect(refs).to.deep.equal([{
                book : 'Genesis',
                chapter : 1,
                verse : 1
            },
            {
                book : 'Genesis',
                chapter : 1,
                verse : 2
            },
            {
                book : 'Genesis',
                chapter : 1,
                verse : 3
            },
            {
                book : 'Genesis',
                chapter : 1,
                verse : 4
            },
            {
                book : 'Genesis',
                chapter : 1,
                verse : 5
            }]);
        });

        it('should produce multiple multi-verse references when chapter and verse is a range', function () {
            var refs = Reference.split('Genesis 1:10-3:6');
            expect(refs).to.deep.equal([{
                book : 'Genesis',
                chapter : 1,
                verse : {
                    $gte : 10
                }
            },
            {
                book : 'Genesis',
                chapter : 2,
                verse : {
                    $gte : 1
                }
            },
            {
                book : 'Genesis',
                chapter : 3,
                verse : {
                    $lte : 6
                }
            }]);
        });

        it('should produce multiple multi-verse references when chapter is a range and there are no verses', function () {
            var refs = Reference.split('Genesis 40-45');
            expect(refs).to.deep.equal([{
                book : 'Genesis',
                chapter : 40,
                verse : {
                    $gte : 1
                }
            },
            {
                book : 'Genesis',
                chapter : 41,
                verse : {
                    $gte : 1
                }
            },
            {
                book : 'Genesis',
                chapter : 42,
                verse : {
                    $gte : 1
                }
            },
            {
                book : 'Genesis',
                chapter : 43,
                verse : {
                    $gte : 1
                }
            },
            {
                book : 'Genesis',
                chapter : 44,
                verse : {
                    $gte : 1
                }
            },
            {
                book : 'Genesis',
                chapter : 45,
                verse : {
                    $gte : 1
                }
            }]);
        });

        it('should correctly handle ranges and commas together', function () {
            var refs = Reference.split('Genesis 1:10,12-14');
            expect(refs).to.deep.equal([{
                book : 'Genesis',
                chapter : 1,
                verse : 10
            },
            {
                book : 'Genesis',
                chapter : 1,
                verse : 12
            },
            {
                book : 'Genesis',
                chapter : 1,
                verse : 13
            },
            {
                book : 'Genesis',
                chapter : 1,
                verse : 14
            }]);
        });

        it('should correctly handle ranges separated by commas together', function () {
            var refs = Reference.split('Genesis 1:10-11,14-15');
            expect(refs).to.deep.equal([{
                book : 'Genesis',
                chapter : 1,
                verse : 10
            },
            {
                book : 'Genesis',
                chapter : 1,
                verse : 11
            },
            {
                book : 'Genesis',
                chapter : 1,
                verse : 14
            },
            {
                book : 'Genesis',
                chapter : 1,
                verse : 15
            }]);
        });

        it('should throw an error when the book cannot be determined', function () {
            expect(Reference.split.bind(null, '50'))
            .to.throw(Error, 'Invalid Scripture Reference [ 50 ]');
        });

        it('should throw an error when the book cannot be determined', function () {
            expect(Reference.split.bind(null, '50:3'))
            .to.throw(Error, 'Invalid Scripture Reference [ 50:3 ]');
        });

        it('should throw an error when only the book is provided', function () {
            expect(Reference.split.bind(null, 'II Peter'))
            .to.throw(Error, 'Invalid Scripture Reference [ II Peter ]');
        });

        it('should throw an error when letters are in the chapter', function () {
            expect(Reference.split.bind(null, 'II Peter 3A:4'))
            .to.throw(Error, 'Invalid Scripture Reference [ II Peter 3A:4 ]');
        });

        it('should throw an error when letters are in the verse', function () {
            expect(Reference.split.bind(null, 'II Peter 3:4a'))
            .to.throw(Error, 'Invalid Scripture Reference [ II Peter 3:4a ]');
        });

        it('should throw an error when letters are in the verse', function () {
            expect(Reference.split.bind(null, 'II Peter 3:2,4ab'))
            .to.throw(Error, 'Invalid Scripture Reference [ II Peter 3:2,4ab ]');
        });

        it('should throw an error when the book is incorrect', function () {
            expect(Reference.split.bind(null, 'Hezekiah 4:18'))
            .to.throw(Error, 'Invalid Scripture Reference [ Hezekiah 4:18 ]. Could not determine the book from [ Hezekiah ].');
        });

        describe('reference abbreviations', function () {
            it('should allow a period as part of the book name', function () {
                expect(Reference.split('Gen. 1:1')[0].book).to.equal('Genesis');
            });

            it('for Genesis', function () {
                expect(Reference.split('Genesis 1:1')[0].book).to.equal('Genesis');
                expect(Reference.split('Gen 1:1')[0].book).to.equal('Genesis');
                expect(Reference.split('Ge 1:1')[0].book).to.equal('Genesis');
            });

            it('for Exodus', function () {
                expect(Reference.split('Exodus 1:1')[0].book).to.equal('Exodus');
                expect(Reference.split('Exo 1:1')[0].book).to.equal('Exodus');
                expect(Reference.split('Ex 1:1')[0].book).to.equal('Exodus');
            });

            it('for Leviticus', function () {
                expect(Reference.split('Leviticus 1:1')[0].book).to.equal('Leviticus');
                expect(Reference.split('Levi 1:1')[0].book).to.equal('Leviticus');
                expect(Reference.split('Lev 1:1')[0].book).to.equal('Leviticus');
                expect(Reference.split('Le 1:1')[0].book).to.equal('Leviticus');
            });

            it('for Numbers', function () {
                expect(Reference.split('Numbers 1:1')[0].book).to.equal('Numbers');
                expect(Reference.split('Number 1:1')[0].book).to.equal('Numbers');
                expect(Reference.split('Num 1:1')[0].book).to.equal('Numbers');
                expect(Reference.split('Nu 1:1')[0].book).to.equal('Numbers');
            });

            it('for Deuteronomy', function () {
                expect(Reference.split('Deuteronomy 1:1')[0].book).to.equal('Deuteronomy');
                expect(Reference.split('Deut 1:1')[0].book).to.equal('Deuteronomy');
                expect(Reference.split('De 1:1')[0].book).to.equal('Deuteronomy');
            });

            it('for Joshua', function () {
                expect(Reference.split('Joshua 1:1')[0].book).to.equal('Joshua');
                expect(Reference.split('Josh 1:1')[0].book).to.equal('Joshua');
                expect(Reference.split('Jos 1:1')[0].book).to.equal('Joshua');
            });

            it('for Judges', function () {
                expect(Reference.split('Judges 1:1')[0].book).to.equal('Judges');
                expect(Reference.split('Judge 1:1')[0].book).to.equal('Judges');
                expect(Reference.split('Ju 1:1')[0].book).to.equal('Judges');
            });

            it('for Ruth', function () {
                expect(Reference.split('Ruth 1:1')[0].book).to.equal('Ruth');
                expect(Reference.split('Ru 1:1')[0].book).to.equal('Ruth');
            });

            it('for I Samuel', function () {
                expect(Reference.split('I Samuel 1:1')[0].book).to.equal('I Samuel');
                expect(Reference.split('I Samu 1:1')[0].book).to.equal('I Samuel');
                expect(Reference.split('I Sam 1:1')[0].book).to.equal('I Samuel');
                expect(Reference.split('1 Samuel 1:1')[0].book).to.equal('I Samuel');
                expect(Reference.split('1 Samu 1:1')[0].book).to.equal('I Samuel');
                expect(Reference.split('1 Sam 1:1')[0].book).to.equal('I Samuel');
                expect(Reference.split('1 Sa 1:1')[0].book).to.equal('I Samuel');
            });

            it('for II Samuel', function () {
                expect(Reference.split('II Samuel 1:1')[0].book).to.equal('II Samuel');
                expect(Reference.split('II Samu 1:1')[0].book).to.equal('II Samuel');
                expect(Reference.split('II Sam 1:1')[0].book).to.equal('II Samuel');
                expect(Reference.split('II Sa 1:1')[0].book).to.equal('II Samuel');
                expect(Reference.split('2 Samuel 1:1')[0].book).to.equal('II Samuel');
                expect(Reference.split('2 Samu 1:1')[0].book).to.equal('II Samuel');
                expect(Reference.split('2 Sam 1:1')[0].book).to.equal('II Samuel');
                expect(Reference.split('2 Sa 1:1')[0].book).to.equal('II Samuel');
            });

            it('for I Kings', function () {
                expect(Reference.split('I Kings 1:1')[0].book).to.equal('I Kings');
                expect(Reference.split('I King 1:1')[0].book).to.equal('I Kings');
                expect(Reference.split('I Kn 1:1')[0].book).to.equal('I Kings');
                expect(Reference.split('I Kg 1:1')[0].book).to.equal('I Kings');
                expect(Reference.split('1 Kings 1:1')[0].book).to.equal('I Kings');
                expect(Reference.split('1 King 1:1')[0].book).to.equal('I Kings');
                expect(Reference.split('1 Kn 1:1')[0].book).to.equal('I Kings');
                expect(Reference.split('1 Kg 1:1')[0].book).to.equal('I Kings');
            });

            it('for II Kings', function () {
                expect(Reference.split('II Kings 1:1')[0].book).to.equal('II Kings');
                expect(Reference.split('II King 1:1')[0].book).to.equal('II Kings');
                expect(Reference.split('II Kn 1:1')[0].book).to.equal('II Kings');
                expect(Reference.split('II Kg 1:1')[0].book).to.equal('II Kings');
                expect(Reference.split('2 Kings 1:1')[0].book).to.equal('II Kings');
                expect(Reference.split('2 King 1:1')[0].book).to.equal('II Kings');
                expect(Reference.split('2 Kn 1:1')[0].book).to.equal('II Kings');
                expect(Reference.split('2 Kg 1:1')[0].book).to.equal('II Kings');
            });

            it('for I Chronicles', function () {
                expect(Reference.split('I Chronicles 1:1')[0].book).to.equal('I Chronicles');
                expect(Reference.split('I Chronicle 1:1')[0].book).to.equal('I Chronicles');
                expect(Reference.split('I Chron 1:1')[0].book).to.equal('I Chronicles');
                expect(Reference.split('I Cron 1:1')[0].book).to.equal('I Chronicles');
                expect(Reference.split('I Chro 1:1')[0].book).to.equal('I Chronicles');
                expect(Reference.split('I Chr 1:1')[0].book).to.equal('I Chronicles');
                expect(Reference.split('I Ch 1:1')[0].book).to.equal('I Chronicles');
                expect(Reference.split('1 Chronicles 1:1')[0].book).to.equal('I Chronicles');
                expect(Reference.split('1 Chronicle 1:1')[0].book).to.equal('I Chronicles');
                expect(Reference.split('1 Chron 1:1')[0].book).to.equal('I Chronicles');
                expect(Reference.split('1 Cron 1:1')[0].book).to.equal('I Chronicles');
                expect(Reference.split('1 Chro 1:1')[0].book).to.equal('I Chronicles');
                expect(Reference.split('1 Chr 1:1')[0].book).to.equal('I Chronicles');
                expect(Reference.split('1 Ch 1:1')[0].book).to.equal('I Chronicles');
            });

            it('for II Chronicles', function () {
                expect(Reference.split('II Chronicles 1:1')[0].book).to.equal('II Chronicles');
                expect(Reference.split('II Chronicle 1:1')[0].book).to.equal('II Chronicles');
                expect(Reference.split('II Chron 1:1')[0].book).to.equal('II Chronicles');
                expect(Reference.split('II Cron 1:1')[0].book).to.equal('II Chronicles');
                expect(Reference.split('II Chro 1:1')[0].book).to.equal('II Chronicles');
                expect(Reference.split('II Chr 1:1')[0].book).to.equal('II Chronicles');
                expect(Reference.split('II Ch 1:1')[0].book).to.equal('II Chronicles');
                expect(Reference.split('2 Chronicles 1:1')[0].book).to.equal('II Chronicles');
                expect(Reference.split('2 Chronicle 1:1')[0].book).to.equal('II Chronicles');
                expect(Reference.split('2 Chron 1:1')[0].book).to.equal('II Chronicles');
                expect(Reference.split('2 Cron 1:1')[0].book).to.equal('II Chronicles');
                expect(Reference.split('2 Chro 1:1')[0].book).to.equal('II Chronicles');
                expect(Reference.split('2 Chr 1:1')[0].book).to.equal('II Chronicles');
                expect(Reference.split('2 Ch 1:1')[0].book).to.equal('II Chronicles');
            });

            it('for Ezra', function () {
                expect(Reference.split('Ezra 1:1')[0].book).to.equal('Ezra');
                expect(Reference.split('Ezr 1:1')[0].book).to.equal('Ezra');
            });

            it('for Nehemiah', function () {
                expect(Reference.split('Nehemiah 1:1')[0].book).to.equal('Nehemiah');
                expect(Reference.split('Nehe 1:1')[0].book).to.equal('Nehemiah');
                expect(Reference.split('Neh 1:1')[0].book).to.equal('Nehemiah');
                expect(Reference.split('Ne 1:1')[0].book).to.equal('Nehemiah');
            });

            it('for Esther', function () {
                expect(Reference.split('Esther 1:1')[0].book).to.equal('Esther');
                expect(Reference.split('Esth 1:1')[0].book).to.equal('Esther');
                expect(Reference.split('Est 1:1')[0].book).to.equal('Esther');
                expect(Reference.split('Es 1:1')[0].book).to.equal('Esther');
            });

            it('for Job', function () {
                expect(Reference.split('Job 1:1')[0].book).to.equal('Job');
                expect(Reference.split('Jb 1:1')[0].book).to.equal('Job');
            });

            it('for Psalms', function () {
                expect(Reference.split('Psalms 1:1')[0].book).to.equal('Psalms');
                expect(Reference.split('Psalm 1:1')[0].book).to.equal('Psalms');
                expect(Reference.split('Psa 1:1')[0].book).to.equal('Psalms');
                expect(Reference.split('Ps 1:1')[0].book).to.equal('Psalms');
            });

            it('for Proverbs', function () {
                expect(Reference.split('Proverbs 1:1')[0].book).to.equal('Proverbs');
                expect(Reference.split('Proverb 1:1')[0].book).to.equal('Proverbs');
                expect(Reference.split('Prov 1:1')[0].book).to.equal('Proverbs');
                expect(Reference.split('Pro 1:1')[0].book).to.equal('Proverbs');
                expect(Reference.split('Pr 1:1')[0].book).to.equal('Proverbs');
            });

            it('for Ecclesiastes', function () {
                expect(Reference.split('Ecclesiastes 1:1')[0].book).to.equal('Ecclesiastes');
                expect(Reference.split('Eccl 1:1')[0].book).to.equal('Ecclesiastes');
                expect(Reference.split('Ecc 1:1')[0].book).to.equal('Ecclesiastes');
                expect(Reference.split('Ec 1:1')[0].book).to.equal('Ecclesiastes');
            });

            it('for Song of Songs', function () {
                expect(Reference.split('Song of Songs 1:1')[0].book).to.equal('Song of Songs');
                expect(Reference.split('Song of Solomon 1:1')[0].book).to.equal('Song of Songs');
                expect(Reference.split('Song of Sol 1:1')[0].book).to.equal('Song of Songs');
                expect(Reference.split('Song 1:1')[0].book).to.equal('Song of Songs');
                expect(Reference.split('Sol 1:1')[0].book).to.equal('Song of Songs');
                expect(Reference.split('Sos 1:1')[0].book).to.equal('Song of Songs');
                expect(Reference.split('So 1:1')[0].book).to.equal('Song of Songs');
            });

            it('for Isaiah', function () {
                expect(Reference.split('Isaiah 1:1')[0].book).to.equal('Isaiah');
                expect(Reference.split('Isa 1:1')[0].book).to.equal('Isaiah');
                expect(Reference.split('Is 1:1')[0].book).to.equal('Isaiah');
            });

            it('for Jeremiah', function () {
                expect(Reference.split('Jeremiah 1:1')[0].book).to.equal('Jeremiah');
                expect(Reference.split('Jere 1:1')[0].book).to.equal('Jeremiah');
                expect(Reference.split('Jer 1:1')[0].book).to.equal('Jeremiah');
                expect(Reference.split('Je 1:1')[0].book).to.equal('Jeremiah');
            });

            it('for Lamentations', function () {
                expect(Reference.split('Lamentations 1:1')[0].book).to.equal('Lamentations');
                expect(Reference.split('Lamentation 1:1')[0].book).to.equal('Lamentations');
                expect(Reference.split('Lam 1:1')[0].book).to.equal('Lamentations');
                expect(Reference.split('La 1:1')[0].book).to.equal('Lamentations');
            });

            it('for Ezekiel', function () {
                expect(Reference.split('Ezekiel 1:1')[0].book).to.equal('Ezekiel');
                expect(Reference.split('Ezek 1:1')[0].book).to.equal('Ezekiel');
                expect(Reference.split('Eze 1:1')[0].book).to.equal('Ezekiel');
            });

            it('for Daniel', function () {
                expect(Reference.split('Daniel 1:1')[0].book).to.equal('Daniel');
                expect(Reference.split('Dan 1:1')[0].book).to.equal('Daniel');
                expect(Reference.split('Da 1:1')[0].book).to.equal('Daniel');
            });

            it('for Hosea', function () {
                expect(Reference.split('Hosea 1:1')[0].book).to.equal('Hosea');
                expect(Reference.split('Hos 1:1')[0].book).to.equal('Hosea');
                expect(Reference.split('Ho 1:1')[0].book).to.equal('Hosea');
            });

            it('for Joel', function () {
                expect(Reference.split('Joel 1:1')[0].book).to.equal('Joel');
                expect(Reference.split('Joe 1:1')[0].book).to.equal('Joel');
                expect(Reference.split('Jo 1:1')[0].book).to.equal('Joel');
            });

            it('for Amos', function () {
                expect(Reference.split('Amos 1:1')[0].book).to.equal('Amos');
                expect(Reference.split('Amo 1:1')[0].book).to.equal('Amos');
                expect(Reference.split('Am 1:1')[0].book).to.equal('Amos');
            });

            it('for Obadiah', function () {
                expect(Reference.split('Obadiah 1:1')[0].book).to.equal('Obadiah');
                expect(Reference.split('Obad 1:1')[0].book).to.equal('Obadiah');
                expect(Reference.split('Oba 1:1')[0].book).to.equal('Obadiah');
                expect(Reference.split('Ob 1:1')[0].book).to.equal('Obadiah');
            });

            it('for Jonah', function () {
                expect(Reference.split('Jonah 1:1')[0].book).to.equal('Jonah');
                expect(Reference.split('Jon 1:1')[0].book).to.equal('Jonah');
                expect(Reference.split('Jh 1:1')[0].book).to.equal('Jonah');
            });

            it('for Micah', function () {
                expect(Reference.split('Micah 1:1')[0].book).to.equal('Micah');
                expect(Reference.split('Mic 1:1')[0].book).to.equal('Micah');
                expect(Reference.split('Mi 1:1')[0].book).to.equal('Micah');
            });

            it('for Nahum', function () {
                expect(Reference.split('Nahum 1:1')[0].book).to.equal('Nahum');
                expect(Reference.split('Nah 1:1')[0].book).to.equal('Nahum');
                expect(Reference.split('Na 1:1')[0].book).to.equal('Nahum');
            });

            it('for Habakkuk', function () {
                expect(Reference.split('Habakkuk 1:1')[0].book).to.equal('Habakkuk');
                expect(Reference.split('Habak 1:1')[0].book).to.equal('Habakkuk');
                expect(Reference.split('Hab 1:1')[0].book).to.equal('Habakkuk');
            });

            it('for Zephaniah', function () {
                expect(Reference.split('Zephaniah 1:1')[0].book).to.equal('Zephaniah');
                expect(Reference.split('Zeph 1:1')[0].book).to.equal('Zephaniah');
                expect(Reference.split('Zep 1:1')[0].book).to.equal('Zephaniah');
            });

            it('for Haggai', function () {
                expect(Reference.split('Haggai 1:1')[0].book).to.equal('Haggai');
                expect(Reference.split('Hagg 1:1')[0].book).to.equal('Haggai');
                expect(Reference.split('Hag 1:1')[0].book).to.equal('Haggai');
            });

            it('for Zechariah', function () {
                expect(Reference.split('Zechariah 1:1')[0].book).to.equal('Zechariah');
                expect(Reference.split('Zech 1:1')[0].book).to.equal('Zechariah');
                expect(Reference.split('Zec 1:1')[0].book).to.equal('Zechariah');
            });

            it('for Malachi', function () {
                expect(Reference.split('Malachi 1:1')[0].book).to.equal('Malachi');
                expect(Reference.split('Mal 1:1')[0].book).to.equal('Malachi');
                expect(Reference.split('Ma 1:1')[0].book).to.equal('Malachi');
            });

            it('for Matthew', function () {
                expect(Reference.split('Matthew 1:1')[0].book).to.equal('Matthew');
                expect(Reference.split('Matt 1:1')[0].book).to.equal('Matthew');
                expect(Reference.split('Mat 1:1')[0].book).to.equal('Matthew');
                expect(Reference.split('Mt 1:1')[0].book).to.equal('Matthew');
            });

            it('for Mark', function () {
                expect(Reference.split('Mark 1:1')[0].book).to.equal('Mark');
                expect(Reference.split('Mar 1:1')[0].book).to.equal('Mark');
                expect(Reference.split('Mk 1:1')[0].book).to.equal('Mark');
            });

            it('for Luke', function () {
                expect(Reference.split('Luke 1:1')[0].book).to.equal('Luke');
                expect(Reference.split('Luk 1:1')[0].book).to.equal('Luke');
                expect(Reference.split('Lk 1:1')[0].book).to.equal('Luke');
            });

            it('for John', function () {
                expect(Reference.split('John 1:1')[0].book).to.equal('John');
                expect(Reference.split('Joh 1:1')[0].book).to.equal('John');
                expect(Reference.split('Jn 1:1')[0].book).to.equal('John');
            });

            it('for Acts', function () {
                expect(Reference.split('Acts 1:1')[0].book).to.equal('Acts');
                expect(Reference.split('Act 1:1')[0].book).to.equal('Acts');
                expect(Reference.split('Ac 1:1')[0].book).to.equal('Acts');
            });

            it('for Romans', function () {
                expect(Reference.split('Romans 1:1')[0].book).to.equal('Romans');
                expect(Reference.split('Roman 1:1')[0].book).to.equal('Romans');
                expect(Reference.split('Rom 1:1')[0].book).to.equal('Romans');
                expect(Reference.split('Ro 1:1')[0].book).to.equal('Romans');
            });

            it('for I Corinthians', function () {
                expect(Reference.split('I Corinthians 1:1')[0].book).to.equal('I Corinthians');
                expect(Reference.split('I Corinthian 1:1')[0].book).to.equal('I Corinthians');
                expect(Reference.split('I Cor 1:1')[0].book).to.equal('I Corinthians');
                expect(Reference.split('I Co 1:1')[0].book).to.equal('I Corinthians');
                expect(Reference.split('1 Corinthians 1:1')[0].book).to.equal('I Corinthians');
                expect(Reference.split('1 Corinthian 1:1')[0].book).to.equal('I Corinthians');
                expect(Reference.split('1 Cor 1:1')[0].book).to.equal('I Corinthians');
                expect(Reference.split('1 Co 1:1')[0].book).to.equal('I Corinthians');
            });

            it('for II Corinthians', function () {
                expect(Reference.split('II Corinthians 1:1')[0].book).to.equal('II Corinthians');
                expect(Reference.split('II Corinthian 1:1')[0].book).to.equal('II Corinthians');
                expect(Reference.split('II Cor 1:1')[0].book).to.equal('II Corinthians');
                expect(Reference.split('II Co 1:1')[0].book).to.equal('II Corinthians');
                expect(Reference.split('2 Corinthians 1:1')[0].book).to.equal('II Corinthians');
                expect(Reference.split('2 Corinthian 1:1')[0].book).to.equal('II Corinthians');
                expect(Reference.split('2 Cor 1:1')[0].book).to.equal('II Corinthians');
                expect(Reference.split('2 Co 1:1')[0].book).to.equal('II Corinthians');
            });

            it('for Galatians', function () {
                expect(Reference.split('Galatians 1:1')[0].book).to.equal('Galatians');
                expect(Reference.split('Galatian 1:1')[0].book).to.equal('Galatians');
                expect(Reference.split('Gal 1:1')[0].book).to.equal('Galatians');
                expect(Reference.split('Ga 1:1')[0].book).to.equal('Galatians');
            });

            it('for Ephesians', function () {
                expect(Reference.split('Ephesians 1:1')[0].book).to.equal('Ephesians');
                expect(Reference.split('Ephesian 1:1')[0].book).to.equal('Ephesians');
                expect(Reference.split('Eph 1:1')[0].book).to.equal('Ephesians');
                expect(Reference.split('Ep 1:1')[0].book).to.equal('Ephesians');
            });

            it('for Philippians', function () {
                expect(Reference.split('Philippians 1:1')[0].book).to.equal('Philippians');
                expect(Reference.split('Philippian 1:1')[0].book).to.equal('Philippians');
                expect(Reference.split('Phil 1:1')[0].book).to.equal('Philippians');
                expect(Reference.split('Ph 1:1')[0].book).to.equal('Philippians');
            });

            it('for Colossians', function () {
                expect(Reference.split('Colossians 1:1')[0].book).to.equal('Colossians');
                expect(Reference.split('Colossian 1:1')[0].book).to.equal('Colossians');
                expect(Reference.split('Col 1:1')[0].book).to.equal('Colossians');
                expect(Reference.split('Co 1:1')[0].book).to.equal('Colossians');
            });

            it('for I Thessalonians', function () {
                expect(Reference.split('I Thessalonians 1:1')[0].book).to.equal('I Thessalonians');
                expect(Reference.split('I Thessalonian 1:1')[0].book).to.equal('I Thessalonians');
                expect(Reference.split('I Thes 1:1')[0].book).to.equal('I Thessalonians');
                expect(Reference.split('I Th 1:1')[0].book).to.equal('I Thessalonians');
                expect(Reference.split('1 Thessalonians 1:1')[0].book).to.equal('I Thessalonians');
                expect(Reference.split('1 Thessalonian 1:1')[0].book).to.equal('I Thessalonians');
                expect(Reference.split('1 Thes 1:1')[0].book).to.equal('I Thessalonians');
                expect(Reference.split('1 Th 1:1')[0].book).to.equal('I Thessalonians');
            });

            it('for II Thessalonians', function () {
                expect(Reference.split('II Thessalonians 1:1')[0].book).to.equal('II Thessalonians');
                expect(Reference.split('II Thessalonian 1:1')[0].book).to.equal('II Thessalonians');
                expect(Reference.split('II Thes 1:1')[0].book).to.equal('II Thessalonians');
                expect(Reference.split('II Th 1:1')[0].book).to.equal('II Thessalonians');
                expect(Reference.split('2 Thessalonians 1:1')[0].book).to.equal('II Thessalonians');
                expect(Reference.split('2 Thessalonian 1:1')[0].book).to.equal('II Thessalonians');
                expect(Reference.split('2 Thes 1:1')[0].book).to.equal('II Thessalonians');
                expect(Reference.split('2 Th 1:1')[0].book).to.equal('II Thessalonians');
            });

            it('for I Timothy', function () {
                expect(Reference.split('I Timothy 1:1')[0].book).to.equal('I Timothy');
                expect(Reference.split('I Timo 1:1')[0].book).to.equal('I Timothy');
                expect(Reference.split('I Tim 1:1')[0].book).to.equal('I Timothy');
                expect(Reference.split('I Ti 1:1')[0].book).to.equal('I Timothy');
                expect(Reference.split('1 Timothy 1:1')[0].book).to.equal('I Timothy');
                expect(Reference.split('1 Timo 1:1')[0].book).to.equal('I Timothy');
                expect(Reference.split('1 Tim 1:1')[0].book).to.equal('I Timothy');
                expect(Reference.split('1 Ti 1:1')[0].book).to.equal('I Timothy');
            });

            it('for II Timothy', function () {
                expect(Reference.split('II Timothy 1:1')[0].book).to.equal('II Timothy');
                expect(Reference.split('II Timo 1:1')[0].book).to.equal('II Timothy');
                expect(Reference.split('II Tim 1:1')[0].book).to.equal('II Timothy');
                expect(Reference.split('II Ti 1:1')[0].book).to.equal('II Timothy');
                expect(Reference.split('2 Timothy 1:1')[0].book).to.equal('II Timothy');
                expect(Reference.split('2 Timo 1:1')[0].book).to.equal('II Timothy');
                expect(Reference.split('2 Tim 1:1')[0].book).to.equal('II Timothy');
                expect(Reference.split('2 Ti 1:1')[0].book).to.equal('II Timothy');
            });

            it('for Titus', function () {
                expect(Reference.split('Titus 1:1')[0].book).to.equal('Titus');
                expect(Reference.split('Tit 1:1')[0].book).to.equal('Titus');
                expect(Reference.split('Ti 1:1')[0].book).to.equal('Titus');
            });

            it('for Philemon', function () {
                expect(Reference.split('Philemon 1:1')[0].book).to.equal('Philemon');
                expect(Reference.split('Pn 1:1')[0].book).to.equal('Philemon');
            });

            it('for Hebrews', function () {
                expect(Reference.split('Hebrews 1:1')[0].book).to.equal('Hebrews');
                expect(Reference.split('Hebrew 1:1')[0].book).to.equal('Hebrews');
                expect(Reference.split('Heb 1:1')[0].book).to.equal('Hebrews');
                expect(Reference.split('He 1:1')[0].book).to.equal('Hebrews');
            });

            it('for James', function () {
                expect(Reference.split('James 1:1')[0].book).to.equal('James');
                expect(Reference.split('Jam 1:1')[0].book).to.equal('James');
                expect(Reference.split('Ja 1:1')[0].book).to.equal('James');
                expect(Reference.split('Js 1:1')[0].book).to.equal('James');
            });

            it('for I Peter', function () {
                expect(Reference.split('I Peter 1:1')[0].book).to.equal('I Peter');
                expect(Reference.split('I Pete 1:1')[0].book).to.equal('I Peter');
                expect(Reference.split('I Pet 1:1')[0].book).to.equal('I Peter');
                expect(Reference.split('I Pe 1:1')[0].book).to.equal('I Peter');
                expect(Reference.split('1 Peter 1:1')[0].book).to.equal('I Peter');
                expect(Reference.split('1 Pete 1:1')[0].book).to.equal('I Peter');
                expect(Reference.split('1 Pet 1:1')[0].book).to.equal('I Peter');
                expect(Reference.split('1 Pe 1:1')[0].book).to.equal('I Peter');
            });

            it('for II Peter', function () {
                expect(Reference.split('II Peter 1:1')[0].book).to.equal('II Peter');
                expect(Reference.split('II Pete 1:1')[0].book).to.equal('II Peter');
                expect(Reference.split('II Pet 1:1')[0].book).to.equal('II Peter');
                expect(Reference.split('II Pe 1:1')[0].book).to.equal('II Peter');
                expect(Reference.split('2 Peter 1:1')[0].book).to.equal('II Peter');
                expect(Reference.split('2 Pete 1:1')[0].book).to.equal('II Peter');
                expect(Reference.split('2 Pet 1:1')[0].book).to.equal('II Peter');
                expect(Reference.split('2 Pe 1:1')[0].book).to.equal('II Peter');
            });

            it('for I John', function () {
                expect(Reference.split('I John 1:1')[0].book).to.equal('I John');
                expect(Reference.split('I Jhn 1:1')[0].book).to.equal('I John');
                expect(Reference.split('I Jn 1:1')[0].book).to.equal('I John');
                expect(Reference.split('1 John 1:1')[0].book).to.equal('I John');
                expect(Reference.split('1 Jhn 1:1')[0].book).to.equal('I John');
                expect(Reference.split('1 Jn 1:1')[0].book).to.equal('I John');
            });

            it('for II John', function () {
                expect(Reference.split('II John 1:1')[0].book).to.equal('II John');
                expect(Reference.split('II Jhn 1:1')[0].book).to.equal('II John');
                expect(Reference.split('II Jn 1:1')[0].book).to.equal('II John');
                expect(Reference.split('2 John 1:1')[0].book).to.equal('II John');
                expect(Reference.split('2 Jhn 1:1')[0].book).to.equal('II John');
                expect(Reference.split('2 Jn 1:1')[0].book).to.equal('II John');
            });

            it('for III John', function () {
                expect(Reference.split('III John 1:1')[0].book).to.equal('III John');
                expect(Reference.split('III Jhn 1:1')[0].book).to.equal('III John');
                expect(Reference.split('III Jn 1:1')[0].book).to.equal('III John');
                expect(Reference.split('3 John 1:1')[0].book).to.equal('III John');
                expect(Reference.split('3 Jhn 1:1')[0].book).to.equal('III John');
                expect(Reference.split('3 Jn 1:1')[0].book).to.equal('III John');
            });

            it('for Jude', function () {
                expect(Reference.split('Jude 1:1')[0].book).to.equal('Jude');
                expect(Reference.split('Jd 1:1')[0].book).to.equal('Jude');
            });

            it('for Revelation', function () {
                expect(Reference.split('Revelation 1:1')[0].book).to.equal('Revelation');
                expect(Reference.split('Reve 1:1')[0].book).to.equal('Revelation');
                expect(Reference.split('Rev 1:1')[0].book).to.equal('Revelation');
                expect(Reference.split('Re 1:1')[0].book).to.equal('Revelation');
            });
        });
    });

    var verses = {
        asv : {
            rev : {
                1 : {
                    20 : {
                        book : 'Revelation',
                        chapter : 1,
                        verse : 20,
                        version : 'ASV',
                        text : 'the mystery of the seven stars which thou sawest in my right hand, and the seven golden candlesticks. The seven stars are the angels of the seven churches: and the seven candlesticks are seven churches.'
                    }
                }
            }
        },
        kjv : {
            gen : {
                1 : {
                    1 : {
                        book : 'Genesis',
                        chapter : 1,
                        verse : 1,
                        version : 'KJV',
                        text : 'In the beginning God create the heaven and the earth.'
                    }
                }
            },
            rev : {
                1 : {
                    1 : {
                        book : 'Revelation',
                        chapter : 1,
                        verse : 1,
                        version : 'KJV',
                        text : 'The Revelation of Jesus Christ, which God gave unto him, to shew unto his servants things which must shortly come to pass; and he sent and signified it by his angel unto his servant John:'
                    },
                    20 : {
                        book : 'Revelation',
                        chapter : 1,
                        verse : 20,
                        version : 'KJV',
                        text : 'The mystery of the seven stars which thou sawest in my right hand, and the seven golden candlesticks. The seven stars are the angels of the seven churches: and the seven candlesticks which thou sawest are the seven churches.'
                    }
                },
                22 : {
                    21 : {
                        book : 'Revelation',
                        chapter : 22,
                        verse : 21,
                        version : 'KJV',
                        text : 'The grace of our Lord Jesus Christ be with you all. Amen.'
                    }
                }
            }
        }
    };

    describe('static .normalize()', function () {
        it('should return an array of objects', function () {
            expect(Reference.normalize(verses.kjv.gen[1][1])).to.be.an('array');
        });

        describe('returned objects', function () {
            var normalized;
            beforeEach(function () {
                normalized = Reference.normalize(verses.kjv.gen[1][1])[0];
            });

            it('should have a reference string property', function () {
                expect(normalized.reference).to.be.a('string');
            });

            it('should have a version string property', function () {
                expect(normalized.version).to.be.a('string');
            });

            it('should have a verses array property', function () {
                expect(normalized.verses).to.be.an('array');
            });
        });

        describe('when passed an invalid argument', function () {
            it('should throw an error', function () {
                try {
                    Reference.normalize('Genesis 1:1');
                    expect(false, 'Expected an error').to.be.true;
                } catch (err) {
                    expect(err.message).to.equal('Invalid verse data encountered');
                    expect(err.got).to.equal('Genesis 1:1');
                }
            });
        });

        describe('when passed an empty object', function () {
            it('should throw an error', function () {
                try {
                    Reference.normalize({});
                    expect(false, 'Expected an error').to.be.true;
                } catch (err) {
                    expect(err.message).to.equal('Invalid verse data encountered');
                    expect(err.missing).to.deep.equal(['book', 'chapter', 'verse', 'version', 'text']);
                    expect(err.invalid).to.be.undefined;
                    expect(err.empty).to.be.undefined;
                    expect(err.got).to.deep.equal({});
                }
            });
        });

        describe('when passed an invalid object', function () {
            it('should throw an error', function () {
                try {
                    Reference.normalize({
                        book : {},
                        chapter : 'abc',
                        verse : 1.1,
                        version : 0,
                        text : ''
                    });
                    expect(false, 'Expected an error').to.be.true;
                } catch (err) {
                    expect(err.message).to.equal('Invalid verse data encountered');
                    expect(err.missing).to.be.undefined;
                    expect(err.invalid).to.deep.equal({
                        book : {
                            expected : 'string',
                            got : 'object'
                        },
                        chapter : {
                            expected : 'integer',
                            got : 'NaN'
                        },
                        verse : {
                            expected : 'integer',
                            got : 'float'
                        },
                        version : {
                            expected : 'string',
                            got : 'number'

                        }
                    });
                    expect(err.empty).to.deep.equal(['text']);
                    expect(err.got).to.deep.equal({
                        book : {},
                        chapter : 'abc',
                        verse : 1.1,
                        version : 0,
                        text : ''
                    });
                }
            });
        });

        describe('when passed a single verse object', function () {
            var result;

            beforeEach(function () {
                result = Reference.normalize(verses.kjv.gen[1][1]);
            });

            it('should return one object in the array', function () {
                expect(result).to.have.length(1);
            });

            it('should build normalized from the object', function () {
                expect(result[0]).to.deep.equal({
                    reference : 'Genesis 1:1',
                    version : 'KJV',
                    verses : [
                        {
                            book : 'Genesis',
                            chapter : 1,
                            verse : 1,
                            text : 'In the beginning God create the heaven and the earth.'
                        }
                    ]
                });
            });
        });

        describe('when passed a one length object', function () {
            describe('when it is invalid', function () {
                it('should throw an error', function () {
                    try {
                        Reference.normalize([{
                            book : 'Hezekiah',
                            chapter : 0,
                            verse : true,
                            version : ''
                        }]);
                        expect(false, 'Expected an error').to.be.true;
                    } catch (err) {
                        expect(err.message).to.equal('Invalid verse data encountered');
                        expect(err.unrecognizedBook).to.be.true;
                        expect(err.missing).to.deep.equal(['text']);
                        expect(err.invalid).to.deep.equal({
                            verse : {
                                expected : 'integer',
                                got : 'NaN'
                            }
                        });
                        expect(err.empty).to.deep.equal(['version']);
                        expect(err.got).to.deep.equal({
                            book : 'Hezekiah',
                            chapter : 0,
                            verse : true,
                            version : ''
                        });
                    }
                });
            });

            describe('when it is valid', function () {
                it('should build one normalized object', function () {
                    var result = Reference.normalize([verses.kjv.gen[1][1]]);
                    expect(result).to.have.length(1);
                    expect(result[0]).to.deep.equal({
                        reference : 'Genesis 1:1',
                        version : 'KJV',
                        verses : [
                            {
                                book : 'Genesis',
                                chapter : 1,
                                verse : 1,
                                text : 'In the beginning God create the heaven and the earth.'
                            }
                        ]
                    });
                });
            });
        });

        describe('when passed more than one non-contiguous verses', function () {
            it('should build normalized objects', function () {
                var result = Reference.normalize([verses.kjv.gen[1][1], verses.kjv.rev[22][21]]);
                expect(result).to.have.length(2);
                expect(result[0]).to.deep.equal({
                    reference : 'Genesis 1:1',
                    version : 'KJV',
                    verses : [
                        {
                            book : 'Genesis',
                            chapter : 1,
                            verse : 1,
                            text : 'In the beginning God create the heaven and the earth.'
                        }
                    ]
                });
                expect(result[1]).to.deep.equal({
                    reference : 'Revelation 22:21',
                    version : 'KJV',
                    verses : [
                        {
                            book : 'Revelation',
                            chapter : 22,
                            verse : 21,
                            text : 'The grace of our Lord Jesus Christ be with you all. Amen.'
                        }
                    ]
                });
            });

            it('should order the verses by book', function () {
                var result = Reference.normalize([verses.kjv.rev[22][21], verses.kjv.gen[1][1]]);
                expect(result).to.have.length(2);
                expect(result[0].reference).to.equal('Genesis 1:1');
                expect(result[1].reference).to.equal('Revelation 22:21');
            });

            it('should order the verses by book and chapter', function () {
                var result = Reference.normalize([verses.kjv.rev[22][21], verses.kjv.rev[1][1], verses.kjv.gen[1][1]]);
                expect(result).to.have.length(3);
                expect(result[0].reference).to.equal('Genesis 1:1');
                expect(result[1].reference).to.equal('Revelation 1:1');
                expect(result[2].reference).to.equal('Revelation 22:21');
            });

            it('should order the verses by book, chapter, and verse', function () {
                var result = Reference.normalize([verses.kjv.rev[22][21], verses.kjv.rev[1][20], verses.kjv.rev[1][1], verses.kjv.gen[1][1]]);
                expect(result).to.have.length(4);
                expect(result[0].reference).to.equal('Genesis 1:1');
                expect(result[1].reference).to.equal('Revelation 1:1');
                expect(result[2].reference).to.equal('Revelation 1:20');
                expect(result[3].reference).to.equal('Revelation 22:21');
            });

            it('should order the verses by book, chapter, verse, and version', function () {
                var result = Reference.normalize([verses.kjv.rev[22][21], verses.kjv.rev[1][20], verses.kjv.rev[1][1], verses.kjv.gen[1][1], verses.asv.rev[1][20]]);
                expect(result).to.have.length(5);
                expect(result[0].reference).to.equal('Genesis 1:1');
                expect(result[1].reference).to.equal('Revelation 1:1');
                expect(result[2].reference).to.equal('Revelation 1:20');
                expect(result[2].version).to.equal('ASV');
                expect(result[3].reference).to.equal('Revelation 1:20');
                expect(result[3].version).to.equal('KJV');
                expect(result[4].reference).to.equal('Revelation 22:21');
            });
        });
    });
});
