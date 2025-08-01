const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const CONFIG_FILE = path.join(__dirname, 'config.json');

app.use(express.json());

// Initialize config file if it doesn't exist
async function initializeConfig() {
  try {
    await fs.access(CONFIG_FILE);
  } catch {
    await fs.writeFile(CONFIG_FILE, JSON.stringify({}, null, 2));
    console.log('Created config.json file');
  }
}

async function readConfig() {
  try {
    const data = await fs.readFile(CONFIG_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function writeConfig(config) {
  try {
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
    return true;
  } catch {
    return false;
  }
}

// GET /config - Get all configurations
app.get('/config', async (req, res) => {
  const config = await readConfig();
  res.json(config);
});

// GET /config/:key - Get specific configuration by key
app.get('/config/:key', async (req, res) => {
  const config = await readConfig();
  const key = req.params.key;
  if (config.hasOwnProperty(key)) {
    res.json({ [key]: config[key] });
  } else {
    res.status(404).json({ error: 'Configuration key not found' });
  }
});

// POST /config - Create new configuration(s)
app.post('/config', async (req, res) => {
  const config = await readConfig();
  const newConfig = req.body;
  const updatedConfig = { ...config, ...newConfig };
  const success = await writeConfig(updatedConfig);
  if (success) {
    res.status(201).json({ message: 'Configuration created', data: newConfig });
  } else {
    res.status(500).json({ error: 'Failed to create configuration' });
  }
});

// PUT /config/:key - Update specific configuration
app.put('/config/:key', async (req, res) => {
  const config = await readConfig();
  const key = req.params.key;
  const value = req.body.value;
  config[key] = value;
  const success = await writeConfig(config);
  if (success) {
    res.json({ message: 'Configuration updated', [key]: value });
  } else {
    res.status(500).json({ error: 'Failed to update configuration' });
  }
});

// DELETE /config/:key - Delete specific configuration
app.delete('/config/:key', async (req, res) => {
  const config = await readConfig();
  const key = req.params.key;
  if (config.hasOwnProperty(key)) {
    delete config[key];
    const success = await writeConfig(config);
    if (success) {
      res.json({ message: 'Configuration deleted' });
    } else {
      res.status(500).json({ error: 'Failed to delete configuration' });
    }
  } else {
    res.status(404).json({ error: 'Configuration key not found' });
  }
});

// DELETE /config - Clear all configurations
app.delete('/config', async (req, res) => {
  const success = await writeConfig({});
  if (success) {
    res.json({ message: 'All configurations cleared' });
  } else {
    res.status(500).json({ error: 'Failed to clear configurations' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

async function startServer() {
  await initializeConfig();
  app.listen(PORT, () => {
    console.log(`Config API server running on port ${PORT}`);
  });
}

startServer().catch(console.error);
