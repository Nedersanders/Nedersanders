const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { hashPassword } = require('../utils/auth');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 30],
      isAlphanumeric: true
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [8, 255] // Allow for both plain text (min 8) and hashed passwords (60 chars)
    }
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [1, 50]
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [1, 50]
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  role: {
    type: DataTypes.ENUM('user', 'admin', 'moderator'),
    defaultValue: 'user'
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  loginAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lockUntil: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true, // Adds createdAt and updatedAt
  paranoid: true, // Adds deletedAt for soft deletes
  
  // Hooks
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await hashPassword(user.password);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await hashPassword(user.password);
      }
    }
  },
  
  // Instance methods
  instanceMethods: {
    getFullName() {
      return `${this.firstName || ''} ${this.lastName || ''}`.trim();
    },
    
    isLocked() {
      return this.lockUntil && this.lockUntil > Date.now();
    }
  },
  
  // Class methods
  classMethods: {
    async findByEmail(email) {
      return await this.findOne({ where: { email } });
    },
    
    async findByUsername(username) {
      return await this.findOne({ where: { username } });
    }
  }
});

// Instance methods (alternative syntax for newer Sequelize versions)
User.prototype.getFullName = function() {
  return `${this.firstName || ''} ${this.lastName || ''}`.trim();
};

User.prototype.isLocked = function() {
  return this.lockUntil && this.lockUntil > Date.now();
};

// Class methods (alternative syntax)
User.findByEmail = async function(email) {
  return await this.findOne({ where: { email } });
};

User.findByUsername = async function(username) {
  return await this.findOne({ where: { username } });
};

module.exports = User;
