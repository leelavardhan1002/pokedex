const scanner = require('sonarqube-scanner');

scanner(
  {
    serverUrl: 'http://localhost:9000',
    options: {
      'sonar.login': process.env.SONARQUBE_TOKEN,
      'sonar.projectVersion': '0.0.1',
      'sonar.sources': './src',
      'sonar.test.inclusions': '**/*.test.ts,**/*.test.tsx',
      'sonar.sourceEncoding': 'UTF-8',
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
    },
  },
  () => process.exit()
);
