
//Require All modules ending with _test
const testsContext = require.context(".", true, /_test$/)

testsContext.keys().forEach(testsContext)