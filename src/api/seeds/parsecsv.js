const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const { MongoClient } = require('mongodb');

// Configuración de la conexión a MongoDB
const uri = 'mongodb://localhost:3000'; // Cambia esta URI según tu configuración de MongoDB
const dbName = 'yourDatabaseName'; // Nombre de tu base de datos
const collectionName = 'users'; // Nombre de tu colección

// Función principal
async function seedDatabase() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // Conectar a la base de datos
    await client.connect();
    console.log('Conectado a MongoDB');
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Leer el archivo CSV
    const filePath = path.resolve(__dirname, 'flights.csv');
    const users = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        // Transformar datos de CSV a estructura adecuada para MongoDB
        const { username, password, travels, arrives, exits } = row;

        // Buscar si el usuario ya existe en la lista
        let user = users.find((u) => u.username === username);
        if (!user) {
          user = { username, password, flights: [] };
          users.push(user);
        }

        // Agregar vuelo al usuario
        user.flights.push({ travels, arrives, exits });
      })
      .on('end', async () => {
        console.log('Archivo CSV leído con éxito');
        
        // Insertar datos en MongoDB
        await collection.insertMany(users);
        console.log('Datos insertados en MongoDB');

        // Cerrar conexión
        await client.close();
      });
  } catch (error) {
    console.error('Error al conectar o insertar datos en MongoDB:', error);
  }
}

// Ejecutar función principal
seedDatabase();
