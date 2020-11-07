module.exports = {
  'src/**/*.less': ['stylelint --syntax less'],
  'src/**/*.{js,jsx,ts,tsx}': ['npm run lint-staged:js'],
  'src/**/*.{js,jsx,tsx,ts,less,md,json}': [
    'prettier --write',
  ],
};
