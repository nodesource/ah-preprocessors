const functionScout = require('function-scout')

/**
 * Scouts functions using [function-scout](https://github.com/nodesource/function-scout)
 * and then adapts the data according to the supplied options.
 * In the process clones function arguments as well and appends them to the returned
 * function info
 *
 * This function is used by the `ResourceProcessor` and most likely you won't have to call
 * it directly.
 *
 * Sample return value:
 *
 * ```js
 *  [ { path: [ 'owner', '_events', 'connection' ],
 *      key: 'connection',
 *      level: 2,
 *      info:
 *       FunctionOrigin {
 *         file: '/Volumes/d/dev/js/async-hooks/ah-net/test/one-tcp-server.listen+close.js',
 *         line: 25,
 *         column: 21,
 *         inferredName: '',
 *         name: 'onconnection' },
 *      id: 2,
 *      arguments: null }]
 * ```
 *
 * @name scoutFunctions
 * @function
 * @param {Object} ctx the context that should be scouted for functions
 * @param {Number} uid the id which is appended to each function info
 *
 * @param {Object} $0 options specifying if arguments and function source are captured and how they are cloned
 *
 * @param {Boolean} [$0.captureArguments=false] if `true` arguments of callbacks
 * are captured when they are processed.
 *
 * @param {Boolean} [$0.captureSource=false] if `true` the source code of callbacks
 * is captured when they are processed.
 *
 * @param {Cloner} $0.cloner used to clone the function arguments
 *
 * @param {String} [$0.name=null] if supplied it will be prepended to all function paths
 *
 * @return {Array.<Object>} array of function information elements, one for each function encountered
 *
 */
module.exports = function scoutFunctions(
    ctx
  , uid
  , { captureSource, captureArguments, cloner, name = null }) {
  const capture = captureArguments || captureSource
  const { functions }  = functionScout(ctx, { referenceFunction: capture })

  function adjustInfo(info) {
    // Point out to the user that these were attached to a specific property
    // of an activity with a specific id
    if (name !== null) info.path.unshift(name)
    info.id = uid

    if (!capture) return

    // attach extra info if so required
    const fn = info.info && info.info.function
    if (fn == null) return

    try {
      info.arguments = cloner.clone(fn.arguments)
    } catch (e) {
      // We aren't allowed to access function arguments, if they
      // were created in 'use strict' mode. This affects all core functions.
      info.arguments = '<Inaccessible>'
    }
    if (this._captureSource) info.source = fn.toString()

    // Make sure we loose the function reference
    // Is delete expensive here? Not passing this into a function,
    // so the Object Map isn't that important.
    // Assigning to undefined is alternative, but clutters return value.
    delete info.info.function
  }

  functions.forEach(adjustInfo, this)
  return functions
}
