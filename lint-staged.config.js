module.exports = {
  'src/**/*.less': ['stylelint --syntax less'],
  'src/**/*.{js,jsx,ts,tsx}': ['eslint --ext .js,.jsx,.ts,.tsx'],
  'src/**/*.{js,jsx,tsx,ts,less,md,json}': [
    'prettier --write',
  ],
};
