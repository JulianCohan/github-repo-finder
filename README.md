# GitHub Repo Finder

A powerful web application to search through GitHub repositories for specific code snippets, functions, or patterns. Find the best implementations of algorithms, utility functions, or coding patterns across open-source projects.

## Project Overview

GitHub Repo Finder is a specialized search tool designed for developers who want to discover high-quality code examples, patterns, or implementations across GitHub's vast ecosystem of repositories. Unlike GitHub's built-in search, our application provides:

- Context-aware code snippets with proper indentation and surrounding code
- Quality-based ranking that considers repository stars, recency, and code documentation
- Advanced filtering options to narrow down results
- Ability to save and organize your favorite searches

This project is designed to be a learning tool for new programmers interested in:
- Building web applications with HTML, CSS, and JavaScript
- Integrating with third-party APIs (GitHub)
- Implementing serverless functions with Netlify
- Creating user authentication systems

## Features

- **Advanced Code Search**: Search for specific functions, classes, or patterns across GitHub repositories
- **Smart Filtering**: Filter by programming language, repository stars, and more
- **Intelligent Ranking**: Results ranked by relevance, recency, popularity, and code quality
- **User Authentication**: Create an account to save and manage your searches
- **Saved Searches**: Store your favorite searches for future reference
- **Syntax Highlighting**: Beautiful code display with proper syntax highlighting
- **One-Click Copy**: Easily copy code snippets to your clipboard
- **Export Results**: Save your findings to a text file
- **Dark/Light Mode**: Toggle between light and dark themes

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Styling**: Bootstrap CSS framework with custom theme
- **API Integration**: GitHub API via Octokit/Core (browser)
- **Hosting**: GitHub Pages (free static hosting)
- **Syntax Highlighting**: highlight.js
- **Code Search**: Client-side GitHub API integration

## How It Works

1. **User Interface**: The frontend provides an intuitive search form with various filters.
2. **Client-Side API**: When a user submits a search, the browser directly calls the GitHub API using Octokit.
3. **GitHub API**: Octokit queries GitHub's code search API with optional authentication token.
4. **Processing**: Results are processed, filtered, and ranked according to relevance and quality metrics.
5. **Display**: Formatted results with syntax highlighting are displayed to the user.
6. **Token Management**: Users can optionally provide a GitHub Personal Access Token for higher rate limits.

## Learning Resources

This project serves as an excellent learning resource for:

### Core Concepts
- RESTful API integration
- Serverless function architecture
- User authentication flow
- Frontend UI/UX development
- Search algorithm implementation

### Specific Technologies
- GitHub API usage
- Firebase authentication and database
- Netlify deployment and functions
- CSS styling with Bootstrap
- ES6+ JavaScript features

## Implementation Details

### Search Algorithm

The search algorithm in `js/app.js` includes several sophisticated components:

1. **Query Preparation**: Combines user query with filters
2. **API Integration**: Connects to GitHub using Octokit (browser SDK)
3. **Result Processing**: Extracts and formats relevant code snippets
4. **Context Extraction**: Pulls code sections surrounding the matches
5. **Quality Assessment**: Evaluates code quality using:
   - Repository stars
   - Update recency
   - Comment presence
   - Documentation quality
6. **Result Ranking**: Orders results by calculated match score

### Client-Side Architecture

All processing happens in the browser with no backend required:

1. Direct GitHub API calls from the browser
2. Optional GitHub token stored securely in localStorage
3. Rate limiting handled by GitHub's API
4. No server-side code needed - perfect for GitHub Pages

## Setup Instructions

### Prerequisites

- GitHub account
- GitHub Personal Access Token (optional, but recommended for higher rate limits)

### Local Development

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/github-repo-finder.git
   cd github-repo-finder
   ```

2. Open `index.html` in your browser:
   ```bash
   # Using Python 3
   python -m http.server 8000

   # Or using PHP
   php -S localhost:8000

   # Then visit http://localhost:8000
   ```

3. (Optional) Add a GitHub Personal Access Token:
   - Click the "API Token" button in the navbar
   - Generate a token at [github.com/settings/tokens](https://github.com/settings/tokens)
   - Select scope: `public_repo`
   - Paste the token and save

### GitHub API Token (Optional but Recommended)

Adding a GitHub Personal Access Token increases your rate limit from 60 to 5,000 requests per hour:

1. Go to [GitHub Settings > Developer Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token" (classic)
3. Give it a name like "GitHub Code Finder"
4. Select the scope: `public_repo`
5. Copy the generated token
6. Click "API Token" button in the app and paste your token

Your token is stored locally in your browser's localStorage and is never sent to any server.

### Deployment to GitHub Pages

1. Push your code to GitHub

2. Enable GitHub Pages:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Under "Source", select the branch (usually `main` or `master`)
   - Select root directory (`/`)
   - Click "Save"

3. Your site will be available at:
   ```
   https://yourusername.github.io/github-repo-finder/
   ```

4. (Optional) Add a custom domain:
   - Go to repository settings > Pages
   - Add your custom domain
   - Update DNS settings at your domain provider

That's it! No build process, no environment variables, no server configuration needed!

## Project Structure

```
├── css/
│   └── styles.css         # Custom styles
├── js/
│   └── app.js             # Main application logic with GitHub API integration
├── index.html             # Main application UI
├── .nojekyll              # Tells GitHub Pages not to use Jekyll
├── package.json           # Project dependencies (for local dev only)
└── README.md              # This documentation
```

All code runs in the browser - no server-side components needed!

## Usage Examples

- Search for Python main functions: `def main()`
- Find sorting algorithms: `quicksort implementation`
- Discover React hooks usage: `useState hook`
- Explore API patterns: `fetch api async`

## Troubleshooting

### Common Issues

1. **GitHub API Rate Limiting**:
   - Without a token: 60 requests per hour
   - With a token: 5,000 requests per hour
   - Add a GitHub Personal Access Token via the "API Token" button

2. **CORS Errors** (when running locally):
   - Use a local web server instead of opening the file directly
   - Try: `python -m http.server 8000` or `php -S localhost:8000`

3. **Search Not Working**:
   - Check browser console for error messages
   - Verify you haven't exceeded GitHub's rate limit
   - Try adding a GitHub Personal Access Token

## Learning the Codebase

For new programmers, here's a suggested order to explore the codebase:

1. Start with `index.html` to understand the basic structure and UI
2. Explore `css/styles.css` to see how styling is applied
3. Look at `js/app.js` to understand the complete application logic:
   - GitHub API integration
   - Search algorithm
   - Result processing and ranking
   - UI interactions

The entire application is self-contained in these three files, making it easy to understand and modify!

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature`)
6. Create a new Pull Request

## License

MIT
