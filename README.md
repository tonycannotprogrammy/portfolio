# Portfolio Card React Project

This project is a React application that replicates the functionality and appearance of a portfolio card with a flip effect. The card can be flipped to reveal its back side, includes hover/tilt effects, and displays a QR code (SVG) on the back.

## Project Structure

```
portfolio_website-react
├── public
│   └── index.html          # Main HTML template
├── src
│   ├── components
│   │   └── Card.tsx       # Card component with flip effect
│   ├── App.tsx            # Main application component
│   ├── index.tsx          # Entry point of the React application
│   ├── styles
│   │   └── Card.css       # CSS styles for the Card component
│   ├── assets
│   │   └── qrcode.svg     # SVG QR code displayed on card back
├── package.json            # npm configuration file
├── tsconfig.json           # TypeScript configuration file
└── README.md               # Project documentation
```

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd portfolio_website-react
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the application**:
   ```
   npm start
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000` to view the application.

## Usage

- Click on the card to flip it and reveal the back side (with SVG QR code).
- Hover over the corners of the card to see tilt effects.

## Technologies Used

- React
- TypeScript
- CSS

## License

This project is licensed under the MIT License.