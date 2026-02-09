// Migration system for database schema updates
// This module handles database schema versioning and migrations

import { DatabaseError } from './database.js';

const migrations = [
  {
    version: 1,
    name: 'Initial schema setup',
    up: `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        phone VARCHAR(20),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP WITH TIME ZONE,
        is_active BOOLEAN DEFAULT TRUE,
        role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('admin', 'staff', 'customer'))
      );
      
      CREATE TABLE IF NOT EXISTS vehicles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        make VARCHAR(50) NOT NULL,
        model VARCHAR(100) NOT NULL,
        year INTEGER NOT NULL,
        color VARCHAR(30),
        license_plate VARCHAR(20),
        vin VARCHAR(17),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `,
    down: `
      DROP TABLE IF EXISTS vehicles;
      DROP TABLE IF EXISTS users;
    `
  },
  {
    version: 2,
    name: 'Add service packages and modules',
    up: `
      CREATE TABLE IF NOT EXISTS service_packages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) NOT NULL,
        description TEXT,
        base_price DECIMAL(10,2) NOT NULL,
        duration_hours INTEGER,
        category VARCHAR(50) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS service_modules (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        duration_hours INTEGER,
        category VARCHAR(50) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS package_modules (
        package_id UUID REFERENCES service_packages(id) ON DELETE CASCADE,
        module_id UUID REFERENCES service_modules(id) ON DELETE CASCADE,
        PRIMARY KEY (package_id, module_id)
      );
    `,
    down: `
      DROP TABLE IF EXISTS package_modules;
      DROP TABLE IF EXISTS service_modules;
      DROP TABLE IF EXISTS service_packages;
    `
  },
  {
    version: 3,
    name: 'Add bookings and related tables',
    up: `
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
        date DATE NOT NULL,
        time TIME NOT NULL,
        car_model VARCHAR(100) NOT NULL,
        package_id UUID REFERENCES service_packages(id) ON DELETE SET NULL,
        selected_modules UUID[],
        total_price DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP WITH TIME ZONE
      );
      
      CREATE TABLE IF NOT EXISTS booking_status_history (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
        status VARCHAR(20) NOT NULL,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_by UUID REFERENCES users(id) ON DELETE SET NULL
      );
      
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
        amount DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(20) CHECK (payment_method IN ('credit_card', 'debit_card', 'cash', 'paypal')),
        transaction_id VARCHAR(100),
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `,
    down: `
      DROP TABLE IF EXISTS payments;
      DROP TABLE IF EXISTS booking_status_history;
      DROP TABLE IF EXISTS bookings;
    `
  },
  {
    version: 4,
    name: 'Add authentication sessions and indexes',
    up: `
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_accessed TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
      CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
      CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
      CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON vehicles(user_id);
    `,
    down: `
      DROP INDEX IF EXISTS idx_bookings_date;
      DROP INDEX IF EXISTS idx_bookings_status;
      DROP INDEX IF EXISTS idx_bookings_user_id;
      DROP INDEX IF EXISTS idx_sessions_token;
      DROP INDEX IF EXISTS idx_sessions_expires_at;
      DROP INDEX IF EXISTS idx_users_email;
      DROP INDEX IF EXISTS idx_vehicles_user_id;
      DROP TABLE IF EXISTS sessions;
    `
  },
  {
    version: 5,
    name: 'Add seed data for services',
    up: `
      INSERT INTO service_packages (name, description, base_price, duration_hours, category) VALUES
        ('Basic Detail', 'Complete exterior wash and interior vacuum', 150.00, 2, 'basic'),
        ('Premium Detail', 'Full interior and exterior detail with wax', 350.00, 4, 'premium'),
        ('Concierge Detail', 'Complete restoration with paint correction', 850.00, 8, 'concierge');
      
      INSERT INTO service_modules (name, description, price, duration_hours, category) VALUES
        ('Ceramic Coating', 'Professional ceramic coating application', 1250.00, 6, 'protection'),
        ('Paint Correction', 'Multi-stage paint defect removal', 850.00, 8, 'correction'),
        ('Interior Detail', 'Complete interior cleaning and conditioning', 450.00, 4, 'interior'),
        ('Engine Bay Clean', 'Professional engine compartment cleaning', 150.00, 2, 'engine'),
        ('Headlight Restoration', 'Headlight lens polishing and sealing', 200.00, 2, 'restoration');
      
      INSERT INTO package_modules (package_id, module_id) 
      SELECT sp.id, sm.id 
      FROM service_packages sp, service_modules sm 
      WHERE sp.name = 'Premium Detail' AND sm.name IN ('Interior Detail');
      
      INSERT INTO package_modules (package_id, module_id) 
      SELECT sp.id, sm.id 
      FROM service_packages sp, service_modules sm 
      WHERE sp.name = 'Concierge Detail' AND sm.name IN ('Paint Correction', 'Ceramic Coating');
    `,
    down: `
      DELETE FROM package_modules;
      DELETE FROM service_modules;
      DELETE FROM service_packages;
    `
  },
  {
    version: 6,
    name: 'Add composite index for booking queries',
    up: `
      CREATE INDEX IF NOT EXISTS idx_bookings_date_time ON bookings(date DESC, time DESC);
    `,
    down: `
      DROP INDEX IF EXISTS idx_bookings_date_time;
    `
  }
];

