module.exports = { 
  presets : [
    [
      "@babel/env",
      {
        targets: {
          browsers: [
            "Chrome >= 59",
            "FireFox >= 44",
            "last 4 Edge versions"
          ],
        },
      },
    ],
  ],
  plugins : ["@babel/plugin-transform-runtime", "@babel/plugin-transform-typescript",
  "transform-es2015-arrow-functions",
  "transform-class-properties",
  "syntax-class-properties"],
  sourceType : "unambiguous"
};