import { IDataModels } from "../src/interfaces";

export const Constants: IDataModels.ConstantsModel = {
    REQUEST_TYPE_MAPPING: {
        GET: "RETRIEVE_WORKSHOPS",
        POST: "CREATE_WORKSHOP",
        PATCH: "UPDATE_WORKSHOP",
        DELETE: "DELETE_WORKSHOP"
    },
}
