import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: import.meta.env.VITE_PINATA_JWT,
});

export interface CardMetadata {
  name: string;
  description: string;
  image: string;
  attributes: { trait_type: string; value: string | number }[];
}

export async function uploadImageToIPFS(file: File): Promise<string> {
  const upload = await pinata.upload.public.file(file);
  return upload.cid;
}

export async function uploadMetadataToIPFS(metadata: CardMetadata): Promise<string> {
  const upload = await pinata.upload.public.json(metadata);
  return upload.cid;
}