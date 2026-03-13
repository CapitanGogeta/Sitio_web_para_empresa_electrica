const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3000;

// Tipos de archivos que el servidor podrá leer (MIME types)
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // 1. SEGURIDAD: Solo permitir métodos GET y HEAD
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        return res.end('405 Method Not Allowed');
    }

    // Si la ruta es '/', cargamos el index.html
    let filePath = req.url === '/' ? '/index.html' : req.url;
    
    // Limpiamos los parámetros de la URL si los hay (por ejemplo ?id=1)
    filePath = filePath.split('?')[0];

    // Decodificar URL para manejar caracteres en formato %20, %2e, etc.
    try {
        filePath = decodeURIComponent(filePath);
    } catch (e) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        return res.end('400 Bad Request');
    }

    // 2. SEGURIDAD: Prevenir Path Traversal (Evitar que naveguen hacia atrás con "../")
    if (filePath.includes('..')) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        return res.end('403 Forbidden - Acceso denegado');
    }

    // Construimos la ruta absoluta al archivo
    const absolutePath = path.join(__dirname, filePath);
    
    // Obtenemos la extensión del archivo para saber cómo enviarlo
    const extname = String(path.extname(absolutePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    // Leemos el archivo y lo enviamos
    fs.readFile(absolutePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found - Archivo no encontrado</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Error interno del servidor: ${err.code}`);
            }
        } else {
            // 3. SEGURIDAD: Cabeceras de seguridad básicas
            const securityHeaders = {
                'X-Content-Type-Options': 'nosniff', // Evita que el navegador intente adivinar el tipo de archivo (protege de ataques XSS)
                'X-Frame-Options': 'DENY',           // Impide que tu web sea incrustada en otras mediante iframes (Clickjacking)
                'X-XSS-Protection': '1; mode=block'  // Activa el filtro Cross-Site Scripting del navegador
            };

            // Configurar Cache-Control
            const devHeader = {};
            if (extname.match(/^\.(png|jpg|jpeg|gif|ico)$/)) {
                // Caché para imágenes: 30 días
                devHeader['Cache-Control'] = 'public, max-age=2592000';
            } else if (extname.match(/^\.(css|js)$/)) {
                // Caché para CSS/JS: 1 día
                devHeader['Cache-Control'] = 'public, max-age=86400';
            } else {
                // Sin caché para HTML (siempre pide la versión más reciente)
                devHeader['Cache-Control'] = 'no-cache';
            }

            res.writeHead(200, { 
                'Content-Type': contentType,
                ...securityHeaders,
                ...devHeader 
            });
            res.end(content, 'utf-8');
        }
    });
});

// Escuchamos en la dirección 0.0.0.0 para permitir conexiones desde otros dispositivos en la red local
server.listen(PORT, '0.0.0.0', () => {
    console.log('==================================================');
    console.log(`🚀 Servidor iniciado correctamente en el puerto ${PORT}`);
    console.log('==================================================');
    
    console.log('\n💻 Para ver la página desde esta PC, abre tu navegador en:');
    console.log(`   http://localhost:${PORT}`);
    
    console.log('\n📱 Para ver la página desde tu celular:');
    console.log('   (Asegúrate de que tu celular está conectado al mismo Wi-Fi que tu computadora)');
    
    // Obtenemos e imprimimos la dirección IP local de la computadora
    const interfaces = os.networkInterfaces();
    let ipFound = false;
    
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Ignoramos direcciones internas (localhost) y nos quedamos con las IPv4
            if (iface.family === 'IPv4' && !iface.internal) {
                console.log(`   👉 http://${iface.address}:${PORT}`);
                ipFound = true;
            }
        }
    }
    
    if (!ipFound) {
        console.log('   (No se pudo detectar tu IP local automáticamente. Puedes buscarla usando el comando "ipconfig" en tu consola)');
    }
    
    console.log('\nPara detener el servidor en cualquier momento, presiona Ctrl + C en esta consola.');
});

// 4. ESTABILIDAD: Manejo de errores globales para evitar que el servidor se cierre por completo
process.on('uncaughtException', (err) => {
    console.error('CRÍTICO: Excepción no controlada (El servidor previno una caída):', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('CRÍTICO: Promesa rechazada y no manejada (El servidor previno una caída):', reason);
});
