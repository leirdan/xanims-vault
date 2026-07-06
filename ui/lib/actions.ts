"use server";

import { strapi, StrapiValidationError } from "@strapi/client"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH, HOMEPAGE, CATS, FACTORS, DIETS, DIET_SCHEDULES, CONSUMPTIONS, INTRUSION_ALERTS, catRegenerateDietPath } from "./constants";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "http://api:1337";

const client = strapi({
  baseURL: `${API_URL}/api`,
});

export async function SignIn(prevState: any, formData: FormData) {
    let success = false;
    try {
        const username = formData.get("user")
        const password = formData.get("password")

        const response = await client.fetch(AUTH, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier: username, password })
        })

        if (!response.ok) {
            throw new Error("Erro ao logar: " + await response.text());
        }
        const data = await response.json();

        console.log("================================");
        console.log("LOGIN RESPONSE");
        console.log(JSON.stringify(data, null, 2));
        console.log("================================");

        const store = await cookies();
        store.set("token", data.jwt); // TODO: setar um tempo de expiração?
        store.set("userDocumentId", data.user.documentId);
        store.set("userId", data.user.id);

        success = true;
    }
    catch (err: any) {
        console.error(err)
        return { success: false, message: "Login inválido." }
    }

    if (success)
        redirect(HOMEPAGE)
}

export async function GetCats(): Promise<Cat[]> {
    try {
        const auth = await getAuth();
        const response = await client.fetch(`${CATS}?populate=*&filters[user][documentId][$eq]=${auth.userDocumentId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.jwt}`
            },
        })
        if (!response.ok) {
            console.error("erro ao buscar os gato");
        }
        const data = await response.json();
        console.log(data)
        return data.data || []
    } catch (err: any) {
        if (err instanceof StrapiValidationError) {
            console.error("erro de validação: ", err)
        }
        return [];
    }
}

export async function GetLifeStageFactors(): Promise<LifeStageFactor[]> {
    try {
        const auth = await getAuth();
        const response = await client.fetch(FACTORS, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.jwt}`
            },
        })
        if (!response.ok) {
            console.error("erro ao buscar os fator");
        }
        const data = await response.json();
        return data.data || []
    } catch (err: any) {
        if (err instanceof StrapiValidationError) {
            console.error("erro de validação: ", err)
        }
        return [];
    }
}

export async function AddCat(prevState: any, formData: FormData) {
    try {
        const auth = await getAuth();
        const feedingHours = formData
            .getAll("feeding_hours")
            .map(String);

        const body = {
            name: formData.get("name"),
            birth_date: formData.get("birth_date"),
            weight: parseFloat(formData.get("weight") as string),
            neutered: formData.get("neutered") === "true",
            nfc: null,
            user: auth.userDocumentId,
            life_stage_factor: formData.get("life_stage_factor_id"),
            feeding_hours: feedingHours,
        };

        console.log("=== ADD CAT ===");
        console.log(body);
        const response = await client.fetch(CATS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.jwt}`
            },
            body: JSON.stringify({ data: body })
        })

        if (!response.ok) {
            throw new Error("Erro ao inserir dados do gato na API");
        }

        return { success: true, message: "Gato e dieta gerados com sucesso!" };
    } catch (error: any) {
        console.error(error)
        return { success: false, message: error.message || "Erro inesperado." };
    }
}

