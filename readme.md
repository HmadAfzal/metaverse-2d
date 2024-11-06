# Metaverse 2D App

A monorepo project for a 2D metaverse application with real-time interactions.

## Project Structure

This project is organized as a monorepo with the following components:

1. **ws**: WebSocket server for real-time communication
   - Handles live user interactions, movements, and space updates
   - Ensures low-latency communication for a smooth user experience

2. **http**: HTTP server for REST API endpoints
   - Manages user authentication, space creation, and data persistence
   - Provides admin functionalities for managing the metaverse

3. **frontend**: User interface (to be implemented)
   - Will offer an intuitive, responsive interface for users to interact with the metaverse
   - Planned to be built with modern frontend technologies (e.g., React, Next.js)

4. **db**: Database package (shared across services)
   - Handles data storage and retrieval for all components
   - Ensures data consistency and efficient querying

## Key Features

- **User Authentication**: Secure signup and signin processes
- **Avatar Customization**: Users can personalize their digital representations
- **Space Management**: Create, join, and customize virtual spaces
- **Real-time Interactions**: Live movement and actions within spaces
- **Element Manipulation**: Add, remove, and update elements in the metaverse
- **Admin Controls**: Powerful tools for managing the metaverse environment

## Detailed API Endpoints

### Authentication
- `POST /api/v1/signup`: Register a new user
  - Accepts username, password, and user type (admin/user)
- `POST /api/v1/signin`: Authenticate a user
  - Returns a JWT token for authenticated requests

### User Management
- `POST /api/v1/user/metadata`: Update user metadata
  - Allows users to update their profile information, including avatar
- `GET /api/v1/user/metadata/bulk`: Retrieve metadata for multiple users
  - Useful for populating user information in spaces

### Space Management
- `POST /api/v1/space`: Create a new virtual space
  - Specify dimensions, name, and optional map ID
- `GET /api/v1/space/all`: Retrieve all spaces for the authenticated user
- `GET /api/v1/space/:spaceId`: Get detailed information about a specific space
- `DELETE /api/v1/space/:spaceId`: Remove a space (creator only)

### Element Management
- `POST /api/v1/space/element`: Add an element to a space
  - Specify element ID, position (x, y), and space ID
- `DELETE /api/v1/space/element`: Remove an element from a space

### Admin Endpoints
- `POST /api/v1/admin/element`: Create a new element type
  - Define image URL, dimensions, and whether it's static
- `PUT /api/v1/admin/element/:elementId`: Update an existing element type
- `POST /api/v1/admin/map`: Create a new map template
  - Specify thumbnail, dimensions, and default elements
- `POST /api/v1/admin/avatar`: Add a new avatar option for users

## WebSocket Events

- `join`: Request to enter a specific space
- `move`: Update user position within a space
- `space-joined`: Confirmation of successful space entry
- `user-joined`: Notification of a new user entering the space
- `movement`: Broadcast of user movement to other participants
- `movement-rejected`: Notification of an invalid movement attempt
- `user-left`: Alert when a user exits the space

## Comprehensive Testing

The project includes an extensive test suite covering various aspects of the application:

- **Authentication Tests**: Ensure secure user registration and login
- **User Metadata Tests**: Verify proper handling of user profile information
- **Space Management Tests**: Validate creation, retrieval, and deletion of spaces
- **Element Manipulation Tests**: Confirm proper handling of elements within spaces
- **Admin Functionality Tests**: Ensure admin-only actions are properly restricted and functional
- **WebSocket Communication Tests**: Verify real-time updates and proper event handling

To run the tests:
1. Ensure all dependencies are installed: `npm install` or `yarn install`
2. Start the HTTP and WebSocket servers
3. Execute the test command: `npm test` or `yarn test`

## Frontend Development (Upcoming)

The frontend part of the application is slated for development. It will provide:
- An intuitive user interface for navigating the 2D metaverse
- Real-time rendering of spaces, avatars, and elements
- Interactive controls for movement and element manipulation
- Responsive design for various device sizes

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