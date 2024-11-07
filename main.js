class Car {
    constructor(type, license_plate) {
        const validTypes = ['small', 'normal', 'big'];
        if (!validTypes.includes(type)) {
            throw new Error(`Тип автомобиля "${type}" не поддерживается. Допустимые типы: ${validTypes.join(', ')}`);
        }
        this.type = type;
        this.license_plate = license_plate;
        this.parkedAt = null;
    }
}

class CarPark {
    constructor(small = 10, normal = 5, big = 2) {
        this.spots = {
            small: new Array(small).fill(null),
            normal: new Array(normal).fill(null),
            big: new Array(big).fill(null)
        };
        this.reservedSpots = {
            small: [],
            normal: [],
            big: []
        };
    }

    add_car(car) {
        if (this.isReserved(car.type)) {
            console.log(`Место для типа ${car.type} зарезервировано.`);
            return;
        }

        let free_place_ind = this.spots[car.type].indexOf(null);
        if (free_place_ind !== -1) {
            car.parkedAt = new Date();
            this.spots[car.type][free_place_ind] = car;
            console.log(`Автомобиль ${car.license_plate} помещен на парковку типа: ${car.type} на место: ${free_place_ind}`);
            return;
        } 
        console.log(`Нет свободных мест для ${car.type} автомобилей`);
    }

    delete_car(car) {
        let car_place = this.spots[car.type].findIndex(c => c && c.license_plate === car.license_plate);
        if (car_place === -1) {
            console.log(`Машины ${car.license_plate} нет на данной парковке`);
            return;
        }

        const parkedCar = this.spots[car.type][car_place];
        const parkedDuration = (new Date() - parkedCar.parkedAt) / 1000 / 60;
        const cost = this.calculateCost(parkedCar.type, parkedDuration);

        console.log(`Машина ${car.license_plate} была отдана владельцу. Стоимость парковки: ${cost.toFixed(2)}$`);
        this.spots[car.type][car_place] = null;
    }

    calculateCost(type, duration) {
        const rates = {small: 1, normal: 2, big: 3 };
        return rates[type] * duration;
    }

    reserve_spot(type, duration) {
        if (this.isReserved(type)) {
            console.log(`Нет доступных мест для резервирования типа ${type}`);
            return;
        }

        const reservationEndTime = new Date(Date.now() + duration * 60000);
        this.reservedSpots[type].push(reservationEndTime);
        console.log(`Место типа ${type} зарезервировано на ${duration} минут`);
    }

    isReserved(type) {
        const now = new Date();
        return this.reservedSpots[type].some(reservation => reservation > now);
    }

    list_all() {
        let types = ['small', 'normal', 'big'];
        for (let park_type of types) {
            const carsInType = this.spots[park_type].map(car => car ? car.license_plate : 'пусто').join(', ');
            console.log(`Парковка <${park_type}>: [${carsInType}]`);
        }
    }
}
