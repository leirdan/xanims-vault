interface Cat {
    id: number;
    documentId: string;
    name: string;
    birth_date: string;
    weight: number;
    neutered: boolean;
    nfc?: string;
}

interface LifeStageFactor {
    id: number;
    documentId: string;
    description: string;
    factor: number;
}