// Diet e DietSchedule são relações unidirecionais (só existem a partir da
// dieta/horário apontando pro gato), então não dá pra populá-las a partir
// do /cats. Por isso buscamos tudo e cruzamos no servidor.
export async function GetCatsWithDetails(): Promise<CatDetails[]> {
    try {
        const auth = await getAuth();
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.jwt}`
        };

        const [catsRes, dietsRes, schedulesRes] = await Promise.all([
            client.fetch(`${CATS}?populate=life_stage_factor&filters[user][documentId][$eq]=${auth.userDocumentId}`, { method: "GET", headers }),
            client.fetch(`${DIETS}?populate[0]=cat&populate[1]=ration`, { method: "GET", headers }),
            client.fetch(`${DIET_SCHEDULES}?populate=diet`, { method: "GET", headers }),
        ]);

        const cats: Cat[] = (await catsRes.json()).data || [];
        const diets: Diet[] = (await dietsRes.json()).data || [];
        const schedules: DietSchedule[] = (await schedulesRes.json()).data || [];

        return cats.map((cat) => {
            const diet = diets.find((d) => d.cat?.documentId === cat.documentId);
            const catSchedules = diet
                ? schedules
                    .filter((s) => s.diet?.documentId === diet.documentId)
                    .sort((a, b) => a.hour.localeCompare(b.hour))
                : [];
            return { ...cat, diet, schedules: catSchedules };
        });
    } catch (err: any) {
        console.error(err);
        return [];
    }
}

export async function GetCatByDocumentId(documentId: string): Promise<CatDetails | null> {
    const cats = await GetCatsWithDetails();
    return cats.find((c) => c.documentId === documentId) || null;
}

export async function UpdateCat(prevState: any, formData: FormData) {
    try {
        const auth = await getAuth();

        const documentId = formData.get("documentId") as string;

        const feedingHours = formData
            .getAll("feeding_hours")
            .map(String);

        const body = {
            name: formData.get("name"),
            birth_date: formData.get("birth_date"),
            weight: parseFloat(formData.get("weight") as string),
            neutered: formData.get("neutered") === "true",
            life_stage_factor: formData.get("life_stage_factor_id"),
            feeding_hours: feedingHours,
        };

        console.log("=== UPDATE CAT ===");
        console.log("Document ID:", documentId);
        console.log("Body:", body);

        const response = await client.fetch(`${CATS}/${documentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.jwt}`,
            },
            body: JSON.stringify({ data: body }),
        });

        const data = await response.json();

        console.log("Status:", response.status);
        console.log("Resposta:", data);

        if (!response.ok) {
            throw new Error(
                data?.error?.message ||
                data?.message ||
                JSON.stringify(data)
            );
        }

        return {
            success: true,
            message: "Gato atualizado com sucesso!",
        };
    } catch (error: any) {
        console.error("Erro ao atualizar gato:", error);

        return {
            success: false,
            message: error.message || "Erro inesperado.",
        };
    }
}

// Recalcula a dieta do gato (porção + horários) a partir dos dados atuais
// e, se ele já tiver NFC vinculado, o backend manda a dieta nova direto
// pro ESP via MQTT, sem precisar de uma nova leitura da tag.
export async function RegenerateDiet(documentId: string): Promise<{ success: boolean; message: string }> {
    try {
        const auth = await getAuth();
        const response = await client.fetch(catRegenerateDietPath(documentId), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.jwt}`
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.error?.message || "Erro ao regenerar dieta");
        }

        return { success: true, message: data.data?.message || "Dieta regenerada com sucesso!" };
    } catch (error: any) {
        console.error(error);
        return { success: false, message: error.message || "Erro inesperado." };
    }
}

export async function GetConsumptions(catDocumentId: string): Promise<Consumption[]> {
    try {
        const auth = await getAuth();
        const query = `${CONSUMPTIONS}?filters[cat][documentId][$eq]=${catDocumentId}&populate[0]=consumption_type&populate[1]=diet_schedule&sort=createdAt:asc`;
        const response = await client.fetch(query, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.jwt}`
            },
        });
        if (!response.ok) {
            console.error("erro ao buscar consumos");
            return [];
        }
        const data = await response.json();
        return data.data || [];
    } catch (err: any) {
        console.error(err);
        return [];
    }
}

export async function GetIntrusionAlerts(catDocumentId: string): Promise<IntrusionAlert[]> {
    try {
        const auth = await getAuth();
        const query = `${INTRUSION_ALERTS}?filters[cat][documentId][$eq]=${catDocumentId}&populate=cat&sort=date:desc`;
        const response = await client.fetch(query, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.jwt}`
            },
        });
        if (!response.ok) {
            console.error("erro ao buscar alertas de intrusão");
            return [];
        }
        const data = await response.json();
        return data.data || [];
    } catch (err: any) {
        console.error(err);
        return [];
    }
}

async function getAuth(): Promise<{ jwt: string, userDocumentId: string, userId: string }> {
    const store = await cookies();
    let jwt: string = "", userId: string = "", userDocumentId: string = ""
    if (store.get("token")) jwt = store.get("token")?.value || ""
    if (store.get("userId")) userId = store.get("userId")?.value || ""
    if (store.get("userDocumentId")) userDocumentId = store.get("userDocumentId")?.value || ""

    return { jwt, userDocumentId, userId }
}