
async function testLogic() {
  console.log('--- Verifying Optimization Logic ---');

  // Mock data and total count
  const mockResult = [
    { id: 1, car_model: 'BMW M3', total_count: '2' },
    { id: 2, car_model: 'Audi RS6', total_count: '2' }
  ];

  // Simulating the new logic in routes/api.js
  const result = [...mockResult]; // Clone
  let offset = 0;

  console.log('Test 1: Normal result set (Page 1)');
  let total = 0;
  if (result.length > 0) {
    total = parseInt(result[0].total_count);
    result.forEach(row => delete row.total_count);
  }

  console.log('Total:', total);
  console.log('Data (total_count removed):', result.every(r => r.total_count === undefined));
  if (total !== 2 || result.length !== 2 || result[0].total_count !== undefined) {
    throw new Error('Test 1 failed');
  }

  console.log('\nTest 2: Empty result set (Page 1)');
  const emptyResult = [];
  offset = 0;
  total = 0;
  if (emptyResult.length > 0) {
    total = parseInt(emptyResult[0].total_count);
  } else if (parseInt(offset) > 0) {
    // Fallback logic
    total = 42; // simulated fallback result
  }

  console.log('Total:', total);
  if (total !== 0) {
    throw new Error('Test 2 failed');
  }

  console.log('\nTest 3: Empty result set (Page 2, fallback)');
  offset = 10;
  total = 0;
  if (emptyResult.length > 0) {
    total = parseInt(emptyResult[0].total_count);
  } else if (parseInt(offset) > 0) {
    // Fallback logic
    total = 42; // simulated fallback result
  }

  console.log('Total:', total);
  if (total !== 42) {
    throw new Error('Test 3 failed');
  }

  console.log('\nAll logic verification tests passed!');
}

testLogic().catch(err => {
  console.error(err);
  process.exit(1);
});
