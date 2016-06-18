import _ from "lodash"
import DataLoader from "dataloader"

export class DataType {
    constructor(name, config, context, globalCache) {

        // Validate the provided config contains a dimensions object
        if ( config.dimensions === undefined ) {
            throw new Error("Unable to create Type " + name + " as no dimensions were provided.")
        }

        // Validate that the cache setting is a Boolean
        if ( config.cache && typeof config.cache !== "boolean" ) {
            throw new Error("Unable to create Type " + name + " because a non boolean cache setting was provided.")
        }

        // Store the object name - no need to validate because we know that the Frame cannot send an empty value here
        this.name = name

        // Store the context
        this.context = context

        // Store the cache setting
        this.cache = ( globalCache && config.cache ) || true

        // Unwrap dimension into pairs
        let dimensionPairs = _.toPairs(config.dimensions)

        // Initialize the dimensions
        this.dimensions = _.map(dimensionPairs, (dimensionConfigPair) => {

            // Extract information from the pair
            let [dimensionName, dimensionConfig] = dimensionConfigPair

            // Verify that the dimension configuration contains a retrieve function
            if ( typeof dimensionConfig.retrieve !== "function" ) {
                throw new Error("Unable to create dimension " + dimensionName + " as the provided retrieve value was not a function.")
            }

            // Verify that if the cache option is set to true then a dimension key has been provided
            if ( globalCache && dimensionConfig.cache && typeof dimensionConfig.dimensionKey === "function" ) {
                throw new Error("Unable to create dimension " + dimensionName + " as caching is enabled but no dimension key was provided.")
            }

            // Initialize a new DataLoader instance
            let retrieveFn = (query) => {
                // Call the provided retrieve function with the context and query
                return dimensionConfig.retrieve(query, this.context)
            }

            let loader = new DataLoader(retrieveFn, {
                batch: dimensionConfig.batch || true,
                cache: this.cache,
                cacheKeyFn: (key) => JSON.stringify(key)
            })



        })
    }

    /**
     * Undocumented private method that publishes a value received from any DataLoader with cache set to true
     *
     * @param object Received object
     * @private
     */
    _notifyUpdate(object) {}

    loadBy(dimension, query) {}

    loadManyBy(dimension, query) {}

    markDirty(object) {}

    nuke() {}
}