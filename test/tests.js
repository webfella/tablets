test('jQuery accessing the DOM', function() {
  expect(1);
  equal($('#qunit-header a').text().trim(), 'Basic Test Suite', 'jQuery should be able to access the DOM.');
});