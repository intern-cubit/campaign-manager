import crypto from "crypto"; 

export const generateWabombActivationKey = (systemId) => {
    const input = `${systemId}`.toUpperCase(); 

    const hash = crypto
        .createHash("sha256")
        .update(input)
        .digest("hex")
        .toUpperCase();

    const base36 = BigInt("0x" + hash)
        .toString(36)
        .toUpperCase();

    const rawKey = base36.padStart(16, "0").slice(0, 16);
    const formattedKey = rawKey.match(/.{1,4}/g).join("-");

    return formattedKey;
};
