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
        'getAttribute',
        'isPresent',
        'getId',
    ];
    const protractorApi = [
        'expect',
        'first',
        'last',
        'count',
        'isDisplayed',
        'setLocation',
        'getLocation',
        'navigate',
        'executeScript',
        'waitForAngular',
    ];
    function createCustomCallRegex(customNames = 'get|open|enter|clear') {
        return new RegExp(`^\\w*(${customNames})\\w*`, 'mi');
    }
    function asyncAwaitIt(callExpr) {
        callExpr.replaceWith(t.awaitExpression(callExpr.node));
        callExpr.getFunctionParent().node.async = true;
    }
    function matchesLibraryApiName(identifier) {
        return (webdriverCommands.includes(identifier.node.name) || protractorApi.includes(identifier.node.name)) &&
            t.isMemberExpression(identifier.parentPath);
    }
    function getCallOf(identifier) {
        const wrappingStatement = identifier.getStatementParent();
        const callExpr = identifier.findParent((p) => t.isCallExpression(p));
        const statementContainsCall = callExpr != null && wrappingStatement.node.start <= callExpr.node.start;
        if (statementContainsCall) {
            return callExpr;
        }
        return null;
    }
    function isArgumentOfExpectCall(callExpr) {
        if (callExpr.parentPath.isCallExpression()) {
            const parent = callExpr.parentPath.node;
            if (t.isIdentifier(parent.callee)) {
                if (parent.callee.name === 'expect') {
                    return true;
                }
            }
        }
        return false;
    }
    return {
        name: 'transformAsyncAwait',
        visitor: {
            Identifier(identifier) {
                if (identifier.node.name === 'it') {
                    if (identifier.parentPath.isCallExpression()) {
                        const itFn = identifier.parent;
                        const itCallbackTypeSupported = t.isFunctionExpression(itFn.arguments[1]) || t.isArrowFunctionExpression(itFn.arguments[1]);
                        if (itCallbackTypeSupported) {
                            const callback = itFn.arguments[1];
                            if (!callback.async) {
                                callback.async = true;
                            }
                        }
                    }
                }
                if (matchesLibraryApiName(identifier) || identifier.node.name === 'expect') {
                    const callExpr = getCallOf(identifier);
                    if (callExpr != null && !callExpr.parentPath.isAwaitExpression() && !isArgumentOfExpectCall(callExpr)) {
                        asyncAwaitIt(callExpr);
                    }
                }
            },
            CallExpression(callExpr, state) {
                if (!callExpr.parentPath.isAwaitExpression() && !callExpr.parentPath.isMemberExpression()) {
                    if (isArgumentOfExpectCall(callExpr)) {
                        return;
                    }
                    const customCallsRegex = createCustomCallRegex(state.opts.customCalls);
                    let methodName = '';
                    if (t.isMemberExpression(callExpr.node.callee)) {
                        const member = callExpr.node.callee;
                        methodName = member.property.name;
                    }
                    else if (t.isIdentifier(callExpr.node.callee)) {
                        methodName = callExpr.node.callee.name;
                    }
                    if (customCallsRegex.test(methodName)) {
                        asyncAwaitIt(callExpr);
                    }
                }
            },
        },
    };
}
exports.default = default_1;
//# sourceMappingURL=main.js.map