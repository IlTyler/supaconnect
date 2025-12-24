import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Inicializa Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      dobConfirmed,
      ageRange,
      wantsPhysicalInvites,
      cep,
      preferences,
      freq,
      socialNetwork,
      socialHandle,
      consentBasic,
      consentPersonalization,
      consentStats,
      consentPartners,
    } = body;

    // --- VALIDAÇÕES ---
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Nome, e-mail e telefone são obrigatórios." },
        { status: 400 }
      );
    }

    if (!dobConfirmed) {
      return NextResponse.json(
        { error: "É necessário confirmar que você tem 18+." },
        { status: 400 }
      );
    }

    if (!ageRange) {
      return NextResponse.json(
        { error: "Faixa etária é obrigatória." },
        { status: 400 }
      );
    }

    if (wantsPhysicalInvites && (!cep || cep.length < 8)) {
      return NextResponse.json(
        { error: "CEP é obrigatório para receber convites físicos." },
        { status: 400 }
      );
    }

    if (!consentBasic) {
      return NextResponse.json(
        { error: "Você precisa autorizar o uso básico dos dados." },
        { status: 400 }
      );
    }

    // --- INSERIR NO SUPABASE ---
    const { error } = await supabase.from("submissions").insert([
      {
        name,
        email,
        phone,
        dob_confirmed: dobConfirmed,
        age_range: ageRange,              // 👈 Faixa etária
        wants_physical: wantsPhysicalInvites,
        cep,
        preferences,
        freq,
        social_network: socialNetwork,
        social_handle: socialHandle,
        consent_basic: consentBasic,
        consent_personalization: consentPersonalization,
        consent_stats: consentStats,
        consent_partners: consentPartners,
      },
    ]);

    if (error) {
      console.error("Erro ao salvar no Supabase:", error);
      return NextResponse.json(
        { error: "Erro ao salvar no banco." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { ok: true, message: "Cadastro recebido com sucesso!" },
      { status: 200 }
    );
  } catch (e) {
    console.error("Erro no servidor:", e);
    return NextResponse.json(
      { error: "Payload inválido ou erro no servidor." },
      { status: 400 }
    );
  }
}
