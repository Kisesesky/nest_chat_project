import * as bcrypt from 'bcrypt'

export async function encryptPassword(plainPassword: string) {
    const salt = await bcrypt.genSalt()
    return await bcrypt.hash(plainPassword, salt)
}

export async function comparetPassword(plainPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainPassword, hashedPassword)
}