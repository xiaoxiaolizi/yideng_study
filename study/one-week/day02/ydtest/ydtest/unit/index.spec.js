describe("测试函数基本的API",function(){
    it("+1函数的应用",function(){
        expect(window.test(1)).toBe(1);
        expect(window.test(2)).toBe(3);
    })
});