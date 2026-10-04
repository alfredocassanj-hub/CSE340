import bcrypt from "bcrypt";
import db from "./db.js";

const findUserByEmail = async (email) => {
    const query = `
        SELECT user_id, name, email, password_hash, role_id
        FROM users
        WHERE email = $1
    `;

    const queryParams = [email];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
};

const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if (!user) {
        return null;
    }

    const passwordValid = await verifyPassword(
        password,
        user.password_hash
    );

    if (!passwordValid) {
        return null;
    }

    return user;
};

const getAllUsers = async () => {
    const query = `
        SELECT 
            u.user_id,
            u.name,
            u.email,
            r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        ORDER BY u.name
    `;

    const result = await db.query(query);

    return result.rows;
};

const registerUser = async (name, email, password) => {
    const passwordHash = await bcrypt.hash(password, 10);

    const query = `
        INSERT INTO users (name, email, password_hash, role_id)
        VALUES ($1, $2, $3, 1)
        RETURNING user_id, name, email, role_id
    `;

    const queryParams = [
        name,
        email,
        passwordHash
    ];

    const result = await db.query(query, queryParams);

    return result.rows[0];
};

export {
    findUserByEmail,
    verifyPassword,
    authenticateUser,
    getAllUsers,
    registerUser
};