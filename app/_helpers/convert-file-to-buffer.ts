export async function convertFileToBuffer(file: File) {
  // Convert file to stream
  const stream = file.stream();

  // Convert stream to buffer
  const chunks = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for await (const chunk of stream as any) {
    chunks.push(chunk);
  }

  const buffer = Buffer.concat(chunks);

  return buffer;
}
