const { injectBabelPlugin } = require("react-app-rewired");
const rewireReactHotLoader = require("react-app-rewire-hot-loader");
module.exports = function override(config, env) {
  config = injectBabelPlugin(
    ["import", { libraryName: "antd", libraryDirectory: "es", style: "css" }],
    config
  );
  config = rewireReactHotLoader(config, env);

  return config;
};

