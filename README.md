# Config API

A simple Node.js API for CRUD operations on JSON configurations.

## Features

- **Create** configurations via POST requests
- **Read** configurations via GET requests
- **Update** configurations via PUT requests
- **Delete** configurations via DELETE requests
- Stores data in a local JSON file (`config.json`)
- Simple and lightweight MVP implementation

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### GET /config
Get all configurations
```bash
curl http://localhost:3000/config
```

### GET /config/:key
Get a specific configuration by key
```bash
curl http://localhost:3000/config/database
```

### POST /config
Create new configuration(s)
```bash
curl -X POST http://localhost:3000/config \
  -H "Content-Type: application/json" \
  -d '{"database": {"host": "localhost", "port": 5432}, "api_key": "secret123"}'
```

### PUT /config/:key
Update a specific configuration
```bash
curl -X PUT http://localhost:3000/config/database \
  -H "Content-Type: application/json" \
  -d '{"value": {"host": "remotehost", "port": 5432}}'
```

### DELETE /config/:key
Delete a specific configuration
```bash
curl -X DELETE http://localhost:3000/config/database
```

### DELETE /config
Clear all configurations
```bash
curl -X DELETE http://localhost:3000/config
```

### GET /health
Health check endpoint
```bash
curl http://localhost:3000/health
```

## Example Usage

1. Start the server:
```bash
npm start
```

2. Create some configurations:
```bash
curl -X POST http://localhost:3000/config \
  -H "Content-Type: application/json" \
  -d '{"app_name": "MyApp", "version": "1.0.0", "debug": true}'
```

3. Get all configurations:
```bash
curl http://localhost:3000/config
```

4. Get a specific configuration:
```bash
curl http://localhost:3000/config/app_name
```

5. Update a configuration:
```bash
curl -X PUT http://localhost:3000/config/version \
  -H "Content-Type: application/json" \
  -d '{"value": "1.0.1"}'
```

6. Delete a configuration:
```bash
curl -X DELETE http://localhost:3000/config/debug
```

## Data Storage

All configurations are stored in a `config.json` file in the project root. The file is automatically created when the server starts if it doesn't exist.

## Port Configuration

The server runs on port 3000 by default. You can change this by setting the `PORT` environment variable:

```bash
PORT=8080 npm start
```

## Error Handling

The API includes basic error handling and returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `404` - Not Found
- `500` - Internal Server Error
