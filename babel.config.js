module.exports = { 
  presets : [
    [
      "@babel/env",
      {
        targets: {
          edge: "17",
          chrome: "67",
          firefox: "60",
          safari: "11.1",
          ie: "11",
        },
      },
    ],
  ],
};
