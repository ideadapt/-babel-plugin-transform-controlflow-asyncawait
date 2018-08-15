"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const t = require("babel-types");
function default_1() {
    const webdriverCommands = [
        'click',
        'getText',
        'sendKeys',
        'isSelected',
        'isEnabled',
        'getAttribute'
    ];
    const protractorApi = [
        'count',
        'isDisplayed',
    ];
    function createCustomCallRegex(customNames = 'get|open|enter|clear') {
        return new RegExp("^[.\\w]*(" + customNames + ")\\w*\\([,'a-z\\s\\d]*\\)", 'mi');
    }
    return {
        name: 'transformAsyncAwait',
        visitor: {
            Identifier(path) {
                if (path.node.name === 'it') {
                    if (path.parentPath.isCallExpression()) {
                        const itFn = path.parent;
                        if (t.isFunctionExpression(itFn.arguments[1]) || t.isArrowFunctionExpression(itFn.arguments[1])) {
                            const callback = itFn.arguments[1];
                            if (!callback.async) {
                                callback.async = true;
                            }
                        }
                    }
                }
                if (webdriverCommands.includes(path.node.name) || protractorApi.includes(path.node.name)) {
                    if (t.isMemberExpression(path.parentPath)) {
                        const wrappingStatement = path.getStatementParent();
                        const callExpression = path.findParent((p) => t.isCallExpression(p));
                        const statementContainsCall = callExpression != null && wrappingStatement.node.start <= callExpression.node.start;
                        if (statementContainsCall) {
                            if (!callExpression.parentPath.isAwaitExpression()) {
                                callExpression.replaceWith(t.awaitExpression(callExpression.node));
                                callExpression.getFunctionParent().node.async = true;
                            }
                        }
                    }
                }
            },
            CallExpression(path, state) {
                if (!path.parentPath.isAwaitExpression() && !path.parentPath.isMemberExpression()) {
                    const customCallsRegex = createCustomCallRegex(state.opts.customCalls);
                    console.log(state.opts.customCalls, customCallsRegex);
                    if (customCallsRegex.test(path.getSource())) {
                        path.replaceWith(t.awaitExpression(path.node));
                        path.getFunctionParent().node.async = true;
                    }
                }
            },
        },
    };
}
exports.default = default_1;
//# sourceMappingURL=main.js.map