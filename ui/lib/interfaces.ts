interface LifeStageFactor {
    id: number;
    documentId: string;
    description: string;
    factor: number;
}

interface Ration {
    id: number;
    documentId: string;
    description: string;
    brand?: string;
    kcal_per_gram: number;
    category?: string;
}

interface Cat {
    id: number;
    documentId: string;
    name: string;
    birth_date: string;
    weight: number;
    neutered: boolean;
    nfc?: string;
    life_stage_factor?: LifeStageFactor;
}

interface Diet {
    id: number;
    documentId: string;
    portion: number;
    cat?: Cat;
    ration?: Ration;
}

interface DietSchedule {
    id: number;
    documentId: string;
    hour: string;
    diet?: Diet;
}

// Um gato com a dieta e os horários já resolvidos, montado no
// servidor a partir de Cat + Diet + DietSchedule (relações unidirecionais
// que não podem ser populadas diretamente a partir do gato).
interface CatDetails extends Cat {
    diet?: Diet;
    schedules: DietSchedule[];
}

interface ConsumptionType {
    id: number;
    documentId: string;
    description: string;
}

interface Consumption {
    id: number;
    documentId: string;
    amount: number;
    createdAt: string;
    cat?: Cat;
    diet_schedule?: DietSchedule;
    consumption_type?: ConsumptionType;
}

interface IntrusionAlert {
    id: number;
    documentId: string;
    date: string;
    intruder_nfc: string;
    cat?: Cat;
}
