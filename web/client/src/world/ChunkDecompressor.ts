const CHUNK_SIZE = 16;
const BYTES_PER_BLOCK = 4;
const EXPECTED_CHUNK_SIZE = CHUNK_SIZE * CHUNK_SIZE * CHUNK_SIZE * BYTES_PER_BLOCK;

export class ChunkDecompressor {
    static async decompress(data: Uint8Array): Promise<Uint8Array> {
        if (data.length === EXPECTED_CHUNK_SIZE) {
            return data;
        }

        if (data.length > 1 && data[0] === 0x01) {
            try {
                const compressedData = data.slice(1);
                const blob = new Blob([compressedData]);
                const ds = new DecompressionStream('gzip');
                const decompressedStream = blob.stream().pipeThrough(ds);
                const reader = decompressedStream.getReader();
                const chunks: Uint8Array[] = [];
                let totalLength = 0;

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    chunks.push(value);
                    totalLength += value.length;
                }

                const result = new Uint8Array(totalLength);
                let offset = 0;
                for (const chunk of chunks) {
                    result.set(chunk, offset);
                    offset += chunk.length;
                }
                return result;
            } catch {
                return data;
            }
        }

        return data;
    }
}
