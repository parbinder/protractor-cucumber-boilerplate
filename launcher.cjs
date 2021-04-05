require('ts-node').register({
    project: "./tsconfig.json",
    compilerOptions: {
        module: 'commonjs'
    },
    disableWarnings: true,
    fast: true
});

module.exports.config = require('./config/protractor.conf.ts').config;