/**
 * Run migrations to bring database to target version
 * @param {Function} dbQuery - Database query function
 * @param {number|null} targetVersion - Target version (null = latest)
 */
export async function runMigrations(dbQuery, targetVersion = null) {
  if (!dbQuery) {
    throw new DatabaseError('Database query function not provided', 'MISSING_DB_QUERY');
  }
  
  const currentVersion = await getCurrentVersion(dbQuery);
  const target = targetVersion || migrations.length;
  
  if (currentVersion >= target) {
    console.log(`✅ Database is already at version ${currentVersion}`);
    return { success: true, currentVersion, targetVersion: target, migrationsRun: 0 };
  }

  console.log(`🔄 Running migrations from version ${currentVersion} to ${target}`);
  let migrationsRun = 0;
  
  for (let i = currentVersion; i < target; i++) {
    const migration = migrations[i];
    console.log(`  → Running migration ${migration.version}: ${migration.name}`);
    
    try {
      // Execute migration SQL
      await dbQuery(migration.up);
      
      // Record migration
      await dbQuery`
        INSERT INTO schema_migrations (version, name, applied_at) 
        VALUES (${migration.version}, ${migration.name}, CURRENT_TIMESTAMP)
        ON CONFLICT (version) DO UPDATE 
        SET applied_at = CURRENT_TIMESTAMP, name = ${migration.name}
      `;
      
      migrationsRun++;
      console.log(`  ✅ Migration ${migration.version} completed`);
    } catch (error) {
      console.error(`  ❌ Migration ${migration.version} failed:`, error);
      throw new DatabaseError(
        `Migration ${migration.version} failed: ${error.message}`,
        'MIGRATION_FAILED'
      );
    }
  }
  
  console.log(`✅ All migrations completed. Database is now at version ${target}`);
  return { success: true, currentVersion: target, targetVersion: target, migrationsRun };
}

/**
 * Rollback migrations to target version
 * @param {Function} dbQuery - Database query function
 * @param {number} targetVersion - Target version to rollback to
 */
export async function rollbackMigrations(dbQuery, targetVersion = 0) {
  if (!dbQuery) {
    throw new DatabaseError('Database query function not provided', 'MISSING_DB_QUERY');
  }
  
  const currentVersion = await getCurrentVersion(dbQuery);
  
  if (currentVersion <= targetVersion) {
    console.log(`✅ Database is already at version ${currentVersion}`);
    return { success: true, currentVersion, targetVersion, rollbacksRun: 0 };
  }

  console.log(`🔄 Rolling back migrations from version ${currentVersion} to ${targetVersion}`);
  let rollbacksRun = 0;
  
  for (let i = currentVersion - 1; i >= targetVersion; i--) {
    const migration = migrations[i];
    console.log(`  → Rolling back migration ${migration.version}: ${migration.name}`);
    
    try {
      // Execute rollback SQL
      await dbQuery(migration.down);
      
      // Remove migration record
      await dbQuery`DELETE FROM schema_migrations WHERE version = ${migration.version}`;
      
      rollbacksRun++;
      console.log(`  ✅ Rollback of migration ${migration.version} completed`);
    } catch (error) {
      console.error(`  ❌ Rollback of migration ${migration.version} failed:`, error);
      throw new DatabaseError(
        `Rollback of migration ${migration.version} failed: ${error.message}`,
        'ROLLBACK_FAILED'
      );
    }
  }
  
  console.log(`✅ All rollbacks completed. Database is now at version ${targetVersion}`);
  return { success: true, currentVersion: targetVersion, targetVersion, rollbacksRun };
}

/**
 * Get current migration version
 * @param {Function} dbQuery - Database query function
 */
async function getCurrentVersion(dbQuery) {
  try {
    // Create schema_migrations table if it doesn't exist
    await dbQuery`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version INTEGER PRIMARY KEY,
        name VARCHAR(255),
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    const result = await dbQuery`SELECT MAX(version) as version FROM schema_migrations`;
    return result[0]?.version || 0;
  } catch (error) {
    console.error('Error getting current migration version:', error);
    return 0;
  }
}

/**
 * Get migration status
 * @param {Function} dbQuery - Database query function
 */
export async function getMigrationStatus(dbQuery) {
  if (!dbQuery) {
    return { error: 'Database query function not provided' };
  }
  
  try {
    const currentVersion = await getCurrentVersion(dbQuery);
    const pendingMigrations = migrations.filter(m => m.version > currentVersion);
    
    return {
      currentVersion,
      latestVersion: migrations.length,
      pendingCount: pendingMigrations.length,
      pendingMigrations: pendingMigrations.map(m => ({ version: m.version, name: m.name })),
      isUpToDate: currentVersion >= migrations.length
    };
  } catch (error) {
    return { error: error.message };
  }
}

export { migrations };
