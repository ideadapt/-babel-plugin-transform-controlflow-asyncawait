//tslint:disable function-name
//tslint:disable no-default-export
//tslint:disable no-implicit-dependencies

import {NodePath} from 'babel-traverse';
import * as t from 'babel-types';

// tslint:disable-next-line typedef
export default function () {
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

  function createCustomCallRegex(customNames: string = 'get|open|enter|clear') {
    return new RegExp(`^\\w*(${customNames})\\w*`, 'mi');
  }

  function asyncAwaitIt(callExpr: NodePath<t.CallExpression>) {
    callExpr.replaceWith(t.awaitExpression(callExpr.node));
    callExpr.getFunctionParent().node.async = true;
  }

  function matchesLibraryApiName(identifier: NodePath<t.Identifier>) {
    return (webdriverCommands.includes(identifier.node.name) || protractorApi.includes(identifier.node.name)) &&
      t.isMemberExpression(identifier.parentPath);
  }

  function getCallOf(identifier: NodePath<t.Identifier>) {
    const wrappingStatement = identifier.getStatementParent();
    const callExpr = identifier.findParent((p: NodePath) => t.isCallExpression(p)) as NodePath<t.CallExpression>;
    const statementContainsCall = callExpr != null && wrappingStatement.node.start <= callExpr.node.start;
    if (statementContainsCall) {
      return callExpr;
    }

    return null;
  }

  return {
    name: 'transformAsyncAwait',
    visitor: {
      Identifier(identifier: NodePath<t.Identifier>) {
        if (identifier.node.name === 'it') {
          if (identifier.parentPath.isCallExpression()) {
            const itFn = identifier.parent as t.CallExpression;
            const itCallbackTypeSupported = t.isFunctionExpression(itFn.arguments[1]) || t.isArrowFunctionExpression(itFn.arguments[1]);
            if (itCallbackTypeSupported) {
              const callback = itFn.arguments[1] as t.Function;
              if (!callback.async) {
                callback.async = true;
              }
            }
          }
        }

        if (matchesLibraryApiName(identifier)) {
          const callExpr: NodePath<t.CallExpression> = getCallOf(identifier);
          if (callExpr != null && !callExpr.parentPath.isAwaitExpression()) {
              asyncAwaitIt(callExpr);
          }
        }
      },
      CallExpression(callExpr: NodePath<t.CallExpression>, state: {opts: { customCalls: string}}) {
        if (!callExpr.parentPath.isAwaitExpression() && !callExpr.parentPath.isMemberExpression()) {
          const customCallsRegex = createCustomCallRegex(state.opts.customCalls);
          let methodName = '';
          if (t.isMemberExpression(callExpr.node.callee)) {
            const member = callExpr.node.callee;
            methodName = (member.property as t.Identifier).name;
          } else if (t.isIdentifier(callExpr.node.callee)) {
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
