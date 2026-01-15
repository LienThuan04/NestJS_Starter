import * as bcrypt from 'bcrypt';

export const generatePasswordHash = async (password: string, saltRounds: number): Promise<string> => {
    const salt = await bcrypt.genSalt(saltRounds);
    const passAfterHashing = await bcrypt.hash(password, salt);
    return passAfterHashing;
}

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
}