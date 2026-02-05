async function testAPI() {
  try {
    // Test POST request
    console.log('Testing POST request...');
    const postResponse = await fetch('http://localhost:3000/api/booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        date: '2023-12-15',
        time: '14:30',
        carModel: 'BMW M3',
        packageName: 'Premium Detailing',
        totalPrice: 899
      })
    });
    
    console.log('POST Status:', postResponse.status);
    const postData = await postResponse.text();
    console.log('POST Response:', postData);
    
    // Test GET request
    console.log('\nTesting GET request...');
    const getResponse = await fetch('http://localhost:3000/api/booking');
    console.log('GET Status:', getResponse.status);
    const getData = await getResponse.text();
    console.log('GET Response:', getData);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testAPI();