module.exports = {
 preset: 'ts-jest',
 transform: { "^.+\\.(t|j)sx?$": ['ts-jest', { isolatedModules: true }] },
 testEnvironment: 'node',
 bail: false,
 testTimeout: 5000,
 testPathIgnorePatterns: [
  "/node_modules/",
  "/dist/",
 ],
 coveragePathIgnorePatterns: ['node_modules'],
};
