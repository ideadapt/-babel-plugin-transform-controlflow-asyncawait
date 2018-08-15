
Development:

`npm run test:watch` \
`npm run build`

# Usage:

To migrate code.js in place: \
`npx codemod --plugin build/src/main.js __fixtures__/jasmine/code.js` 

To read code.js and write migrated output to migrated.js \
 `cat  __fixtures__/jasmine/code.js | npx codemod --plugin build/src/main.js --stdio --plugin-options transformAsyncAwait='{"customCalls": "get|open|enter|confirm|clear"}' > migrated.js`

 ## Plugin Options

 ### customCalls
 Provide substrings of function names that return most probably a promise. \
 For example you might have a convention, that your page objects have getter methods that are to be prefixed with "get". \
 For instance `new HeaderPO().getMenu();`. If you provide "get" as option value, this would be transformed to `await new HeaderPO().getMenu();`.
 To provide multiple prefixes, concatenate them via pipe | (see example in usage chapter). \
 \
 Default: 'get|open|enter|clear'