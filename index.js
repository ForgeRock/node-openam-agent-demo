// require('./lib/example1');
// require('./lib/example2');
// require('./lib/example3');

const dirName = process.argv[2] || 'example1';

try {
    require(`./lib/${dirName}`);
} catch (err) {
    console.error(err);
    process.exit(0);
}