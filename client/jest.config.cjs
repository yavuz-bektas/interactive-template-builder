module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['vue', 'ts', 'tsx', 'js', 'json'],
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json'
      }
    ],
    '^.+\\.js$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@vue/test-utils$': '<rootDir>/../node_modules/@vue/test-utils/dist/vue-test-utils.cjs.js'
  },
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts']
};
