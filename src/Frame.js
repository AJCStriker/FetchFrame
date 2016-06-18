import { Schema } from "./Schema"
import { DataType } from "./DataType"
import camelcase from "camelcase"
import _ from "lodash"

export class Frame {

    constructor(schema, context) {

        // Validate that a Schema was provided
        if ( schema === undefined ) {
            throw new Error("Cannot initialize Frame as no Schema was provided.")
        }

        // Validate that the provided Schema was of the correct type
        if ( ! schema instanceof Schema ) {
            throw new Error("Cannot initialize Frame as the provided Schema was an invalid type.")
        }

        // Replace the context with a default value if none was provided - then attach to the Frame object
        this.context = context || {}

        // Create the DataTypes specified by the Schema and attach them to the Frame object
        _.map(schema.getResouces(), (resource) => {

            // resource now has the form [Resource Name, Resource Config Object]
            let [resourceName, resourceConfig] = resource

            // Create the data type - arguments ( Name, Config, Context, Global Cache Setting )
            let createdDataType = new DataType(resourceName, resourceConfig, this.context, schema.getCache())

            // Add the created data type to the Frame with its camel case name
            this[camelcase(resourceName)] = createdDataType

        })

    }

}