module.exports = { 
  presets : [
    [
      "@babel/env",
      {
        targets: {
          esmodules: true,
        },
      },
    ],
  ],
  plugins : ["@babel/plugin-transform-runtime", "@babel/plugin-transform-typescript"],
  sourceType : "unambiguous"
};