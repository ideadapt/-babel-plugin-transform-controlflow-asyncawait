//tslint:disable no-console
//tslint:disable function-name
//tslint:disable no-default-export
//tslint:disable no-implicit-dependencies

import {NodePath} from 'babel-traverse';
import {ArrowFunctionExpression, CallExpression, FunctionExpression, Identifier} from 'babel-types';

export default function() {
  return {
    visitor: {
      Identifier(path: NodePath<Identifier>) {
        if (path.parentPath.isCallExpression()) {
          const describeFunction = path.parent as CallExpression;
          if (describeFunction.arguments[1]) {
            const argType = describeFunction.arguments[1].type;
            if (argType === 'FunctionExpression' || argType === 'ArrowFunctionExpression') {
              const callback = describeFunction.arguments[1] as FunctionExpression|ArrowFunctionExpression;
              if (!callback.async) {
                callback.async = true;
              }
            }
          }
        }
      },
    },
  };
}
