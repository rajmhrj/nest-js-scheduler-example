# NestJS BullMQ Scheduler

A production-ready NestJS application demonstrating job scheduling and queue management using BullMQ and Redis.

## Description

This application provides a robust job scheduling system built with NestJS and BullMQ. It features delayed job execution, automatic retries with exponential backoff, and Redis-based persistence.

## Features

- ⏰ **Delayed Job Scheduling** - Schedule jobs to run after a specified delay (up to 1 hour)
- 🔄 **Automatic Retries** - Built-in retry mechanism with exponential backoff
- 📊 **Multiple Queue Support** - Separate queues for test and delayed jobs
- 🗃️ **Redis Persistence** - Jobs are persisted in Redis for reliability
- ⚙️ **Configurable** - Environment-based configuration
- 🛡️ **Type-Safe** - Full TypeScript support with validation

## Tech Stack

- **[NestJS](https://nestjs.com/)** - Progressive Node.js framework
- **[BullMQ](https://docs.bullmq.io/)** - Premium message queue for NodeJS
- **[Redis](https://redis.io/)** - In-memory data store for queue persistence
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[class-validator](https://github.com/typestack/class-validator)** - Decorator-based validation

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker and Docker Compose (for Redis)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd scheduler
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=3000

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=yourStrongPassword123

# BullMQ Configuration
BULLMQ_PREFIX=scheduler
```

## Running the Application

### Start Redis

Using Docker Compose:
```bash
docker-compose up -d
```

This will start a Redis instance on port 6379 with password authentication.

### Run the Application

```bash
# Development mode
npm run start

# Watch mode (auto-reload on changes)
npm run start:dev

# Debug mode
npm run start:debug

# Production mode
npm run build
npm run start:prod
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Schedule Delayed Job

Schedule a job to execute after a specified delay.

**Endpoint:** `POST /scheduler/delayed`

**Request Body:**
```json
{
  "delayMs": 5000
}
```

**Validation Rules:**
- `delayMs`: Must be a positive number
- Maximum delay: 3,600,000 ms (1 hour)

**Response:**
```json
{
  "success": true,
  "message": "Delayed job scheduled successfully",
  "data": {
    "jobId": "1234567890",
    "delayMs": 5000,
    "delaySeconds": "5.0",
    "willExecuteAt": "2025-11-04T12:35:00.000Z"
  }
}
```

**Example using cURL:**
```bash
curl -X POST http://localhost:3000/scheduler/delayed \
  -H "Content-Type: application/json" \
  -d '{"delayMs": 10000}'
```

## Project Structure

```
scheduler/
├── src/
│   ├── app-config/              # Configuration module
│   │   ├── services/
│   │   │   └── scheduler-config.service.ts
│   │   └── app-config.module.ts
│   ├── scheduler/               # Main scheduler module
│   │   ├── controllers/
│   │   │   └── scheduler.controller.ts
│   │   ├── dto/
│   │   │   └── schedule-delayed-job.dto.ts
│   │   ├── enums/
│   │   │   └── queue.enum.ts
│   │   ├── processors/
│   │   │   ├── delayed.processor.ts
│   │   │   └── test.processor.ts
│   │   ├── services/
│   │   │   ├── delayed-scheduler.service.ts
│   │   │   └── test-scheduler.service.ts
│   │   ├── consts/
│   │   │   └── job-details.const.ts
│   │   └── scheduler.module.ts
│   ├── app.module.ts
│   └── main.ts
├── test/                        # E2E tests
├── docker-compose.yml           # Redis container setup
├── package.json
└── README.md
```

## Queue Configuration

### Default Job Options
- **Remove on Complete:** Yes (keeps Redis clean)
- **Remove on Fail:** Keep last 100 failed jobs
- **Attempts:** 2 retry attempts
- **Backoff:** Exponential (5 second base delay)

### Available Queues
- `TEST` - For testing job execution
- `DELAYED` - For delayed job execution

## Development

### Code Formatting
```bash
npm run format
```

### Linting
```bash
npm run lint
```

### Building
```bash
npm run build
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 3000 | No |
| `REDIS_HOST` | Redis server host | localhost | Yes |
| `REDIS_PORT` | Redis server port | 6379 | Yes |
| `REDIS_PASSWORD` | Redis authentication password | - | Yes |
| `BULLMQ_PREFIX` | Prefix for BullMQ keys in Redis | scheduler | No |

## Docker Support

The project includes a `docker-compose.yml` file for running Redis:

```bash
# Start Redis
docker-compose up -d

# Stop Redis
docker-compose down

# View logs
docker-compose logs -f redis

# Check health
docker-compose ps
```

## Production Considerations

1. **Redis Persistence:** The Redis container uses AOF (Append Only File) persistence
2. **Environment Variables:** Use proper secret management in production
3. **Scaling:** BullMQ supports horizontal scaling with multiple workers
4. **Monitoring:** Consider adding BullMQ Board or custom monitoring
5. **Error Handling:** Failed jobs are kept for inspection (last 100)

## Troubleshooting

### Redis Connection Issues
- Verify Redis is running: `docker-compose ps`
- Check Redis password in `.env` matches `docker-compose.yml`
- Ensure port 6379 is not in use: `lsof -i :6379`

### Jobs Not Processing
- Check processor logs for errors
- Verify queue names match in controller and processor
- Check Redis connection in application logs

## License

This project is licensed under the WTFPL (Do What The Fuck You Want To Public License) - see the [LICENSE](LICENSE) file for details.

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [BullMQ Documentation](https://docs.bullmq.io/)
- [Redis Documentation](https://redis.io/documentation)
- [NestJS BullMQ Integration](https://docs.nestjs.com/techniques/queues)
