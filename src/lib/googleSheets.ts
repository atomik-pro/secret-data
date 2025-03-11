import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { Cliente, Data } from './types';


// Función para obtener las credenciales desde Secret Manager
async function getCredentials() {
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
        // Estamos en producción, usar las credenciales de la variable de entorno
        return JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    } else {
        // Estamos en desarrollo, usar Secret Manager
        const secretManagerClient = new SecretManagerServiceClient();
        try {
            const [version] = await secretManagerClient.accessSecretVersion({
                name: 'projects/369557868596/secrets/d10s-2-0/versions/latest',
            });

            const credentials = version.payload?.data?.toString();
            if (!credentials) {
                throw new Error('No se pudo obtener las credenciales del Secret Manager.');
            }

            return JSON.parse(credentials);
        } catch (error) {
            console.error('Error al acceder al Secret Manager:', error);
            throw error;
        }
    }
}

// Función para inicializar la autenticación con JWT
async function initializeServiceAccountAuth() {
    const credentials = await getCredentials();

    const { client_email, private_key } = credentials;
    if (!client_email || !private_key) {
        throw new Error('Credenciales inválidas: client_email o private_key no encontrados.');
    }

    const serviceAccountAuth = new JWT({
        email: client_email,
        key: private_key.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    return serviceAccountAuth;
}

// Función para obtener los ids de campaña
export async function getId(): Promise<Data[]> {

    const serviceAccountAuth = await initializeServiceAccountAuth();
    const doc = new GoogleSpreadsheet('1brW36BuFfrYxvxf4YYJYifB8XrQY0KYbIv7g08drJ5I', serviceAccountAuth);

    try {
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        const rows = await sheet.getRows<Data>();
        return rows.map((row: GoogleSpreadsheetRow<Data>) => ({
            id: row.get('id'),
            naming: row.get('naming'),
        }))

    } catch (error) {
        console.error('Error al obtener la información de la hoja de cálculo:', error);
        throw error;
    }
};

// Función para obtener los clientes
export async function getClient(): Promise<Cliente[]> {

    const serviceAccountAuth = await initializeServiceAccountAuth();
    const doc = new GoogleSpreadsheet('1ANi49PJq7EM8ux4buo9smr7gEjsZ7YwI0BcHXCag2N0', serviceAccountAuth);

    try {
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];
        const rows = await sheet.getRows<Cliente>();
        return rows.map((row: GoogleSpreadsheetRow<Cliente>) => ({
            Clientes: row.get('Clientes'),
        }))

    } catch (error) {
        console.error('Error al obtener la información de la hoja de cálculo:', error);
        throw error;
    }
};

export async function postRegisterData(
    id: string,
    cliente: string,
    ajuste: string,
    numeroMultiplicar: string,
    ajusteConsumo: string,
    observaciones: string,
    tipoAjuste: string,

): Promise<void> {
    const serviceAccountAuth = await initializeServiceAccountAuth();
    const doc = new GoogleSpreadsheet('11Db3XP8CgA5t0N59YYtohPTIGdpEHWqvZ1ylTo3-q90', serviceAccountAuth);

    const currentDate = new Date().toISOString().split('T')[0];

    try {
        await doc.loadInfo();
        const sheet = doc.sheetsByTitle['app'];

        // Verificar si la hoja existe
        if (!sheet) {
            throw new Error('No se encontró la hoja con el nombre especificado');
        }

        // Crear el objeto con los datos a insertar
        const newRowData = {
            fechaSolicitud: currentDate,
            identificadorCampana: id,
            cliente: cliente,
            ajuste: ajuste,
            numeroMultiplicar: numeroMultiplicar,
            ajusteConsumo: ajusteConsumo,
            observaciones: observaciones,
            tipoAjuste: tipoAjuste
        };

        // Añadir la nueva fila al final
        await sheet.addRow(newRowData);

    } catch (error) {
        console.error('Error al enviar los datos:', error);
        throw error;
    }
}