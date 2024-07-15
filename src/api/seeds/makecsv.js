const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// CSV Writer Configuration
const csvWriter = createCsvWriter({
    path: './csvs/flights.csv',
    header: [
        {id: 'username', title: 'username'},
        {id: 'password', title: 'password'},
        {id: 'travels', title: 'travels'},
        {id: 'arrives', title: 'arrives'},
        {id: 'exits', title: 'exits'}
    ]
});

// Helper Function to Generate Random Data
const getRandomDate = () => {
    const start = new Date(2024, 0, 1);
    const end = new Date(2025, 0, 1);
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
};

const getRandomTime = () => {
    const hour = Math.floor(Math.random() * 24);
    const minute = Math.floor(Math.random() * 60);
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

const getRandomAirline = () => {
    const airlines = ['Airline1', 'Airline2', 'Airline3', 'Airline4'];
    return airlines[Math.floor(Math.random() * airlines.length)];
};

const getRandomCity = () => {
    const cities = ['CityA', 'CityB', 'CityC', 'CityD', 'CityE', 'CityF', 'CityG', 'CityH'];
    return cities[Math.floor(Math.random() * cities.length)];
};

const generateFlight = () => {
    const departureCity = getRandomCity();
    let arrivalCity;
    do {
        arrivalCity = getRandomCity();
    } while (arrivalCity === departureCity);
    const price = (Math.random() * 500 + 100).toFixed(2);
    const airline = getRandomAirline();
    const duration = (Math.random() * 5 + 1).toFixed(1);
    const date = getRandomDate();
    const time = getRandomTime();
    const stops = Math.random() > 0.5 ? 'Non-stop' : `${Math.floor(Math.random() * 2) + 1} stops`;

    return {
        travel: `${date} ${time}, ${airline}`,
        arrives: `${arrivalCity}, ${departureCity}, $${price}, ${airline}, ${duration}h, ${date} ${time}, ${stops}`,
        exits: `${departureCity}, ${arrivalCity}, $${price}, ${airline}, ${duration}h, ${date} ${time}, ${stops}`
    };
};

// Generate User Data
const users = [];

for (let i = 1; i <= 100; i++) {
    const flights = [];
    const numFlights = Math.floor(Math.random() * 2) + 1; // Each user has 1 or 2 flights
    for (let j = 0; j < numFlights; j++) {
        flights.push(generateFlight());
    }
    users.push({
        username: `user${i}`,
        password: `pass${i}`,
        flights
    });
}

// Transform Data for CSV Writing
const records = [];

users.forEach(user => {
    user.flights.forEach(flight => {
        records.push({
            username: user.username,
            password: user.password,
            travels: flight.travel,
            arrives: flight.arrives,
            exits: flight.exits
        });
    });
});

// Write to CSV
csvWriter.writeRecords(records)
    .then(() => {
        console.log('CSV file written successfully');
    })
    .catch(err => {
        console.error('Error writing CSV file', err);
    });
