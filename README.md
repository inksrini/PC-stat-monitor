# PC Stat Monitor

A lightweight, self-hosted Windows PC monitoring dashboard built with **Node.js, systeminformation, HTML, CSS, and vanilla JavaScript**. It turns an old iPhone 5s into a dedicated landscape display for the PC's live system statistics.

The dashboard is designed to be simple: no frontend framework, no database, and no cloud service required.

## Features

- Live CPU utilization
- CPU clock-speed reading
- System memory usage
- Local drive usage and capacity
- Network download and upload throughput
- System uptime and a live clock
- Dark, amber-accented landscape interface
- Updates the displayed statistics automatically

> **Sensor accuracy note:** CPU temperature reporting is currently experimental. The development version uses a manually adjusted value because the temperature returned by `systeminformation` did not match the reference monitor on the author's PC. Treat it as an estimate, not a verified sensor reading. Do not use it to make thermal-safety decisions. Replace the temporary adjustment with a verified hardware sensor source before relying on this value.

## Preview

Add a screenshot or photo of the dashboard here, for example:

```markdown
![PC Stat Monitor running on an iPhone 5s](screenshots/iphone-dashboard.jpg)
```

To use that preview, add your image to a `screenshots/` folder and update the filename above.

## Requirements

- Windows PC
- Node.js and npm
- An iPhone or another display device is optional; the dashboard can also run in a desktop browser

## Installation

1. Clone or download this repository.
2. Open a terminal in the project folder.
3. Install the dependency:

   ```powershell
   npm install
   ```

4. Start the server:

   ```powershell
   node server.js
   ```

5. Open the dashboard in a browser on the same PC:

   ```text
   http://localhost:3000
   ```

The raw statistics endpoint is available at:

```text
http://localhost:3000/api/stats
```

## Using an iPhone as the display

If the iPhone is already connected to Windows as a secondary display, open `http://localhost:3000` on the PC, move the browser window onto the iPhone display, and use the browser's fullscreen mode (usually **F11** in Chrome or Edge).

For this local-display setup, the server should listen only on the PC's loopback interface. In `server.js`, use `127.0.0.1` in the `server.listen` call:

```javascript
server.listen(PORT, "127.0.0.1", () => {
    console.log(`Dashboard: http://localhost:${PORT}`);
});
```

Do not configure router port forwarding for this project. If you intentionally want to access it from another device over the network, review the server binding and firewall rules first.

## Project structure

```text
pc-stat-monitor/
├── public/
│   ├── index.html   # Dashboard markup
│   ├── style.css    # Layout and visual styling
│   └── app.js       # Fetches and displays live statistics
├── server.js        # Local HTTP server and statistics API
├── package.json     # Project metadata and dependencies
├── package-lock.json
├── .gitignore
└── README.md
```

## Technology

- **Node.js** — serves the dashboard and API
- **systeminformation** — reads system statistics exposed by the host operating system
- **HTML, CSS, JavaScript** — renders the dashboard without a frontend framework

## Known limitations

- Available sensors and the accuracy of readings depend on Windows, hardware, firmware, and the installed libraries.
- CPU utilization and clock speed may differ from Task Manager because tools may measure or calculate them differently and refresh at different times.
- The temporary CPU temperature adjustment is not a reliable calibration across different loads or conditions. Use a verified hardware sensor source for an accurate value.
- Network throughput is based on the network statistics exposed by `systeminformation`; results can depend on the selected adapter and the library's sampling interval.

## Security

This project is intended for personal, local use. Keep the server bound to `127.0.0.1` if you only need to show the dashboard on a display connected to the same PC. Do not expose the service directly to the public internet or configure router port forwarding.

## License

No license has been added yet. Unless a license is included in the repository, others should not assume they have permission to reuse, modify, or distribute the code. Add a license file if you want to allow reuse.
