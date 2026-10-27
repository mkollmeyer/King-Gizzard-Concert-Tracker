import bcryptjs from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcryptjs.genSalt(12);
    const result = await bcryptjs.hash(password, salt);
    return result;
}

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    const result = await bcryptjs.compare(password, hashedPassword);
    /*const result = (password === hashedPassword);*/
    console.log("Password verification result:", result);
    return result;
}