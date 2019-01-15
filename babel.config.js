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
};
