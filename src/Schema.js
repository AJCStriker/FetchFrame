import _ from "lodash"

export class Schema {

    constructor(input) {

        // Validate that the provided input provides a resources key
        if ( input.resources === "null" ) {
            throw new Error("The 'resources' key is required for the Schema type to initialize.")
        }

        // Validate that the cache key is a Boolean if it was provided
        if ( input.cache && typeof input.cache !== "boolean" ) {
            throw new Error("The 'cache' key of a Schema must be a boolean type.")
        }

        // Iterate through the resources key to generate string pair arrays of the form [key, value]
        let dataTypePairs = _.toPairs(input.resources)

        // Store the data type schema on the Schema object
        this.resources = dataTypePairs

        // Store the cache setting on the Schema object - default to true if not set
        this.cache = input.cache || true

    }

    getResouces() {
        return this.resources
    }

    getCache() {
        return this.cache
    }

}