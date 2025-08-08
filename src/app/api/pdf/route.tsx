import { allPrivateFields } from '@content';
import { renderToBuffer } from '@react-pdf/renderer';
import { NextResponse } from 'next/server';
import PDF from 'src/components/pdf/pdf';
import fs from 'fs';
import path from 'path';
const privateKey = process.env.PRIVATE_KEY;

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  let privateInformation;
  if (secret !== null) {
    if (secret !== privateKey) {
      return new NextResponse('Not authorized', { status: 401 });
    }
    privateInformation = allPrivateFields;
  }

  const pdfStream = await renderToBuffer(
    <PDF privateInformation={privateInformation} />,
  );
  const filePath = path.join(process.cwd(), 'src', 'public', `resume.pdf`);
  const pdfBuffer = fs.readFileSync(filePath);

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
    },
  });
}
