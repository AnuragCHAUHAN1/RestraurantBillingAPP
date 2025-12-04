const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true, // ऊपर का मेनू बार छिपाने के लिए
    // यहाँ .ico फ़ाइल का उपयोग करें (विंडोज के लिए .png काम नहीं करता)
    icon: path.join(__dirname, 'build/icon.ico') 
  });

  // React की बिल्ड की गई फ़ाइलों को लोड करें
  win.loadFile(path.join(__dirname, 'dist', 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});