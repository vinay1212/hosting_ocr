import vision from '@google-cloud/vision';
import sharp from 'sharp';
import fs from 'fs';
import extraction from './extraction.js';
// import config from 'dotenv';

const CREDENTIALS = {
  "type": "service_account",
  "project_id": "zippy-sublime-409205",
  "private_key_id": "cf757d55bb886c1bd300160e3890c94f4c3800f9",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCO4Am+ETRdG4e8\nRagIflNE+oo1ehEMiEvcZMWJyNg+VeT0gwN44AbAtZUULjQv3eFMcCfGaxWYJkCj\nRjCPlPSD+zlFKmyonlGV6UCjPn9lxQLELIfyF3NesALr41NWslkHKSyiIetUlc2E\nUR7ebfhviUQ+EaEQco0telgsE4eH2J2WGRLtwR3EUc9oIPBrN9tlKXE9ryCTkPCJ\ni5KZWVRo6dYRE1Zwn6cKW6gdLMwAQODamjtr0vSJRlTgktL0r+7z5ViC8z44ZXs3\nWA9ixLrvbAsl5OYvQeaQaPndWw9C8cqsSnYxlHUccvwRy2uwtS0aqAmWOH/fSG5d\nLx9Lpz3PAgMBAAECggEAJ7HXAxeElNmxPH2d0b5HJEL3YyQm2HSFnxXgTAehDLCQ\ni95aeJrFRYUthg3QMfxTPAltA5N8zGjUTIiTtVCNHp4Nq0m+JprVz/CeJLyYaI3z\n1s0IeBpL02LTbPYbkVq7oWGvJNyHpVh5YOmoyeODwnlAnH4JYahx0NDM7nH+lZ8O\nvvmsDBsmSdJyXrD76yXEhh11TXiIZ27bDbedJvT0igwEhjzKDJrBAzhKajyGBShk\nwkT7r3SFPBco0ThZsnqAfnC4su5ITnbGs8sYnztSpGRz60lQ9K7A+Lz6g8SzCPKp\ndeeOBzL0kx3bRgHXxrJN+oBG9q58wZ7eIfIVORhhAQKBgQDJgvneoAncGxgdaVAQ\n4H7pPrK0oPze22dEnexodF9SiKGNhqpNXOnXoMkCTwgs2KWIf4SyRYpxZ5mHvm8s\nJeSxrzhHMi0XRqp8zOqFqjL0GmGiMQftegfNKmzh69Z4O7PQsM2TR2epzY8ZZ6mz\nh1diCIaQgTtuao/GZFFV/+jBIwKBgQC1giG/sfHvtQZ1d1hfXw6opcLWGnoo+YXe\nW9ZZ2u+5AR48lhbsJon6Lrp/hvWaLppOTsytwUZr89WsnzLLjF9xjqtkf3d8Bf1I\ngKxZ4pSsvcU7S0kA1Z/swHImVIJ4Pg0gjeuCbRXod5Ky62jWL4X+oXPJSyBWhBRx\nEkiKJqj5ZQKBgHg7pNj3RkrFA8NwtawMNsz2cuwhbh+Oa3RegdLlNIbrLPFjmzNj\nr8bPkX/GJguUDFiANW2k3nDBrrJ2pqCBz41RDdQ1FQBhUpH6NiggoBxTrVN3y9Ie\n0I7StHqsG6BLhwOKqm4o2apQEwTGfFO4+iNtENUhtpMwE6785ibY9UhfAoGAIAby\nRYz0j8N1fEyuv0VapM967aSGYayFvpKd5AUJv68+0pn5OXojZo3QQqhhte77M04c\nN5ye/HVuAqOkpt4CCVuPSpBjWPMFmkF6J/IfIcvqfWfvXcJUEcZzXegTjXwFfPUN\n1VnCP965d/Cp8wE3t5Jth9tFvX5YzQrY2eewcTECgYBnk47D6eDN9pM0Xl+eTIVU\n62YZ3dN98wxNkZEM54/fGFt95eLVUmjrMI8ppZYeB5wLCulFwABL/ZirGATloTXp\nh4hXxOR5VG6WrhNMWh8z+xYX4pAiiQmnCSl8m8uuysMTGt7odWFWeUHVj5ks32VP\nKG/cwqhRkhXoqjFjrTNm1Q==\n-----END PRIVATE KEY-----\n",
  "client_email": "vision@zippy-sublime-409205.iam.gserviceaccount.com",
  "client_id": "113790667767984674895",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/vision%40zippy-sublime-409205.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
;

const CONFIG = {
    credentials: {
        private_key: CREDENTIALS.private_key,
        client_email: CREDENTIALS.client_email,
    }
};

const client = new vision.ImageAnnotatorClient(CONFIG);

const detectText = async (file_path, output) => {
    // Load the image using sharp
    const imageBuffer = await sharp(file_path)
    // Resize the image (optional, adjust as needed)
    .resize({ width: 800 })
    .gamma(1.2)
    // Convert the image to grayscale (optional, may improve text extraction)
    .grayscale() 
    // Sharpen the image
    .sharpen({ sigma: 1, flat: 1, jagged: 0.1 })
    // Apply other preprocessing steps as needed
    .toBuffer();

    console.log("sharpening")

    let [result] = await client.textDetection(file_path);
    console.log(result.fullTextAnnotation.text);

    console.log("annotations done");

    fs.writeFileSync('output.txt', result.fullTextAnnotation.text);

    console.log("writing on output.txt");

    const out = await extraction(result.fullTextAnnotation.text);

    console.log(out);

    return out;

};

export default detectText;