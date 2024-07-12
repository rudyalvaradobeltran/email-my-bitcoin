import axios from "axios";
import getSecret from "./secret-manager";
import { GetSecretValueCommandOutput } from "@aws-sdk/client-secrets-manager";

export default async function getByDir (dir: string) {
  const secret: GetSecretValueCommandOutput = await getSecret('baseurl');
  const baseURL: string | undefined = secret.SecretString;
  return axios.create({ baseURL }).get(dir);
}