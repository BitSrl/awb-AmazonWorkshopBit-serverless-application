/* eslint-disable @typescript-eslint/no-namespace */

import { logger } from '../utils';

const CONSTRUCTOR = 'constructor | ';
const LOG_PREFIX_NAMESPACE = 'AWBErrors | ';

export namespace AWBErrors {

    /**
     *
     *
     * @export
     * @class AWBError
     * @extends {Error}
     */
    abstract class AWBError extends Error {

        public intfcMsgCode = 'NA';
        public statusCode = 200;
    }

    /*************** ERROR CODE-400 STARTS ***************/

    /**
     *
     *
     * @export
     * @class BadRequest
     * @extends {AWBError}
     */
    export class BadRequest extends AWBError {

        constructor(message: string) {
            super(message)

            const LOG_PREFIX_FN = LOG_PREFIX_NAMESPACE + this.constructor.name + CONSTRUCTOR;
            logger.error(`${LOG_PREFIX_FN} intfcMsgCode: ${'Bad Request'}, message: ${message}`);

            this.name = this.constructor.name;
            this.intfcMsgCode = 'Bad Request';
            this.statusCode = 405;
            BadRequest.captureStackTrace(this, this.constructor);//This clips the constructor invocation from the stack trace.
        }
    }


}