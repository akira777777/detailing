
import { performance } from 'perf_hooks';

// Simulated database query with a 10ms network latency
async function mockQuery(sql, delay = 10) {
  return new Promise(resolve => setTimeout(() => {
    if (sql.includes('COUNT(*)')) {
      resolve([{ count: '100' }]);
    } else {
      // Simulate returned rows with a total_count column if window function is used
      const rows = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        car_model: 'Test Car',
        total_price: 100,
        ...(sql.includes('OVER()') ? { total_count: '100' } : {})
      }));
      resolve(rows);
    }
  }, delay));
}

async function dualQuery() {
  const start = performance.now();
  await mockQuery('SELECT ... LIMIT 10 OFFSET 0');
  await mockQuery('SELECT COUNT(*) FROM bookings WHERE ...');
  return performance.now() - start;
}

async function singleQuery() {
  const start = performance.now();
  await mockQuery('SELECT ..., COUNT(*) OVER() FROM bookings WHERE ... LIMIT 10 OFFSET 0');
  return performance.now() - start;
}

async function runBenchmark() {
  console.log('--- Pagination Performance Benchmark ---');
  console.log('Simulating 10ms network round-trip per query...\n');

  let dualTotal = 0;
  let singleTotal = 0;
  const iterations = 50;

  for (let i = 0; i < iterations; i++) {
    dualTotal += await dualQuery();
    singleTotal += await singleQuery();
  }

  const dualAvg = dualTotal / iterations;
  const singleAvg = singleTotal / iterations;
  const improvement = ((dualAvg - singleAvg) / dualAvg) * 100;

  console.log(`Average Baseline (Dual Query): ${dualAvg.toFixed(2)}ms`);
  console.log(`Average Optimized (Single Query): ${singleAvg.toFixed(2)}ms`);
  console.log(`Improvement: ${improvement.toFixed(2)}%\n`);

  console.log('Rationale: By using COUNT(*) OVER(), we eliminate one database round-trip, which is the primary bottleneck in many distributed applications.');
}

runBenchmark().catch(console.error);
