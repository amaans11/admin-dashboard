module.exports = {
    setupFiles: ['./src/setupTests.js'],
    coveragePathIgnorePatterns: ['/node_modules/'],
    testEnvironment: 'jsdom',
    coverageReporters: ['html', 'json', 'lcov', 'text', 'clover'],
    collectCoverage: true,
    collectCoverageFrom: ['<rootDir>/src/**/*.js'],
    moduleNameMapper: {
      '\\.(svg|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
        '<rootDir>/__mocks__/fileMock.js',
      '\\.(css|less|scss)$': 'identity-obj-proxy'
    }
  };
  