"use client";

import { useState } from "react";

type Form = {
  name: string;
  email: string;
  phone: string;
  dobConfirmed: boolean;
  ageRange: string;   // 👈 NOVO
  wantsPhysicalInvites: boolean;
  cep: string;
  socialNetwork: string;
  socialHandle: string;
  preferences: string[];
  freq: string;
  consentBasic: boolean;
  consentPersonalization: boolean;
  consentStats: boolean;
  consentPartners: boolean;
};

export default function Page() {
  const [step, setStep] = useState(1);
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState("");

const [form, setForm] = useState<Form>({
  name: "",
  email: "",
  phone: "",
  dobConfirmed: false,
  ageRange: "",            // 👈 NOVO
  wantsPhysicalInvites: false,
  cep: "",
  socialNetwork: "",
  socialHandle: "",
  preferences: [],
  freq: "",
  consentBasic: false,
  consentPersonalization: false,
  consentStats: false,
  consentPartners: false,
});

  function update(values: Partial<Form>) {
    setForm((p) => ({ ...p, ...values }));
  }

  const togglePref = (p: string) => {
    update({
      preferences: form.preferences.includes(p)
        ? form.preferences.filter((x) => x !== p)
        : [...form.preferences, p],
    });
  };

  async function submit() {
    setSending(true);
    setMsg("");

    try {
      const r = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (r.ok) setMsg("Enviado com sucesso! 🎉");
      else setMsg("Erro ao enviar.");
    } catch {
      setMsg("Erro ao enviar.");
    } finally {
      setSending(false);
    }
  }

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const requiredError =
    !form.email ||
    !form.phone ||
    !form.dobConfirmed ||
    (form.wantsPhysicalInvites && !form.cep) ||
    !form.consentBasic;

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          Formulário de Cadastro Comercial
        </h1>

        {/* Card */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          {/* Progress */}
          <div className="w-full bg-gray-200 rounded h-2 mb-6">
            <div
              className="bg-blue-700 h-2 rounded"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                Este formulário é destinado a maiores de 18 anos.
              </p>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-blue-700"
                  checked={form.dobConfirmed}
                  onChange={(e) => update({ dobConfirmed: e.target.checked })}
                />
                Confirmo que tenho 18 anos ou mais *
              </label>

              <div>
                <label className="font-medium block mb-1">
                  Faixa etária *
                </label>

                <select
                  className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  value={form.ageRange}
                  onChange={(e) => update({ ageRange: e.target.value })}
                  disabled={!form.dobConfirmed}
                >
                  <option value="">Selecione</option>
                  <option value="18-24">18–24</option>
                  <option value="25-34">25–34</option>
                  <option value="35-44">35–44</option>
                  <option value="45-54">45–54</option>
                  <option value="55+">55+</option>
                </select>
              </div>


              <div>
                <label className="font-medium block mb-1">
                  Nome completo (opcional)
                </label>
                <input
                  className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  value={form.name}
                  onChange={(e) => update({ name: e.target.value })}
                />
              </div>

              <div className="flex justify-end">
                <button
                  disabled={!form.dobConfirmed || !form.ageRange}
                  onClick={next}
                  className="bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50">
                  Próximo
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="font-medium block mb-1">
                  E-mail *
                </label>
                <input
                  type="email"
                  required
                  className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  value={form.email}
                  onChange={(e) => update({ email: e.target.value })}
                />
              </div>

              <div>
                <label className="font-medium block mb-1">
                  Telefone (WhatsApp) *
                </label>
                <input
                  required
                  className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  value={form.phone}
                  onChange={(e) => update({ phone: e.target.value })}
                  placeholder="11999999999"
                  inputMode="tel"
                />
              </div>

              <div className="flex justify-between">
                <button onClick={back} className="px-4 py-2 border rounded">
                  Voltar
                </button>
                <button
                  disabled={!form.email || !form.phone}
                  onClick={next}
                  className="bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  Próximo
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="font-medium block mb-2">
                  Você deseja receber convites físicos?
                </label>
                <label className="flex gap-2">
                  <input
                    type="checkbox"
                    className="accent-blue-700"
                    checked={form.wantsPhysicalInvites}
                    onChange={(e) =>
                      update({ wantsPhysicalInvites: e.target.checked })
                    }
                  />
                  Sim
                </label>
              </div>

              {form.wantsPhysicalInvites && (
                <div>
                  <label className="font-medium block mb-1">
                    CEP (obrigatório neste caso)
                  </label>
                  <input
                    className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
                    value={form.cep}
                    onChange={(e) => update({ cep: e.target.value })}
                    placeholder="00000-000"
                    inputMode="numeric"
                  />
                </div>
              )}

              <div>
                <label className="font-medium block mb-1">
                  Rede social preferida (opcional)
                </label>
                <select
                  className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  value={form.socialNetwork}
                  onChange={(e) => update({ socialNetwork: e.target.value })}
                >
                  <option value="">Selecione</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="tiktok">TikTok</option>
                  <option value="twitter">Twitter/X</option>
                </select>
              </div>

              <div>
                <label className="font-medium block mb-1">
                  @perfil (opcional)
                </label>
                <input
                  className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  value={form.socialHandle}
                  onChange={(e) => update({ socialHandle: e.target.value })}
                />
              </div>

              <div>
                <label className="font-medium block mb-1">
                  O que deseja receber?
                </label>

                {["Eventos", "Cursos", "Promoções", "Notícias"].map((p) => (
                  <label key={p} className="block">
                    <input
                      type="checkbox"
                      className="accent-blue-700"
                      checked={form.preferences.includes(p)}
                      onChange={() => togglePref(p)}
                    />{" "}
                    {p}
                  </label>
                ))}
              </div>

              <div>
                <label className="font-medium block mb-1">
                  Frequência desejada
                </label>
                <select
                  className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  value={form.freq}
                  onChange={(e) => update({ freq: e.target.value })}
                >
                  <option value="">Selecione</option>
                  <option value="Diária">Diária</option>
                  <option value="Semanal">Semanal</option>
                  <option value="Mensal">Mensal</option>
                </select>
              </div>

              <div className="flex justify-between">
                <button onClick={back} className="px-4 py-2 border rounded">
                  Voltar
                </button>
                <button onClick={next} className="bg-blue-700 text-white px-4 py-2 rounded">
                  Próximo
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-800">
                Selecione abaixo como seus dados poderão ser usados.
              </p>

              <label className="block">
                <input
                  type="checkbox"
                  className="accent-blue-700"
                  checked={form.consentBasic}
                  onChange={(e) =>
                    update({ consentBasic: e.target.checked })
                  }
                />{" "}
                Autorizo contato por e-mail/telefone *
              </label>

              <label className="block">
                <input
                  type="checkbox"
                  className="accent-blue-700"
                  checked={form.consentPersonalization}
                  onChange={(e) =>
                    update({ consentPersonalization: e.target.checked })
                  }
                />{" "}
                Autorizo personalização de conteúdo
              </label>

              <label className="block">
                <input
                  type="checkbox"
                  className="accent-blue-700"
                  checked={form.consentStats}
                  onChange={(e) =>
                    update({ consentStats: e.target.checked })
                  }
                />{" "}
                Autorizo uso estatístico (anônimo)
              </label>

              <label className="block">
                <input
                  type="checkbox"
                  className="accent-blue-700"
                  checked={form.consentPartners}
                  onChange={(e) =>
                    update({ consentPartners: e.target.checked })
                  }
                />{" "}
                Autorizo envio por parceiros
              </label>

              {requiredError && (
                <p className="text-red-700 font-medium bg-red-100 border border-red-300 p-2 rounded">
                  Para continuar, preencha os campos obrigatórios.
                </p>
              )}

              <div className="flex justify-between">
                <button onClick={back} className="px-4 py-2 border rounded">
                  Voltar
                </button>
                <button
                  disabled={requiredError || sending}
                  onClick={submit}
                  className="bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {sending ? "Enviando..." : "Enviar"}
                </button>
              </div>

              {msg && (
                <p className="text-center font-medium text-gray-800">
                  {msg}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
