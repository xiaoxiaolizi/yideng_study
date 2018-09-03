// const assert = require('assert');

// const hello = require('../hello');

// // describe可以任意嵌套，以便把相关测试看成一组测试。
// describe('#hello.js', () => {

//     describe('#sum()', () => {
//         before(function () {
//             console.log('before:');
//         });

//         after(function () {
//             console.log('after.');
//         });

//         beforeEach(function () {
//             console.log('  beforeEach:');
//         });

//         afterEach(function () {
//             console.log('  afterEach.');
//         });
//         // 每个it("name", function() {...})就代表一个测试
//         // 编写测试的原则是，一次只测一种情况，且测试代码要非常简单。我们编写多个测试来分别测试不同的输入，并使用assert判断输出是否是我们所期望的。
//         it('#async with done', (done) => {
//             (async function () {
//                 try {
//                     let r = await hello();
//                     assert.strictEqual(r, 15);
//                     done();
//                 } catch (err) {
//                     done(err);
//                 }
//             })();
//         });
//         it('#async function', async () => {
//             let r = await hello();
//             assert.strictEqual(r, 15);
//         });
//     });
// });

const assert = require('assert');

const hello = require('../hello');

describe('#async hello', () => {
    describe('#asyncCalculate()', () => {
        // function(done) {}
        it('#async with done', (done) => {
            (async function () {
                try {
                    let r = await hello();
                    assert.strictEqual(r, 15);
                    done();
                } catch (err) {
                    done(err);
                }
            })();
        });

        it('#async function', async () => {
            let r = await hello();
            assert.strictEqual(r, 15);
        });

        it('#sync function', () => {
            assert(true);
        });
    });
});

