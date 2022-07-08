import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export class PasswordHooks {
  static async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(8).toString("hex");
    const buff = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buff.toString("hex")}.${salt}`;
  }

  static async comparePassword(storedPassword: string, suppliedPassword: string): Promise<boolean> {
    const [hashedPassword, salt] = storedPassword.split(".");
    const buff = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
    return buff.toString("hex") === hashedPassword;
  }
}
