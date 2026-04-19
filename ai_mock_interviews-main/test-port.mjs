import net from 'net';

const hosts = [
  'cluster0-shard-00-00.lvkxyff.mongodb.net',
  'cluster0-shard-00-01.lvkxyff.mongodb.net',
  'cluster0-shard-00-02.lvkxyff.mongodb.net'
];
const port = 27017;

console.log('--- Network Port Test ---');

async function testHost(host) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const timeout = 5000;
    
    socket.setTimeout(timeout);
    
    console.log(`Testing ${host}:${port}...`);
    
    socket.on('connect', () => {
      console.log(`✅ SUCCESS: ${host}:${port} is REACHABLE`);
      socket.destroy();
      resolve(true);
    });
    
    socket.on('timeout', () => {
      console.log(`❌ FAILED: ${host}:${port} TIMEOUT (Port is likely blocked)`);
      socket.destroy();
      resolve(false);
    });
    
    socket.on('error', (err) => {
      console.log(`❌ FAILED: ${host}:${port} ERROR (${err.message})`);
      socket.destroy();
      resolve(false);
    });
    
    socket.connect(port, host);
  });
}

async function run() {
  for (const host of hosts) {
    await testHost(host);
  }
  console.log('--- Test Complete ---');
}

run();
