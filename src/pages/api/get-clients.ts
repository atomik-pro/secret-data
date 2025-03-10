import { NextApiRequest, NextApiResponse } from 'next';
import { getClient } from '@/lib/googleSheets';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {

    const sheetClients = await getClient();
    res.status(200).json(sheetClients);
  } catch(error) {
    console.error('Error en el fetching de datos desde Google Sheets:', error);
    res.status(500).json({ error: 'Fallo en el fetch de datos' });

  }
}


