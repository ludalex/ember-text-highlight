// (1)  Test-Infrastructure Dependencies
import {module} from 'qunit';
import test from 'ember-sinon-qunit/test-support/test';


// (2)  Test-Infrastructure Setup
// -

// (3)  Test-Convenience Dependencies
// -

// (4)  Test-Project Dependencies
//      - setup dependency mocks either here if always needed or in before/beforeEach hooks
import {
  default as textHighlightHelperFn,
  indicesImplementation,
  regexImplementation
} from 'dummy/helpers/text-highlight';
import * as regexImplementationModule from 'ember-text-highlight/-private/regex-implementation';
import * as indicesImplementationModule from 'ember-text-highlight/-private/indices-implementation';
import * as envDetectionModule from 'ember-text-highlight/-private/env-detection';

// (5)  Test-Project Global Fake Data
//      - declare here if needed in various tests
//      - please leave "region" comments as it allows some IDEs to collapse the lines in between
//      - please declare all variables here as "var" instead of "let" or "const" as var hoisting makes it easier
//        to reference them
//region GLOBAL FAKE DATA
const MAX_VALUE_LENGTH_FOR_INDICES_IMPL = 250;
//endregion

// (6)  Parameterized Test Scenarios
//      - sometimes the test setup is the same but it makes sense to test with a wide variety of input data
//      - declare each input scenario as an array element with the desired input and expected output

//region PARAMETERIZED TEST SCENARIOS
const scenarios = [
  // implicit case insensitive
  {
    input: {
      query: 'ab',
      target: 'TestAb'
    },
    expectedResult: {
      string: 'Test<span class="mark">Ab</span>'
    }
  },
  {
    input: {
      query: 'ab',
      target: 'AbTest'
    },
    expectedResult: {
      string: '<span class="mark">Ab</span>Test'
    }
  },
  {
    input: {
      query: 'ab',
      target: 'TeAbst'
    },
    expectedResult: {
      string: 'Te<span class="mark">Ab</span>st'
    }
  },
  {
    input: {
      query: 'ab',
      target: 'Ababab'
    },
    expectedResult: {
      string: '<span class="mark">Ab</span><span class="mark">ab</span><span class="mark">ab</span>'
    }
  },
  {
    input: {
      query: 'hall',
      target: 'Hallo'
    },
    expectedResult: {
      string: '<span class="mark">Hall</span>o'
    }
  },
  {
    input: {
      query: '+',
      target: 'Hallo+'
    },
    expectedResult: {
      string: 'Hallo<span class="mark">+</span>'
    }
  },
  {
    input: {
      query: 'o+',
      target: 'Hallo+'
    },
    expectedResult: {
      string: 'Hall<span class="mark">o+</span>'
    }
  },
  {
    input: {
      query: 'nomatch',
      target: 'Test'
    },
    expectedResult: {
      string: 'Test'
    }
  },

  // explicit case insensitive
  {
    input: {
      query: 'ab',
      target: 'TestAb',
      caseSensitive: false
    },
    expectedResult: {
      string: 'Test<span class="mark">Ab</span>'
    }
  },
  {
    input: {
      query: 'ab',
      target: 'AbTest',
      caseSensitive: false
    },
    expectedResult: {
      string: '<span class="mark">Ab</span>Test'
    }
  },
  {
    input: {
      query: 'ab',
      target: 'TeAbst',
      caseSensitive: false
    },
    expectedResult: {
      string: 'Te<span class="mark">Ab</span>st'
    }
  },
  {
    input: {
      query: 'ab',
      target: 'Ababab',
      caseSensitive: false
    },
    expectedResult: {
      string: '<span class="mark">Ab</span><span class="mark">ab</span><span class="mark">ab</span>'
    }
  },
  {
    input: {
      query: 'hall',
      target: 'Hallo',
      caseSensitive: false
    },
    expectedResult: {
      string: '<span class="mark">Hall</span>o'
    }
  },
  {
    input: {
      query: '+',
      target: 'Hallo+',
      caseSensitive: false
    },
    expectedResult: {
      string: 'Hallo<span class="mark">+</span>'
    }
  },
  {
    input: {
      query: 'o+',
      target: 'Hallo+',
      caseSensitive: false
    },
    expectedResult: {
      string: 'Hall<span class="mark">o+</span>'
    }
  },
  {
    input: {
      query: 'nomatch',
      target: 'Test',
      caseSensitive: false
    },
    expectedResult: {
      string: 'Test'
    }
  },

  // case sensitive
  {
    input: {
      query: 'ab',
      target: 'TestAb',
      caseSensitive: true
    },
    expectedResult: {
      string: 'TestAb'
    }
  },
  {
    input: {
      query: 'ab',
      target: 'AbTest',
      caseSensitive: true
    },
    expectedResult: {
      string:
        'AbTest'
    }
  },
  {
    input: {
      query: 'Ab',
      target: 'TestAb',
      caseSensitive: true
    },
    expectedResult: {
      string: 'Test<span class="mark">Ab</span>'
    }
  },
  {
    input: {
      query: 'Ab',
      target: 'AbTest',
      caseSensitive: true
    },
    expectedResult: {
      string:
        '<span class="mark">Ab</span>Test'
    }
  },
  {
    input: {
      query: 'Ab',
      target: 'TeAbst',
      caseSensitive: true
    },
    expectedResult: {
      string:
        'Te<span class="mark">Ab</span>st'
    }
  },
  {
    input: {
      query: 'Hall',
      target: 'Hallo',
      caseSensitive: true
    },
    expectedResult: {
      string: '<span class="mark">Hall</span>o'
    }
  },
  {
    input: {
      query: '+',
      target: 'Hallo+',
      caseSensitive: true
    },
    expectedResult: {
      string: 'Hallo<span class="mark">+</span>'
    }
  },
  {
    input: {
      query: 'o+',
      target: 'Hallo+',
      caseSensitive: true
    },
    expectedResult: {
      string: 'Hall<span class="mark">o+</span>'
    }
  },
  {
    input: {
      query: 'ab',
      target: 'Ababab',
      caseSensitive: true
    },
    expectedResult: {
      string: 'Ab<span class="mark">ab</span><span class="mark">ab</span>'
    }
  },
  {
    input: {
      query: 'nomatch',
      target: 'Test',
      caseSensitive: true
    },
    expectedResult: {
      string:
        'Test'
    }
  },
];
//endregion

