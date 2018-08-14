//tslint:disable no-console
//tslint:disable function-name
//tslint:disable no-default-export
//tslint:disable no-implicit-dependencies

import {NodePath} from 'babel-traverse';
import * as t from 'babel-types';

// tslint:disable-next-line typedef
export default function () {
  const webdriverCommands = [
    'click',
    'sendKeys',
  ];

  const protractorApi = [
    'count',
    'isDisplayed',
  ];

  return {
    visitor: {
      Identifier(path: NodePath<t.Identifier>) {
        if (path.node.name === 'it') {
          if (path.parentPath.isCallExpression()) {
            const itFn = path.parent as t.CallExpression;
            if (t.isFunctionExpression(itFn.arguments[1]) || t.isArrowFunctionExpression(itFn.arguments[1])) {
              const callback = itFn.arguments[1] as t.FunctionExpression | t.ArrowFunctionExpression;
              if (!callback.async) {
                callback.async = true;
              }
            }
          }
        }

        if (webdriverCommands.includes(path.node.name) || protractorApi.includes(path.node.name)) {
          if (t.isMemberExpression(path.parentPath)) {
            const wrappingStatement = path.getStatementParent();
            const callExpression = path.findParent((p: NodePath) => t.isCallExpression(p)) as NodePath<t.CallExpression>;
            const validCall = !!callExpression;
            const statementContainsCall = validCall && wrappingStatement.node.start <= callExpression.node.start;
            if (statementContainsCall) {
              if (!callExpression.parentPath.isAwaitExpression()) {
                callExpression.replaceWith(t.awaitExpression(callExpression.node as t.CallExpression));
                callExpression.getFunctionParent().node.async = true;
              }
            }
          }
        }
      },
    },
  };
}
