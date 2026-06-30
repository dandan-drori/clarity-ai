async function handleShutdown(server, db, restrictedDb) {
  console.log('\nShutting down application gracefully...');
  
  if (server) {
    server.close(() => {
      console.log('🛑 Express server closed.');
    });
  }

  // Disconnect from databases
  if (db && db.disconnect) await db.disconnect();
  if (restrictedDb && restrictedDb.disconnect) await restrictedDb.disconnect();
  
  process.exit(0); 
}

export function setupGracefulShutdown(server, db, restrictedDb) {
  // Catch Ctrl+C
  process.on('SIGINT', () => handleShutdown(server, db, restrictedDb));
  
  // Catch Docker/Kubernetes stop signals (good practice!)
  process.on('SIGTERM', () => handleShutdown(server, db, restrictedDb));
}