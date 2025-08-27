const { pgPool } = require("../config/database");

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
    this.officialEvent = row.official_event || false; // Default to false if not set
  }

  static async create({
    title,
    description,
    eventDate,
    location,
    price,
    imageUrl,
    officialEvent,
  }) {
    const query = `
            INSERT INTO events (title, description, event_date, location, price, image_url, official_event)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
    const values = [title, description, eventDate, location, price, imageUrl, officialEvent];
    const { rows } = await pgPool.query(query, values);
    return new Event(rows[0]);
  }

  static async findAll(options = {}) {
    let query = "SELECT * FROM events";
    // Handle ordering if provided
    if (options.order) {
      query += ` ORDER BY ${options.order.map((o) => o.join(" ")).join(", ")}`;
    } else {
      query += " ORDER BY event_date ASC";
    }
    // Handle limit if provided
    if (options.limit) {
      query += " LIMIT $1";
    }
    const { rows } = await pgPool.query(query, [options.limit]);
    return rows.map((row) => new Event(row));
  }

  static async findByPk(id) {
    const query = "SELECT * FROM events WHERE id = $1";
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
      imageUrl: this.imageUrl,
    };
  }
}
 
module.exports = Event;
