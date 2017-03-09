const facileClone = require('facile-clone')

class Cloner {
  /**
   * Creates a Cloner instance which is just a thin wrapper
   * on top of [facile-clone](https://github.com/thlorenz/facile-clone) and clones an object preserving Buffers and
   * strings according to the options supplied.
   *
   * @name Cloner
   * @constructor
   * @param {Object} $0 options applied when cloning objects
   *
   * @param {number} [$0.bufferLength=0] determines how many elements of Buffers are
   * captured. By default not Buffer data is captured.
   *
   * @param {number} [$0.stringLength=0] determines how much of each string is
   * captured. By default no string data is captured.
   */
  constructor({ bufferLength, stringLength }) {
    this._bufferLength = bufferLength
    this._stringLength = stringLength
  }

  /**
   * Clones the object according to the options supplied in the constructor.
   *
   * @name cloner.clone
   * @function
   * @param {Object} x the object to clone
   * @return {Object} the cloned object
   */
  clone(x) {
    if (x == null) return x
    return facileClone(
        x
      , { bufferLength: this._bufferLength, stringLength: this._stringLength }
    )
  }
}

module.exports = Cloner
