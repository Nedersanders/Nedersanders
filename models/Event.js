const { pgPool } = require('../config/database');

class Event {
    constructor(row) {
        this.id = row.id;
        this.title = row.title;
        this.description = row.description;
        this.eventDate = row.event_date;
        this.location = row.location;
        this.price = row.price;
        this.imageUrl = row.image_url;
        this.createdAt = row.created_at;
        this.updatedAt = row.updated_at;
    }

    static async create({ title, description, eventDate, location, price, imageUrl }) {
        const query = `
            INSERT INTO events (title, description, event_date, location, price, image_url)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const values = [title, description, eventDate, location, price, imageUrl];
        const { rows } = await pgPool.query(query, values);
        return new Event(rows[0]);
    }

    static async findAll() {
        const query = 'SELECT * FROM events ORDER BY event_date ASC';
        const { rows } = await pgPool.query(query);
        return rows.map(row => new Event(row));
    }

    static async findByPk(id) {
        const query = 'SELECT * FROM events WHERE id = $1';
        const { rows } = await pgPool.query(query, [id]);
        if (rows.length === 0) {
            return null;
        }
        return new Event(rows[0]);
    }

    toSafeObject() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            eventDate: this.eventDate,
            location: this.location,
            price: this.price,
            imageUrl: this.imageUrl
        };
    }
}

module.exports = Event;