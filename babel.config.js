const plugin = []
if (process.env.NODE_ENV === 'production') {
  plugin.push("transform-remove-console")
}
module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  plugins: plugin
}