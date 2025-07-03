const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000; // Le port sur lequel le serveur écoute
const folderPath = './monDossier'; // Remplace par le chemin de ton dossier

// Fonction pour compter les fichiers dans le dossier
function countFilesInFolder(folder) {
  return new Promise((resolve, reject) => {
    fs.readdir(folder, (err, files) => {
      if (err) {
        reject(err);
      } else {
        // On filtre les fichiers pour exclure les dossiers
        const fileCount = files.filter(file => fs.statSync(path.join(folder, file)).isFile()).length;
        resolve(fileCount);
      }
    });
  });
}

// Création du serveur HTTP
const server = http.createServer(async (req, res) => {
  if (req.url === '/count-files' && req.method === 'GET') {
    try {
      const count = await countFilesInFolder(folderPath);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ count: count }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Erreur lors de la lecture du dossier.' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page non trouvée');
  }
});

// Lancer le serveur
server.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});