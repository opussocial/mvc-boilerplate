process.env.NODE_ENV = 'test';
import Jasmine from 'jasmine';

async function runTests() {
  const jasmine = new Jasmine({});
  jasmine.loadConfigFile('spec/support/jasmine.json');
  jasmine.execute();
}

runTests();
