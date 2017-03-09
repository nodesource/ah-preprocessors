class ResourceProcessor {
/**
  * Creates an instance of ResourceProcessor.
  * Never call this directly, instead extend it to create a specific processor
  * for your particular resource type, i.e. `NetworkResourceProcessor`.
  *
  * Makes sure that each resource is only processed once.
  *
  * @name ResourceProcesor
  * @constructor
  * @param {Object} $0 options specifying if arguments and function source are captured and how they are cloned
  *
  * @param {Cloner} $0.cloner used to clone the resource information
  *
  * @param {Boolean} [$0.captureArguments=false] if `true` arguments of callbacks
  * are captured when they are processed.
  *
  * @param {Boolean} [$0.captureSource=false] if `true` the source code of callbacks
  * is captured when they are processed.
  *
  */
  constructor({ cloner, captureArguments, captureSource }) {
    this._cloner = cloner
    this._processed = new Set()
    this._captureArguments = captureArguments
    this._captureSource = captureSource
  }

  /**
   * Cleans up all captured resources which means that they are processed,
   * meaningful data extracted and the reference to the actual resource removed
   * so it can be GCed.
   *
   * @name resourceProcessor.cleanAllResources
   * @function
   *
   * @param {Object} activities the activities whose resources should be cleaned
   *
   * @param {Boolean} [collectFunctionInfo=false] if `true` it will collect info of all
   * functions found on the hooks resources.
   */
  cleanAllResources(activities, { collectFunctionInfo = false }) {
    for (const uid of activities.keys()) {
      this.cleanupResource(uid, activities, { collectFunctionInfo })
    }
  }

  /**
   * Cleans the particular resource of the activity found by the uid as part of the activities.
   * If the uid isn't found in the activities or the activity is `null` this function returns
   * without doing anything.
   *
   * @name resourceProcessor.cleanupResource
   * @function
   * @param {Number|String} uid the id that identifies the activity whose resource should be cleaned
   * @param {Map.<Number|String, Object>} activities the activities that contain the activity whose resource should be
   * cleaned
   * @param {Boolean} [collectFunctionInfo=false] if `true` it will collect info of all
   * functions found on the hooks resources.
   */
  cleanupResource(uid, activities, { collectFunctionInfo }) {
    if (this._processed.has(uid)) return
    const activity = activities.get(uid)
    if (activity == null) return
    const processed = this._processResource(uid, activity.resource, { collectFunctionInfo })
    activity.resource = processed
    this._processed.add(uid)
  }

  // @abstract
  _processResource(uid, resource, { collectFunctionInfo }) {
    throw new Error('Not Implemented: _processResource')
  }
}

module.exports = ResourceProcessor
