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
        icon: 'build/icons/icon.png',
        publisherName: 'Enime'
    },
    linux: {
        category: 'entertainment',
        icon: 'build/icons/icon.png'
    },
    nsis: {
        oneClick: false,
        allowElevation: true,
        allowToChangeInstallationDirectory: true,
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
        installerIcon: 'build/icons/icon.ico',
        uninstallerIcon: 'build/icons/icon.ico'
    }
};

module.exports = config;
