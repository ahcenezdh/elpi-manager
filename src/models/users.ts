import Database from "models/database";
import * as bcrypt from 'bcrypt';

const db = Database.getInstance();

interface IUser {
    id: number; // Id of the user in the database
    username: string; // Email hash
    password_hash: string; // Password hash
    role: string;
}

class Users {
    private async hashEmail(email: string): Promise<string> {
        return bcrypt.hash(email, 8);
    }

    private async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 12);
    }

    public async getUser(emailHash: string): Promise<IUser | null> {
        const users: IUser[] = await db.query<IUser[]>("SELECT * FROM `users` WHERE username = ?", [emailHash]);
        return users.length > 0 ? users[0] : null;
    }

    public async getAllUsers(): Promise<IUser[]> {
        return await db.query<IUser[]>("SELECT * FROM `users`");
    }

    public async registerUser(email: string, password: string): Promise<string> {
        try {
            const emailHash = await this.hashEmail(email);
            const existingUser = await this.getUser(emailHash);
            if (existingUser) {
                return "user_already_exists";
            }

            const passwordHash = await this.hashPassword(password);

            const result = await db.query<{affectedRows: number}>(
                "INSERT INTO `users` (username, password_hash) VALUES (?, ?)",
                [emailHash, passwordHash]
            );

            if (result.affectedRows <= 0) {
                throw new Error("Failed to insert user");
            }

            return "user_registered_successfully";
        } catch (error) {
            console.error("Error in registerUser:", error);
            return "registration_failed";
        }
    }

    public async verifyPassword(emailHash: string, password: string): Promise<boolean> {
        const user = await this.getUser(emailHash);
        if (!user) {
            return false;
        }
        return bcrypt.compare(password, user.password_hash);
    }

    public async loginUser(email: string, password: string): Promise<string> {
        const emailHash = await this.hashEmail(email);
        const isValid = await this.verifyPassword(emailHash, password);
        if (!isValid) {
            return "invalid_credentials";
        }

        return "login_successful";
    }

    public async getUserPassword(emailHash: string): Promise<string | null> {
        const user = await this.getUser(emailHash);
        return user ? user.password_hash : null;
    }

    public async setUserRole(source: IUser, targetUser: IUser, role: string): Promise<void | string> {
        if (source.role !== "admin") {
            return "dont_have_permission_to_set_role";
        }
        targetUser.role = role;
        // TODO: find a way to edit the database when editing IUser
    }

    // TODO: write a function to wipe someone from the database
}

export default Users;