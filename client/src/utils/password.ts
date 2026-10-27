import * as argon2 from 'argon2';

export const hashPassword = async (password: string): Promise<string> => {
    const salt = crypto.getRandomValues(new Uint8Array(32));
	const result = argon2.hash(password, { type: argon2.argon2id, memoryCost: 19456, parallelism: 1 });    
    return `${salt}.${result}`;
}

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    const split = hashedPassword.split('.');
	if (split.length != 2)
		return false;
	return await argon2.verify(hashedPassword, password);
}