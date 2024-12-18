// 清空对等依赖中的node-karin
function readPackage (pkg, context) {
  if (pkg?.['peerDependencies']?.['node-karin'] !== 'file:./lib') {
    delete pkg['peerDependencies']['node-karin']
  }
  return pkg
}

module.exports = {
  hooks: {
    readPackage,
  },
}
