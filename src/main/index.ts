import { app, BrowserWindow, Menu, shell, Tray } from 'electron'
import { join } from 'path'
import { registerIpcHandlers } from './ipc-handlers'

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 480,
    height: 680,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    title: 'LewSteamMan',
    backgroundColor: '#0f172a',
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  // Minimize to tray instead of closing — but only in the packaged app.
  // In dev, closing the window should fully quit so the Electron process
  // doesn't linger in the background after the dev server stops.
  mainWindow.on('close', (e) => {
    if (!app.isQuitting && app.isPackaged) {
      e.preventDefault()
      mainWindow?.hide()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // Load the renderer
  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function createTray(): void {
  // Use a simple label-based tray for now; icon can be added later
  tray = new Tray(join(__dirname, '../../resources/icon.png'))

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show LewSteamMan',
      click: () => showWindow()
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true
        app.quit()
      }
    }
  ])

  tray.setToolTip('LewSteamMan')
  tray.setContextMenu(contextMenu)
  tray.on('double-click', () => showWindow())
}

function showWindow(): void {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.show()
  } else {
    createWindow()
  }
}

// Extend App type for isQuitting flag
declare module 'electron' {
  interface App {
    isQuitting: boolean
  }
}

app.isQuitting = false

app.whenReady().then(() => {
  registerIpcHandlers()
  createWindow()
  createTray()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Any quit path (Cmd/Ctrl+Q, OS shutdown, dev server stop) must flip this
// flag so the window's close handler stops trapping the close into the tray.
app.on('before-quit', () => {
  app.isQuitting = true
})

app.on('will-quit', () => {
  tray?.destroy()
  tray = null
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In dev, make sure terminating the dev server actually exits Electron
// instead of leaving an orphaned process behind.
if (!app.isPackaged) {
  const quit = (): void => {
    app.isQuitting = true
    app.quit()
  }
  process.on('SIGINT', quit)
  process.on('SIGTERM', quit)
}
