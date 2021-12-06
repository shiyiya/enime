const config = {
    directories: {
        output: 'packaged'
    },
    npmRebuild: false,
    files: [
        'dist/',
        'node_modules/'
    ],
    extraResources: [
        'build/assets',
        'build/icons'
    ],
    win: {
        target: ['nsis', 'nsis-web', 'portable'],
        icon: 'build/icons/win/icon.ico',
        publisherName: 'Enime'
    },
    linux: {
        category: 'entertainment',
        icon: 'build/icons/png/256x256.png'
    },
    nsis: {
        oneClick: false,
        allowElevation: true,
        allowToChangeInstallationDirectory: true,
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
        installerIcon: 'build/icons/win/icon.ico',
        uninstallerIcon: 'build/icons/win/icon.ico'
    },
    asar: false
};

module.exports = config;
