const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const Datastore = require("nedb");

function createWindow() {
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        minWidth: 600,
        minHeight: 900,
        closable: true,
        darkTheme: false,
        frame: false,
        icon: path.join(__dirname, 'ico/ico.ico'),
        webPreferences: {
            nodeIntegration: true,
            experimentalFeatures: true,
            contextIsolation: false,
            devTools: true,
            preload: path.join(__dirname, "preload.js")
        },
    });

    win.loadFile("index.html");
    win.webContents.openDevTools();
    ipcMain.on("reduceApp", () => {
        win.minimize();
    });

    ipcMain.on("sizeApp", () => {
        if (win.isMaximized()) {
            win.restore();
        } else {
            win.maximize();
        }
    });

    ipcMain.on("closeApp", () => {
        win.close();
    });

    ipcMain.on("addLigneToDb", (event, data) => {
        db.insert(data, function (err, newrec) {
            if (err) {
                console.log("*** err =", err);
            } else {
                console.log("*** created =", newrec);
            }
        });
        win.reload();
    });

    ipcMain.on("updateLigneInDb", (event, args) => {
        const ligneId = args.ligneId;
        const updatedData = args.updatedData;

        console.log("updatedData de main.js prend : " + ligneId + " comme id.");

        db.update({ _id: ligneId }, { $set: updatedData }, {}, function (err, numReplaced) {
            if (err) {
                console.log("*** err =", err);
            } else {
                console.log("l'id qui recoit la mise a jour : " + ligneId);
                console.log(`${numReplaced} champ(s) remplacer`);

                win.reload();
            }
        });
    });
}

const db = new Datastore({ filename: "data.db", autoload: true });

app.on('ready', () => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
