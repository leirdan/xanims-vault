"use server";

import { strapi, StrapiValidationError } from "@strapi/client"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH, HOMEPAGE, CATS, FACTORS } from "./constants";

const client = strapi({ baseURL: "http://localhost:1337/api" }); // TODO: mover para um .env próprio

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
        console.log("data: ", data);

        const store = await cookies();
        store.set("token", data.jwt); // TODO: setar um tempo de expiração?
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
        const response = await client.fetch(CATS, {
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
        const body = {
            name: formData.get("name"),
            birth_date: formData.get("birth_date"),
            weight: parseFloat(formData.get("weight") as string),
            neutered: formData.get("neutered") === "true" ? 1 : 0,
            nfc: null,
            user_id: auth.userId,
            life_stage_factor_id: parseInt(formData.get("life_stage_factor_id") as string),
        };

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
        return { success: false, message: error.message || "Erro inesperado." };
    }
}

async function getAuth(): Promise<{ jwt: string, userId: number }> {
    const store = await cookies();
    let jwt: string = "", userId: number = -1;
    if (store.get("token")) jwt = store.get("token")?.value || ""
    if (store.get("userId")) userId = Number.parseInt(store.get("userId")?.value ?? "-1")

    return { jwt, userId }
}
