import { SecretsManager } from "@aws-sdk/client-secrets-manager";

export async function getSecret(secretArn: string): Promise<string> {
  var client = new SecretsManager({ region: process.env.AWS_REGION });
  return new Promise((resolve, reject) => {
    client.getSecretValue({ SecretId: secretArn }, (err, data) => {
      if (err) {
        reject(err)
        return
      }
      if ('SecretString' in data!) {
        resolve(data.SecretString as string)
      } else {
        resolve(Buffer.from(data!.SecretBinary as any, 'base64').toString('ascii'))
      }
    })
  });
};

export function cleanSecret(secret: string): string {
  const split = secret.split(':')[1];
  return split.substring(1, split.length - 2);
}