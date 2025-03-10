import { NextApiRequest, NextApiResponse } from 'next';
import { getId } from '@/lib/googleSheets';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {

    const sheetData = await getId();
    res.status(200).json(sheetData);
  } catch(error) {
    console.error('Error en el fetching de datos desde Google Sheets:', error);
    res.status(500).json({ error: 'Fallo en el fetch de datos' });

  }
}


