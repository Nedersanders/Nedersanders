const bcrypt = require('bcryptjs');
const { pgPool } = require('../config/database');

class User {
    constructor(userData) {
        this.id = userData.id;
        this.email = userData.email;
        this.fullName = userData.full_name;
        this.username = userData.username;
        this.role = userData.role;
        this.createdAt = userData.created_at;
        this.updatedAt = userData.updated_at;
        this.lastLogin = userData.last_login;
        this.isActive = userData.is_active;
    }

    // Create a new user
    static async create(userData) {
        const { email, password, fullName, username, role = 'user' } = userData;
        
        try {
            // Hash password
            const saltRounds = 12;
            const passwordHash = await bcrypt.hash(password, saltRounds);
            
            const query = `
                INSERT INTO users (email, password_hash, full_name, username, role)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `;
            
            const result = await pgPool.query(query, [email, passwordHash, fullName, username, role]);
            return new User(result.rows[0]);
        } catch (error) {
            if (error.code === '23505') { // Unique constraint violation
                throw new Error('Email already exists');
            }
            throw error;
        }
    }

    // Find user by email
    static async findByEmail(email) {
        try {
            const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
            const result = await pgPool.query(query, [email]);
            
            if (result.rows.length === 0) {
                return null;
            }
            
            return new User(result.rows[0]);
        } catch (error) {
            throw error;
        }
    }

    // Find user by ID
    static async findById(id) {
        try {
            const query = 'SELECT * FROM users WHERE id = $1 AND is_active = true';
            const result = await pgPool.query(query, [id]);
            
            if (result.rows.length === 0) {
                return null;
            }
            
            return new User(result.rows[0]);
        } catch (error) {
            throw error;
        }
    }

    // Verify password
    static async verifyPassword(email, password) {
        try {
            const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
            const result = await pgPool.query(query, [email]);
            
            if (result.rows.length === 0) {
                return null;
            }
            
            const user = result.rows[0];
            const isValid = await bcrypt.compare(password, user.password_hash);
            
            if (isValid) {
                // Update last login
                await pgPool.query(
                    'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
                    [user.id]
                );
                return new User(user);
            }
            
            return null;
        } catch (error) {
            throw error;
        }
    }

    // Get all users (admin only)
    static async findAll() {
        try {
            const query = 'SELECT * FROM users WHERE is_active = true ORDER BY created_at DESC';
            const result = await pgPool.query(query);
            return result.rows.map(row => new User(row));
        } catch (error) {
            throw error;
        }
    }

    // Update user
    async update(updateData) {
        const allowedFields = ['full_name', 'username', 'role'];
        const updates = [];
        const values = [];
        let valueIndex = 1;

        for (const [key, value] of Object.entries(updateData)) {
            if (allowedFields.includes(key) && value !== undefined) {
                updates.push(`${key} = $${valueIndex}`);
                values.push(value);
                valueIndex++;
            }
        }

        if (updates.length === 0) {
            return this;
        }

        try {
            const query = `
                UPDATE users 
                SET ${updates.join(', ')}
                WHERE id = $${valueIndex}
                RETURNING *
            `;
            values.push(this.id);

            const result = await pgPool.query(query, values);
            const updatedUser = new User(result.rows[0]);
            Object.assign(this, updatedUser);
            return this;
        } catch (error) {
            throw error;
        }
    }

    // Change password
    async changePassword(newPassword) {
        try {
            const saltRounds = 12;
            const passwordHash = await bcrypt.hash(newPassword, saltRounds);
            
            await pgPool.query(
                'UPDATE users SET password_hash = $1 WHERE id = $2',
                [passwordHash, this.id]
            );
            
            return true;
        } catch (error) {
            throw error;
        }
    }

    // Deactivate user (soft delete)
    async deactivate() {
        try {
            await pgPool.query(
                'UPDATE users SET is_active = false WHERE id = $1',
                [this.id]
            );
            this.isActive = false;
            return true;
        } catch (error) {
            throw error;
        }
    }

    // Update last login time
    static async updateLastLogin(userId) {
        try {
            const query = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1';
            await pgPool.query(query, [userId]);
            return true;
        } catch (error) {
            console.error('Error updating last login:', error);
            throw error;
        }
    }

    // Convert to safe object (without sensitive data)
    toSafeObject() {
        return {
            id: this.id,
            email: this.email,
            fullName: this.fullName,
            username: this.username,
            role: this.role,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            lastLogin: this.lastLogin
        };
    }
}

module.exports = User;
