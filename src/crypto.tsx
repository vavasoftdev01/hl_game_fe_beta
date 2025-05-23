import { EncryptJWT, jwtDecrypt } from 'jose';

class Crypto {
    private static readonly secret_key = new TextEncoder().encode(
        process.env.RT_KEY ? process.env.RT_KEY : "4kxrs1P3gbc99274NzR6BYBXAhlXsXYb"
    );

    public static encrypt = async (data) => {
        const encrypted = await new EncryptJWT({ data })
            .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
            .setIssuedAt()
            .setExpirationTime('1m') // Set expiration time (optional)
            .encrypt(this.secret_key); // Now 'this' refers to the class, so it works

        return encrypted;
    }

    public static decrypt = async (data) => {
        return data;
    }
}

export default Crypto;