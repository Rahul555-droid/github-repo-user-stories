

# **Real-Time Option Chain Application**

This React-based application displays a real-time option chain using data fetched from algotest's APIs and WebSocket updates. The app supports filtering by expiry data and contract, dark mode, etc.

---
![chrome-capture-2024-11-23 (2)](https://github.com/user-attachments/assets/168b4c36-6343-42a9-8b53-185b5a7e5bbf)


## **Features**
1. **Real-Time Updates**: 
   - Integrates WebSocket to update option chain prices dynamically.
   - Processes batched WebSocket messages for efficient UI updates.
   - Uses /contracts and /option-chain-with-ltp for crafting proper initial UI 

2. **Dark Mode**: 
   - Built-in theme toggling using Tailwind CSS for light and dark modes.

3. **Dynamic Filters**:
   - Users can select contracts and expiries to view relevant data.

---

## **Project Structure (from /src)**

```
|   constant.js             # Default constants for the app
|   global.types.ts         # TypeScript type definitions for API responses
|   index.tsx               # Application entry point
|
+---components
|   |   App.tsx             # Main wrapper component for the app (can be renamed as OptionChain.tsx)
|   |
|   +---CustomSelect
|   |       CustomSelect.tsx  # Dropdown for selecting contracts
|   |
|   +---DarkModeToggle
|   |       index.tsx         # Button to toggle between light and dark modes
|   |
|   +---Filters
|   |       Filters.tsx       # Expiry filter buttons
|   |
|   \---Table
|           Table.tsx         # Displays option chain data in tabular format
|
+---hooks
|       useWebSocket.ts       # Custom WebSocket hook for live updates
|
\---utils
        getAxios.js           # Axios setup for API requests
```

---

## **Components**

### **1. App**
- The main entry point that coordinates all components.
- Manages state for:
  - Selected contract
  - Selected expiry
  - Enriched options (including WebSocket updates).
- Uses `useQuery` for fetching contracts and option chain data.
- Wraps child components like `CustomSelect`, `Filters`, and `Table`.

---

### **2. CustomSelect**
- A reusable dropdown for selecting contracts.
- Dynamically updates the selected contract based on user input.

---

### **3. DarkModeToggle**
- Allows users to switch between light and dark themes.
- Dynamically updates the `dark` class on the `<html>` element.

---

### **4. Filters**
- Displays expiry buttons for filtering option chain data.
- Highlights the selected expiry and updates the state on click.

---

### **5. Table**
- Displays option chain data in a clean, tabular format.
- Includes columns for:
  - Call and Put prices
  - Strike price
  - Delta, IV, and other metrics.
- Dynamically updates values based on WebSocket data.

---

### **6. useWebSocket Hook**
- Establishes a WebSocket connection to receive real-time updates.
- Handles:
  - Connection setup and cleanup.
  - Batching updates for efficient UI rendering (every 500ms).
  - Automatic reconnection on connection loss.

---

## **Installation and Setup**

### **1. Prerequisites**
Ensure you have the following installed:
- **Node.js** (>=16.0.0)
- **npm**
  
### **2. Clone the Repository**
```bash
git clone <repository-url>
cd <repository-name>
```

### **3. Install Dependencies**
```bash
npm install
```

---

## **Usage**

### **Run in Development Mode**
```bash
npm start
# or
yarn start
```
The app will be available at [http://localhost:3000](http://localhost:3000).

### **Build for Production**
```bash
npm run build
# or
yarn build
```

### **Run Tests**
(Currently unavailable. Add testing using Jest or Vitest for comprehensive coverage.)

