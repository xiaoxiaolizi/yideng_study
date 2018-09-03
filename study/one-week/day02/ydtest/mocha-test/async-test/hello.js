const fs = require('mz/fs');

// 这个async函数通过读取data.txt的内容获取表达式，这样它就变成了异步
// a simple async function:
module.exports = async () => {
    let expression = await fs.readFile('./data.txt', 'utf-8');
    let fn = new Function('return ' + expression);
    let r = fn();
    console.log(`Calculate: ${expression} = ${r}`);
    return r;
};