module('Unit | indicesImplementation');
scenarios.forEach(scenario => {
  test(`[PARAMETERIZED] ${JSON.stringify(scenario)}`, function (assert) {
    const helperOptions = {query: scenario.input.query};

    if (typeof scenario.input.caseSensitive === 'boolean') {
      helperOptions['caseSensitive'] = scenario.input.caseSensitive;
    }

    const result = indicesImplementation(scenario.input.target, scenario.input.query, helperOptions);

    if (result.string) {
      assert.equal(result.string, scenario.expectedResult.string);
    } else {
      assert.equal(result, scenario.expectedResult);
    }
  });
});

module('Unit | regexImplementation');
scenarios.forEach(scenario => {
  test(`[PARAMETERIZED] ${JSON.stringify(scenario)}`, function (assert) {
    const helperOptions = {query: scenario.input.query};

    if (typeof scenario.input.caseSensitive === 'boolean') {
      helperOptions['caseSensitive'] = scenario.input.caseSensitive;
    }

    const result = regexImplementation(scenario.input.target, scenario.input.query, helperOptions);

    if (result.string) {
      assert.equal(result.string, scenario.expectedResult.string);
    } else {
      assert.equal(result, scenario.expectedResult);
    }
  });
});

module('Unit | Helpers | Text Highlight', {
  beforeEach() {
    // reset impl cache
    window._text_highlight_fastest_impl = null;
  }
});
test('switches to regex implementation when `value.length` exceeds limit', function (assert) {
  // GIVEN
  const value = generateArbitraryStringOfLength(MAX_VALUE_LENGTH_FOR_INDICES_IMPL + 1);
  const params = [value];
  const options = {
    query: 'abc'
  };

  // WHEN
  const regexImplementationSpy = this.spy(regexImplementationModule, 'default');

  textHighlightHelperFn.compute(params, options);

  // THEN
  assert.ok(regexImplementationSpy.calledOnce);
});

test('switches to regex implementation when environment is Safari', function (assert) {
  // GIVEN
  const value = 'abc';
  const params = [value];
  const options = {
    query: 'abc'
  };

  // WHEN
  this.stub(envDetectionModule, 'isSafari').returns(true);
  const regexImplementationSpy = this.spy(regexImplementationModule, 'default');

  textHighlightHelperFn.compute(params, options);

  // THEN
  assert.ok(regexImplementationSpy.calledOnce);
});

test('hits implementation cache', function (assert) {
  // GIVEN
  const value = 'abc';
  const params = [value];
  const options = {
    query: 'abc'
  };

  // WHEN
  const isSafariSpy = this.spy(envDetectionModule, 'isSafari');
  const indicesImplementationSpy = this.spy(indicesImplementationModule, 'default');

  textHighlightHelperFn.compute(params, options);
  textHighlightHelperFn.compute(params, options);

  // THEN
  assert.ok(isSafariSpy.calledOnce);
  assert.ok(indicesImplementationSpy.calledTwice);
});

function generateArbitraryStringOfLength(length) {
  let result = '';

  for (let i = 0; i < length; i++) {
    result += 'a';
  }

  return result;
}
