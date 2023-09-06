import {
  type Interceptor,
  type QueryResultRow,
  SchemaValidationError,
} from 'slonik';
import camelize from 'camelize-ts';

export default (): Interceptor => {
  return {
    transformRow: (executionContext, actualQuery, row) => {
      const { resultParser } = executionContext;

      if (!resultParser) {
        return row;
      }

      const validationResult = resultParser.safeParse(camelize(row, true));

      if (!validationResult.success) {
        throw new SchemaValidationError(
          actualQuery,
          JSON.stringify(row),
          validationResult.error.issues,
        );
      }

      return validationResult.data as QueryResultRow;
    },
  };
};