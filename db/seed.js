import pool from './connection.js';

// Sample data for seeding the database
const sampleData = {
  servicePackages: [
    {
      name: 'Basic Detail',
      description: 'Complete exterior wash and interior vacuum',
      base_price: 150.00,
      duration_hours: 2,
      category: 'basic'
    },
    {
      name: 'Premium Detail',
      description: 'Full interior and exterior detail with wax',
      base_price: 350.00,
      duration_hours: 4,
      category: 'premium'
    },
    {
      name: 'Concierge Detail',
      description: 'Complete restoration with paint correction',
      base_price: 850.00,
      duration_hours: 8,
      category: 'concierge'
    }
  ],
  
  serviceModules: [
    {
      name: 'Ceramic Coating',
      description: 'Professional ceramic coating application',
      price: 1250.00,
      duration_hours: 6,
      category: 'protection'
    },
    {
      name: 'Paint Correction',
      description: 'Multi-stage paint defect removal',
      price: 850.00,
      duration_hours: 8,
      category: 'correction'
    },
    {
      name: 'Interior Detail',
      description: 'Complete interior cleaning and conditioning',
      price: 450.00,
      duration_hours: 4,
      category: 'interior'
    },
    {
      name: 'Engine Bay Clean',
      description: 'Professional engine compartment cleaning',
      price: 150.00,
      duration_hours: 2,
      category: 'engine'
    },
    {
      name: 'Headlight Restoration',
      description: 'Headlight lens polishing and sealing',
      price: 200.00,
      duration_hours: 2,
      category: 'restoration'
    }
  ]
};

export async function seedDatabase() {
  let client;
  try {
    client = await pool.connect();
    
    console.log('🌱 Starting database seeding...');
    
    // Insert service packages
    console.log('📦 Seeding service packages...');
    for (const pkg of sampleData.servicePackages) {
      const result = await client.query(
        `INSERT INTO service_packages (name, description, base_price, duration_hours, category)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [pkg.name, pkg.description, pkg.base_price, pkg.duration_hours, pkg.category]
      );
      pkg.id = result.rows[0].id;
      console.log(`  ✓ Added package: ${pkg.name}`);
    }
    
    // Insert service modules
    console.log('🔧 Seeding service modules...');
    for (const module of sampleData.serviceModules) {
      const result = await client.query(
        `INSERT INTO service_modules (name, description, price, duration_hours, category)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [module.name, module.description, module.price, module.duration_hours, module.category]
      );
      module.id = result.rows[0].id;
      console.log(`  ✓ Added module: ${module.name}`);
    }
    
    // Create package-module relationships
    console.log('🔗 Creating package-module relationships...');
    const premiumDetail = sampleData.servicePackages.find(p => p.name === 'Premium Detail');
    const conciergeDetail = sampleData.servicePackages.find(p => p.name === 'Concierge Detail');
    const interiorDetail = sampleData.serviceModules.find(m => m.name === 'Interior Detail');
    const paintCorrection = sampleData.serviceModules.find(m => m.name === 'Paint Correction');
    const ceramicCoating = sampleData.serviceModules.find(m => m.name === 'Ceramic Coating');
    
    if (premiumDetail && interiorDetail) {
      await client.query(
        `INSERT INTO package_modules (package_id, module_id) VALUES ($1, $2)`,
        [premiumDetail.id, interiorDetail.id]
      );
      console.log('  ✓ Linked Premium Detail with Interior Detail');
    }
    
    if (conciergeDetail && paintCorrection && ceramicCoating) {
      await client.query(
        `INSERT INTO package_modules (package_id, module_id) VALUES ($1, $2), ($1, $3)`,
        [conciergeDetail.id, paintCorrection.id, ceramicCoating.id]
      );
      console.log('  ✓ Linked Concierge Detail with Paint Correction and Ceramic Coating');
    }
    
    console.log('✅ Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  } finally {
    if (client) client.release();
  }
}

// Run seeding if script is called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('🌱 Seeding process finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding process failed:', error);
      process.exit(1);
    });
}