# GitHub Search App

## Features

- **Search GitHub Users**: Users can search for GitHub users.
- **View Repositories**: Users can view repositories of each user.
- **View Open Issues**: Users can view open issues on each repository.
- **Create Issues**: Users can create issues for a repository.

## Tech Stack

- **React**: A JavaScript library for building user interfaces.
- **Apollo Client**: A comprehensive state management library for JavaScript that enables you to manage both local and remote data with GraphQL.
- **GitHub GraphQL API**: Used to interact with GitHub's data.
- **Shadcn UI**: A UI component library for building modern web applications.

## Docker

This project uses Docker for containerization to ensure a consistent development environment.

## Requirements

- **Node.js**: Version 14.x or higher
- **npm**: Version 6.x or higher
- **Docker**: Version 19.x or higher (optional, for containerization)

## Getting Started

1. **Clone the repository**:

```sh
git clone https://github.com/yourusername/github-search-app.git
cd github-search-app
```

2. **Install dependencies**:

```sh
npm install
```

3. **Run the app**:

```sh
npm start
```

4. **Run with Docker**:

```sh
docker build -t github-search-app .
docker run -p 3000:3000 github-search-app
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
