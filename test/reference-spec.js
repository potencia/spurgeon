'use strict';

var expect = require('chai').expect,
Reference = require('../lib/reference'),
db =
{ asv:
   { john:
      { 1:
         {  1: { book: 'John', chapter: 1, verse:  1, version: 'ASV', text: 'In the beginning was the Word, and the Word was with God, and the Word was God.' },
            2: { book: 'John', chapter: 1, verse:  2, version: 'ASV', text: 'The same was in the beginning with God.' },
            3: { book: 'John', chapter: 1, verse:  3, version: 'ASV', text: 'All things were made through him; and without him was not anything made that hath been made.' },
            4: { book: 'John', chapter: 1, verse:  4, version: 'ASV', text: 'In him was life; and the life was the light of men.' },
            5: { book: 'John', chapter: 1, verse:  5, version: 'ASV', text: 'And the light shineth in the darkness; and the darkness apprehended it not.' },
            6: { book: 'John', chapter: 1, verse:  6, version: 'ASV', text: 'There came a man, sent from God, whose name was John.' },
            7: { book: 'John', chapter: 1, verse:  7, version: 'ASV', text: 'The same came for witness, that he might bear witness of the light, that all might believe through him.' },
            8: { book: 'John', chapter: 1, verse:  8, version: 'ASV', text: 'He was not the light, but came that he might bear witness of the light.' },
            9: { book: 'John', chapter: 1, verse:  9, version: 'ASV', text: 'There was the true light, even the light which lighteth every man, coming into the world.' },
           10: { book: 'John', chapter: 1, verse: 10, version: 'ASV', text: 'He was in the world, and the world was made through him, and the world knew him not.' },
           11: { book: 'John', chapter: 1, verse: 11, version: 'ASV', text: 'He came unto his own, and they that were his own received him not.' },
           12: { book: 'John', chapter: 1, verse: 12, version: 'ASV', text: 'But as many as received him, to them gave he the right to become children of God, even to them that believe on his name:' },
           13: { book: 'John', chapter: 1, verse: 13, version: 'ASV', text: 'who were born, not of blood, nor of the will of the flesh, nor of the will of man, but of God.' },
           14: { book: 'John', chapter: 1, verse: 14, version: 'ASV', text: 'And the Word became flesh, and dwelt among us (and we beheld his glory, glory as of the only begotten from the Father), full of grace and truth.' } } },
     rev:
      { 1:
         { 20: { book: 'Revelation', chapter: 1, verse: 20, version: 'ASV', text: 'the mystery of the seven stars which thou sawest in my right hand, and the seven golden candlesticks. The seven stars are the angels of the seven churches: and the seven candlesticks are seven churches.' } } } },
  kjv:
   { gen:
      { 1:
         { 1: { book: 'Genesis', chapter: 1, verse: 1, version: 'KJV', text: 'In the beginning God create the heaven and the earth.' } } },
     ob:
      { 1:
         { 1: { book: 'Obadiah', chapter: 1, verse: 1, version: 'KJV', text: 'The vision of Obadiah. Thus saith the Lord God concerning Edom; We have heard a rumour from the Lord, and an ambassador is sent among the heathen, Arise ye, and let us rise up against her in battle.' },
           2: { book: 'Obadiah', chapter: 1, verse: 2, version: 'KJV', text: 'Behold, I have made thee small among the heathen: thou art greatly despised.' },
           3: { book: 'Obadiah', chapter: 1, verse: 3, version: 'KJV', text: 'The pride of thine heart hath deceived thee, thou that dwellest in the clefts of the rock, whose habitation is high; that saith in his heart, Who shall bring me down to the ground?' },
           4: { book: 'Obadiah', chapter: 1, verse: 4, version: 'KJV', text: 'Though thou exalt thyself as the eagle, and though thou set thy nest among the stars, thence will I bring thee down, saith the Lord.' },
           5: { book: 'Obadiah', chapter: 1, verse: 5, version: 'KJV', text: 'If thieves came to thee, if robbers by night, (how art thou cut off!) would they not have stolen till they had enough? if the grapegatherers came to thee, would they not leave some grapes?' },
           6: { book: 'Obadiah', chapter: 1, verse: 6, version: 'KJV', text: 'How are the things of Esau searched out! how are his hidden things sought up!' } } },
     john:
      { 1:
         {  1: { book: 'John', chapter: 1, verse:  1, version: 'KJV', text: 'In the beginning was the Word, and the Word was with God, and the Word was God.' },
            2: { book: 'John', chapter: 1, verse:  2, version: 'KJV', text: 'The same was in the beginning with God.' },
            3: { book: 'John', chapter: 1, verse:  3, version: 'KJV', text: 'All things were made by him; and without him was not any thing made that was made.' },
            4: { book: 'John', chapter: 1, verse:  4, version: 'KJV', text: 'In him was life; and the life was the light of men.' },
            5: { book: 'John', chapter: 1, verse:  5, version: 'KJV', text: 'And the light shineth in darkness; and the darkness comprehended it not.' },
            6: { book: 'John', chapter: 1, verse:  6, version: 'KJV', text: 'There was a man sent from God, whose name was John.' },
            7: { book: 'John', chapter: 1, verse:  7, version: 'KJV', text: 'The same came for a witness, to bear witness of the Light, that all men through him might believe.' },
            8: { book: 'John', chapter: 1, verse:  8, version: 'KJV', text: 'He was not that Light, but was sent to bear witness of that Light.' },
            9: { book: 'John', chapter: 1, verse:  9, version: 'KJV', text: 'That was the true Light, which lighteth every man that cometh into the world.' },
           10: { book: 'John', chapter: 1, verse: 10, version: 'KJV', text: 'He was in the world, and the world was made by him, and the world knew him not.' },
           11: { book: 'John', chapter: 1, verse: 11, version: 'KJV', text: 'He came unto his own, and his own received him not.' },
           12: { book: 'John', chapter: 1, verse: 12, version: 'KJV', text: 'But as many as received him, to them gave he power to become the sons of God, even to them that believe on his name:' },
           13: { book: 'John', chapter: 1, verse: 13, version: 'KJV', text: 'Which were born, not of blood, nor of the will of the flesh, nor of the will of man, but of God.' },
           14: { book: 'John', chapter: 1, verse: 14, version: 'KJV', text: 'And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth.' },
           15: { book: 'John', chapter: 1, verse: 15, version: 'KJV', text: 'John bare witness of him, and cried, saying, This was he of whom I spake, He that cometh after me is preferred before me: for he was before me.' },
           16: { book: 'John', chapter: 1, verse: 16, version: 'KJV', text: 'And of his fulness have all we received, and grace for grace.' },
           17: { book: 'John', chapter: 1, verse: 17, version: 'KJV', text: 'For the law was given by Moses, but grace and truth came by Jesus Christ.' },
           18: { book: 'John', chapter: 1, verse: 18, version: 'KJV', text: 'No man hath seen God at any time; the only begotten Son, which is in the bosom of the Father, he hath declared him.' },
           19: { book: 'John', chapter: 1, verse: 19, version: 'KJV', text: 'And this is the record of John, when the Jews sent priests and Levites from Jerusalem to ask him, Who art thou?' },
           20: { book: 'John', chapter: 1, verse: 20, version: 'KJV', text: 'And he confessed, and denied not; but confessed, I am not the Christ.' },
           21: { book: 'John', chapter: 1, verse: 21, version: 'KJV', text: 'And they asked him, What then? Art thou Elias? And he saith, I am not. Art thou that prophet? And he answered, No.' },
           22: { book: 'John', chapter: 1, verse: 22, version: 'KJV', text: 'Then said they unto him, Who art thou? that we may give an answer to them that sent us. What sayest thou of thyself?' },
           23: { book: 'John', chapter: 1, verse: 23, version: 'KJV', text: 'He said, I am the voice of one crying in the wilderness, Make straight the way of the Lord, as said the prophet Esaias.' },
           24: { book: 'John', chapter: 1, verse: 24, version: 'KJV', text: 'And they which were sent were of the Pharisees.' },
           25: { book: 'John', chapter: 1, verse: 25, version: 'KJV', text: 'And they asked him, and said unto him, Why baptizest thou then, if thou be not that Christ, nor Elias, neither that prophet?' },
           26: { book: 'John', chapter: 1, verse: 26, version: 'KJV', text: 'John answered them, saying, I baptize with water: but there standeth one among you, whom ye know not;' },
           27: { book: 'John', chapter: 1, verse: 27, version: 'KJV', text: 'He it is, who coming after me is preferred before me, whose shoe\'s latchet I am not worthy to unloose.' },
           28: { book: 'John', chapter: 1, verse: 28, version: 'KJV', text: 'These things were done in Bethabara beyond Jordan, where John was baptizing.' },
           29: { book: 'John', chapter: 1, verse: 29, version: 'KJV', text: 'The next day John seeth Jesus coming unto him, and saith, Behold the Lamb of God, which taketh away the sin of the world.' },
           30: { book: 'John', chapter: 1, verse: 30, version: 'KJV', text: 'This is he of whom I said, After me cometh a man which is preferred before me: for he was before me.' },
           31: { book: 'John', chapter: 1, verse: 31, version: 'KJV', text: 'And I knew him not: but that he should be made manifest to Israel, therefore am I come baptizing with water.' },
           32: { book: 'John', chapter: 1, verse: 32, version: 'KJV', text: 'And John bare record, saying, I saw the Spirit descending from heaven like a dove, and it abode upon him.' },
           33: { book: 'John', chapter: 1, verse: 33, version: 'KJV', text: 'And I knew him not: but he that sent me to baptize with water, the same said unto me, Upon whom thou shalt see the Spirit descending, and remaining on him, the same is he which baptizeth with the Holy Ghost.' },
           34: { book: 'John', chapter: 1, verse: 34, version: 'KJV', text: 'And I saw, and bare record that this is the Son of God.' },
           35: { book: 'John', chapter: 1, verse: 35, version: 'KJV', text: 'Again the next day after John stood, and two of his disciples;' },
           36: { book: 'John', chapter: 1, verse: 36, version: 'KJV', text: 'And looking upon Jesus as he walked, he saith, Behold the Lamb of God!' },
           37: { book: 'John', chapter: 1, verse: 37, version: 'KJV', text: 'And the two disciples heard him speak, and they followed Jesus.' },
           38: { book: 'John', chapter: 1, verse: 38, version: 'KJV', text: 'Then Jesus turned, and saw them following, and saith unto them, What seek ye? They said unto him, Rabbi, (which is to say, being interpreted, Master,) where dwellest thou?' },
           39: { book: 'John', chapter: 1, verse: 39, version: 'KJV', text: 'He saith unto them, Come and see. They came and saw where he dwelt, and abode with him that day: for it was about the tenth hour.' },
           40: { book: 'John', chapter: 1, verse: 40, version: 'KJV', text: 'One of the two which heard John speak, and followed him, was Andrew, Simon Peter\'s brother.' },
           41: { book: 'John', chapter: 1, verse: 41, version: 'KJV', text: 'He first findeth his own brother Simon, and saith unto him, We have found the Messias, which is, being interpreted, the Christ.' },
           42: { book: 'John', chapter: 1, verse: 42, version: 'KJV', text: 'And he brought him to Jesus. And when Jesus beheld him, he said, Thou art Simon the son of Jona: thou shalt be called Cephas, which is by interpretation, A stone.' },
           43: { book: 'John', chapter: 1, verse: 43, version: 'KJV', text: 'The day following Jesus would go forth into Galilee, and findeth Philip, and saith unto him, Follow me.' },
           44: { book: 'John', chapter: 1, verse: 44, version: 'KJV', text: 'Now Philip was of Bethsaida, the city of Andrew and Peter.' },
           45: { book: 'John', chapter: 1, verse: 45, version: 'KJV', text: 'Philip findeth Nathanael, and saith unto him, We have found him, of whom Moses in the law, and the prophets, did write, Jesus of Nazareth, the son of Joseph.' },
           46: { book: 'John', chapter: 1, verse: 46, version: 'KJV', text: 'And Nathanael said unto him, Can there any good thing come out of Nazareth? Philip saith unto him, Come and see.' },
           47: { book: 'John', chapter: 1, verse: 47, version: 'KJV', text: 'Jesus saw Nathanael coming to him, and saith of him, Behold an Israelite indeed, in whom is no guile!' },
           48: { book: 'John', chapter: 1, verse: 48, version: 'KJV', text: 'Nathanael saith unto him, Whence knowest thou me? Jesus answered and said unto him, Before that Philip called thee, when thou wast under the fig tree, I saw thee.' },
           49: { book: 'John', chapter: 1, verse: 49, version: 'KJV', text: 'Nathanael answered and saith unto him, Rabbi, thou art the Son of God; thou art the King of Israel.' },
           50: { book: 'John', chapter: 1, verse: 50, version: 'KJV', text: 'Jesus answered and said unto him, Because I said unto thee, I saw thee under the fig tree, believest thou? thou shalt see greater things than these.' },
           51: { book: 'John', chapter: 1, verse: 51, version: 'KJV', text: 'And he saith unto him, Verily, verily, I say unto you, Hereafter ye shall see heaven open, and the angels of God ascending and descending upon the Son of man.' } },
        2:
         {  1: { book: 'John', chapter: 2, verse:  1, version: 'KJV', text: 'And the third day there was a marriage in Cana of Galilee; and the mother of Jesus was there:' },
            2: { book: 'John', chapter: 2, verse:  2, version: 'KJV', text: 'And both Jesus was called, and his disciples, to the marriage.' },
            3: { book: 'John', chapter: 2, verse:  3, version: 'KJV', text: 'And when they wanted wine, the mother of Jesus saith unto him, They have no wine.' },
            4: { book: 'John', chapter: 2, verse:  4, version: 'KJV', text: 'Jesus saith unto her, Woman, what have I to do with thee? mine hour is not yet come.' },
            5: { book: 'John', chapter: 2, verse:  5, version: 'KJV', text: 'His mother saith unto the servants, Whatsoever he saith unto you, do it.' },
            6: { book: 'John', chapter: 2, verse:  6, version: 'KJV', text: 'And there were set there six waterpots of stone, after the manner of the purifying of the Jews, containing two or three firkins apiece.' },
            7: { book: 'John', chapter: 2, verse:  7, version: 'KJV', text: 'Jesus saith unto them, Fill the waterpots with water. And they filled them up to the brim.' },
            8: { book: 'John', chapter: 2, verse:  8, version: 'KJV', text: 'And he saith unto them, Draw out now, and bear unto the governor of the feast. And they bare it.' },
            9: { book: 'John', chapter: 2, verse:  9, version: 'KJV', text: 'When the ruler of the feast had tasted the water that was made wine, and knew not whence it was: (but the servants which drew the water knew;) the governor of the feast called the bridegroom,' },
           10: { book: 'John', chapter: 2, verse: 10, version: 'KJV', text: 'And saith unto him, Every man at the beginning doth set forth good wine; and when men have well drunk, then that which is worse: but thou hast kept the good wine until now.' },
           11: { book: 'John', chapter: 2, verse: 11, version: 'KJV', text: 'This beginning of miracles did Jesus in Cana of Galilee, and manifested forth his glory; and his disciples believed on him.' } } },
     rev:
      { 1:
         {  1: { book: 'Revelation', chapter: 1, verse:  1, version: 'KJV', text: 'The Revelation of Jesus Christ, which God gave unto him, to shew unto his servants things which must shortly come to pass; and he sent and signified it by his angel unto his servant John:' },
           20: { book: 'Revelation', chapter: 1, verse: 20, version: 'KJV', text: 'The mystery of the seven stars which thou sawest in my right hand, and the seven golden candlesticks. The seven stars are the angels of the seven churches: and the seven candlesticks which thou sawest are the seven churches.' } },
        22:
         { 21: { book: 'Revelation', chapter: 22, verse: 21, version: 'KJV', text: 'The grace of our Lord Jesus Christ be with you all. Amen.' } } } } };

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

    describe('static .normalize()', function () {
        it('should return an array of objects', function () {
            expect(Reference.normalize(db.kjv.gen[1][1])).to.be.an('array');
        });

        describe('returned objects', function () {
            var normalized;
            beforeEach(function () {
                normalized = Reference.normalize(db.kjv.gen[1][1])[0];
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
                result = Reference.normalize(db.kjv.gen[1][1]);
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
                    var result = Reference.normalize([db.kjv.gen[1][1]]);
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
                var result = Reference.normalize([db.kjv.gen[1][1], db.kjv.rev[22][21]]);
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
                var result = Reference.normalize([db.kjv.rev[22][21], db.kjv.gen[1][1]]);
                expect(result).to.have.length(2);
                expect(result[0].reference).to.equal('Genesis 1:1');
                expect(result[1].reference).to.equal('Revelation 22:21');
            });

            it('should order the verses by book and chapter', function () {
                var result = Reference.normalize([db.kjv.rev[22][21], db.kjv.rev[1][1], db.kjv.gen[1][1]]);
                expect(result).to.have.length(3);
                expect(result[0].reference).to.equal('Genesis 1:1');
                expect(result[1].reference).to.equal('Revelation 1:1');
                expect(result[2].reference).to.equal('Revelation 22:21');
            });

            it('should order the verses by book, chapter, and verse', function () {
                var result = Reference.normalize([db.kjv.rev[22][21], db.kjv.rev[1][20], db.kjv.rev[1][1], db.kjv.gen[1][1]]);
                expect(result).to.have.length(4);
                expect(result[0].reference).to.equal('Genesis 1:1');
                expect(result[1].reference).to.equal('Revelation 1:1');
                expect(result[2].reference).to.equal('Revelation 1:20');
                expect(result[3].reference).to.equal('Revelation 22:21');
            });

            it('should order the verses by book, chapter, verse, and version', function () {
                var result = Reference.normalize([db.kjv.rev[22][21], db.kjv.rev[1][20], db.kjv.rev[1][1], db.kjv.gen[1][1], db.asv.rev[1][20]]);
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

        describe('when passed more than one contiguous verse', function () {
            describe('when all verses are in the same version', function () {
                describe('when all verses are in the same chapter', function () {
                    it('should build one normalized object', function () {
                        var result = Reference.normalize(Object.keys(db.kjv.john[1]).reverse().map(function (v) { return db.kjv.john[1][v]; }));
                        expect(result).to.have.length(1);
                        expect(result[0].reference).to.equal('John 1:1-51');
                        expect(result[0].version).to.equal('KJV');
                        expect(result[0].verses).to.have.length(51);
                        expect(result[0].verses.every(function (d, i) {
                            return d.book === 'John' && d.chapter === 1 && d.verse === i + 1;
                        })).to.be.true;
                    });
                });

                describe('when verses cross a chapter border', function () {
                    describe('when metadata for the version/book/chapter is not available', function () {
                        it('should build two normalized objects', function () {
                            var result = Reference.normalize([db.kjv.john[1][50], db.kjv.john[1][51], db.kjv.john[2][1], db.kjv.john[2][2]]);
                            expect(result).to.have.length(2);
                            expect(result[0].reference).to.equal('John 1:50-51');
                            expect(result[0].version).to.equal('KJV');
                            expect(result[0].verses).to.have.length(2);
                            expect(result[0].verses.every(function (d, i) {
                                return d.book === 'John' && d.chapter === 1 && d.verse === i + 50;
                            })).to.be.true;
                            expect(result[1].reference).to.equal('John 2:1-2');
                            expect(result[1].version).to.equal('KJV');
                            expect(result[1].verses).to.have.length(2);
                            expect(result[1].verses.every(function (d, i) {
                                return d.book === 'John' && d.chapter === 2 && d.verse === i + 1;
                            })).to.be.true;
                        });
                    });

                    describe('when metadata for the version/book/chapter is available', function () {
                        it('should build one normalized object', function () {
                            var result = Reference.normalize([db.kjv.john[1][50], db.kjv.john[1][51], db.kjv.john[2][1], db.kjv.john[2][2]], {'KJV' : {'John' : {1 : {verseCount : 51}}}});
                            expect(result).to.have.length(1);
                            expect(result[0].reference).to.equal('John 1:50-2:2');
                            expect(result[0].version).to.equal('KJV');
                            expect(result[0].verses).to.have.length(4);
                            expect(result[0].verses.slice(0, 2).every(function (d, i) {
                                return d.book === 'John' && d.chapter === 1 && d.verse === i + 50;
                            })).to.be.true;
                            expect(result[0].verses.slice(2).every(function (d, i) {
                                return d.book === 'John' && d.chapter === 2 && d.verse === i + 1;
                            })).to.be.true;
                        });
                    });
                });
            });
        });

        describe('when passed more than one group of contiguous verses', function () {
            describe('when all groups are in the same version', function () {
                describe('when all groups are in the same chapter', function () {
                    it('should build multiple normalized objects', function () {
                        var result = Reference.normalize([1, 5, 17, 14, 16, 13, 15, 6, 2].map(function (v) { return db.kjv.john[1][v]; }));
                        expect(result).to.have.length(3);
                        expect(result[0].reference).to.equal('John 1:1-2');
                        expect(result[0].version).to.equal('KJV');
                        expect(result[0].verses).to.have.length(2);
                        expect(result[0].verses.every(function (d, i) {
                            return d.book === 'John' && d.chapter === 1 && d.verse === i + 1;
                        })).to.be.true;
                        expect(result[1].reference).to.equal('John 1:5-6');
                        expect(result[1].version).to.equal('KJV');
                        expect(result[1].verses).to.have.length(2);
                        expect(result[1].verses.every(function (d, i) {
                            return d.book === 'John' && d.chapter === 1 && d.verse === i + 5;
                        })).to.be.true;
                        expect(result[2].reference).to.equal('John 1:13-17');
                        expect(result[2].version).to.equal('KJV');
                        expect(result[2].verses).to.have.length(5);
                        expect(result[2].verses.every(function (d, i) {
                            return d.book === 'John' && d.chapter === 1 && d.verse === i + 13;
                        })).to.be.true;
                    });
                });

                describe('when all groups are in different chapters', function () {
                    it('should build multiple normalized objects', function () {
                        var result = Reference.normalize([db.kjv.john[2][1], db.kjv.john[1][2], db.kjv.john[1][1], db.kjv.john[2][2]]);
                        expect(result).to.have.length(2);
                        expect(result[0].reference).to.equal('John 1:1-2');
                        expect(result[0].version).to.equal('KJV');
                        expect(result[0].verses).to.have.length(2);
                        expect(result[0].verses.every(function (d, i) {
                            return d.book === 'John' && d.chapter === 1 && d.verse === i + 1;
                        })).to.be.true;
                        expect(result[1].reference).to.equal('John 2:1-2');
                        expect(result[1].version).to.equal('KJV');
                        expect(result[1].verses).to.have.length(2);
                        expect(result[1].verses.every(function (d, i) {
                            return d.book === 'John' && d.chapter === 2 && d.verse === i + 1;
                        })).to.be.true;
                    });
                });
            });

            describe('when groups are in different versions', function () {
                describe('when groups have matching references', function () {
                    it('should sort the groups by reference, then by version', function () {
                        var result = Reference.normalize([db.kjv.john[1][14], db.asv.john[1][1], db.kjv.john[1][2], db.asv.john[1][2], db.kjv.john[1][1], db.asv.john[1][14]]);
                        expect(result).to.have.length(4);
                        expect(result[0].reference).to.equal('John 1:1-2');
                        expect(result[0].version).to.equal('ASV');
                        expect(result[0].verses).to.have.length(2);
                        expect(result[0].verses.every(function (d, i) {
                            return d.book === 'John' && d.chapter === 1 && d.verse === i + 1;
                        })).to.be.true;
                        expect(result[1].reference).to.equal('John 1:1-2');
                        expect(result[1].version).to.equal('KJV');
                        expect(result[1].verses).to.have.length(2);
                        expect(result[1].verses.every(function (d, i) {
                            return d.book === 'John' && d.chapter === 1 && d.verse === i + 1;
                        })).to.be.true;
                        expect(result[2].reference).to.equal('John 1:14');
                        expect(result[2].version).to.equal('ASV');
                        expect(result[2].verses).to.have.length(1);
                        expect(result[2].verses[0].verse).to.equal(14);
                        expect(result[3].reference).to.equal('John 1:14');
                        expect(result[3].version).to.equal('KJV');
                        expect(result[3].verses).to.have.length(1);
                        expect(result[3].verses[0].verse).to.equal(14);
                    });
                });
            });

            describe('when groups have same starting verse', function () {
                it('should sort the groups by starting verse, then by descending length, then by version', function () {
                    var result = Reference.normalize([db.kjv.john[1][14], db.asv.john[1][1], db.kjv.john[1][2], db.kjv.john[1][3], db.asv.john[1][2], db.kjv.john[1][1], db.asv.john[1][14]]);
                    expect(result).to.have.length(4);
                    expect(result[0].reference).to.equal('John 1:1-3');
                    expect(result[0].version).to.equal('KJV');
                    expect(result[0].verses).to.have.length(3);
                    expect(result[0].verses.every(function (d, i) {
                        return d.book === 'John' && d.chapter === 1 && d.verse === i + 1;
                    })).to.be.true;
                    expect(result[1].reference).to.equal('John 1:1-2');
                    expect(result[1].version).to.equal('ASV');
                    expect(result[1].verses).to.have.length(2);
                    expect(result[1].verses.every(function (d, i) {
                        return d.book === 'John' && d.chapter === 1 && d.verse === i + 1;
                    })).to.be.true;
                    expect(result[2].reference).to.equal('John 1:14');
                    expect(result[2].version).to.equal('ASV');
                    expect(result[2].verses).to.have.length(1);
                    expect(result[2].verses[0].verse).to.equal(14);
                    expect(result[3].reference).to.equal('John 1:14');
                    expect(result[3].version).to.equal('KJV');
                    expect(result[3].verses).to.have.length(1);
                    expect(result[3].verses[0].verse).to.equal(14);
                });
            });
        });

        describe('when passed verses from a one chapter book', function () {
            it('should leave out the chapter portion of the reference', function () {
                var result = Reference.normalize([db.kjv.ob[1][1], db.kjv.ob[1][3], db.kjv.ob[1][4], db.kjv.ob[1][5], db.kjv.ob[1][6]]);
                expect(result).to.have.length(2);
                expect(result[0].reference).to.equal('Obadiah 1');
                expect(result[0].version).to.equal('KJV');
                expect(result[0].verses).to.have.length(1);
                expect(result[0].verses[0].book).to.equal('Obadiah');
                expect(result[0].verses[0].chapter).to.equal(1);
                expect(result[0].verses[0].verse).to.equal(1);
                expect(result[1].reference).to.equal('Obadiah 3-6');
                expect(result[1].version).to.equal('KJV');
                expect(result[1].verses).to.have.length(4);
                expect(result[1].verses.every(function (d, i) {
                    return d.book === 'Obadiah' && d.chapter === 1 && d.verse === i + 3;
                })).to.be.true;
            });
        });
    });
});
