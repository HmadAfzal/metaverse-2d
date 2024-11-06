# Metaverse 2D App

A monorepo project for a 2D metaverse application with real-time interactions.

## Project Structure

This project is organized as a monorepo with the following components:

1. **ws**: WebSocket server for real-time communication
2. **http**: HTTP server for REST API endpoints
3. **frontend**: User interface (to be implemented)
4. **db**: Database package (shared across services)

## Features

- User authentication (signup, signin)
- User metadata and avatar management
- Space creation, deletion, and management
- Element manipulation within spaces
- Admin-specific functionalities
- Real-time user interactions via WebSockets

## API Endpoints

### Authentication

- `POST /api/v1/signup`: User registration
- `POST /api/v1/signin`: User login

### User Management

- `POST /api/v1/user/metadata`: Update user metadata
- `GET /api/v1/user/metadata/bulk`: Get metadata for multiple users

### Space Management

- `POST /api/v1/space`: Create a new space
- `GET /api/v1/space/all`: Get all spaces for a user
- `GET /api/v1/space/:spaceId`: Get details of a specific space
- `DELETE /api/v1/space/:spaceId`: Delete a space

### Element Management

- `POST /api/v1/space/element`: Add an element to a space
- `DELETE /api/v1/space/element`: Remove an element from a space

### Admin Endpoints

- `POST /api/v1/admin/element`: Create a new element
- `PUT /api/v1/admin/element/:elementId`: Update an element
- `POST /api/v1/admin/map`: Create a new map
- `POST /api/v1/admin/avatar`: Create a new avatar

## WebSocket Events

- `join`: Join a space
- `move`: Move within a space
- `space-joined`: Confirmation of joining a space
- `user-joined`: Notification when a new user joins
- `movement`: Broadcast user movement
- `movement-rejected`: Notification of invalid movement
- `user-left`: Notification when a user leaves the space

## Testing

The project includes a comprehensive test suite covering various functionalities. To run the tests:

1. Ensure all dependencies are installed
2. Start the HTTP and WebSocket servers
3. Run the test command (e.g., `npm test` or `jest`)

## Frontend (To Be Implemented)

The frontend part of the application is yet to be developed. It will interact with the backend services to provide a user interface for the 2D metaverse experience.

## Getting Started

1. Clone the repository
2. Install dependencies for each service
3. Set up the database
4. Start the HTTP and WebSocket servers
5. Run the test suite to ensure everything is working correctly

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Add your chosen license here]