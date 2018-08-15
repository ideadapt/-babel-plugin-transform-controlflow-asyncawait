
Development:

`npm run test:watch` \
`npm run build`

Usage:

To migrate code.js in place: \
`npx codemod --plugin build/src/main.js __fixtures__/jasmine/code.js` \

To read code.js and write migrated output to test.js \
 `cat  __fixtures__/jasmine/code.js | npx codemod --plugin build/src/main.js --stdio --plugin-options transformAsyncAwait='{"customCalls": "get|open|enter|confirm|clear"}' > test.js`