import Ajv from 'ajv';
import { logger } from '../utils';
const LOG_PREFIX_CLASS = 'JsonValidator | ';

interface ValidatorResponse {
    valid: boolean;
    errors?: any;
}

export class JsonValidator {

    /**
     * Validates the inputJson using ajv and the inputSchema. Takes an optional ajv options
     * to customize the way validation is performed
     * @param inputJson
     * @param inputSchema
     * @param ajvOptions
     */
    public static validateJson(inputJson: any, inputSchema: any, ajvOptions?: any): ValidatorResponse {
        const logPrefixFn = LOG_PREFIX_CLASS + 'validateJson | ';

        const validator = new Ajv(ajvOptions);
        const isValid: boolean = validator.validate(inputSchema, inputJson) as boolean;

        const response: ValidatorResponse = {
            valid: isValid.valueOf()
        }

        if (!isValid) {
            const errors = validator.errors;
            response.errors = errors;
            logger.debug(`${logPrefixFn} Errors: ${JSON.stringify(errors)}`);
        } else {
            logger.debug(`${logPrefixFn} Valid Event`);
        }

        return response;
    }

}