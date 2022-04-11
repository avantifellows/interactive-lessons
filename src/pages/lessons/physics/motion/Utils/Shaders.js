/**
 * Injects some pieces of GLSL code into the provided shader instance
 * @param {Array} changes - An array of objects. Each object contains the string to replace and the replacement
 * @param {Object} shaderInstance - The shader itself
 */
const injectIntoShader = (changes, shaderInstance) => {
  changes.forEach((change) => {
    shaderInstance = shaderInstance.replace(change.old, change.new)
  })

  return shaderInstance
}

export { injectIntoShader }
