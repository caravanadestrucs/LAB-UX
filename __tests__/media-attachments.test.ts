// Media-attachment audit tests (HU15).
// User hypothesis: "NO hay base64 en DB. Todo es VARCHAR path + FormData."
// These tests lock that contract in for every write path that ships files:
// usuarios, proyectos, eventos/noticias, contenido, guias MUST send
// multipart FormData (never JSON/base64). metodologiaPrueba still sends
// JSON with a bare filename -> documented as an expected failure below.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { addUser, updateUser } from "@/services/usuarioService";
import { createProyecto, updateProyecto } from "@/services/proyecto";
import { addEventoNoticia, updateEventoNoticia } from "@/services/eventoNoticia";
import { addContenido, updateContenido } from "@/services/contenido";
import { createGuia, updateGuia } from "@/services/guias";
import { addMetodologiaPrueba, updateMetodologiaPrueba } from "@/services/metodologiaPrueba";
import { addRecursoToGuia } from "@/services/guias";

const mockFetch = vi.fn();

beforeEach(() => {
  mockFetch.mockReset();
  mockFetch.mockResolvedValue({ ok: true, json: async () => ({}) } as Response);
  vi.stubGlobal("fetch", mockFetch);
  vi.stubGlobal("localStorage", {
    getItem: () => "dummy-token",
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
  } as unknown as Storage);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function lastCall() {
  const [url, init] = mockFetch.mock.calls.at(-1) as [string, RequestInit];
  return { url, init };
}

function expectMultipartFormData(init: RequestInit) {
  expect(init.body).toBeInstanceOf(FormData);
  // A JSON content-type on a file upload is the base64-in-JSON smell.
  const contentType =
    (init.headers as Record<string, string> | undefined)?.["Content-Type"] ?? "";
  expect(contentType).not.toMatch(/application\/json/);
}

function expectNoBase64Payload(init: RequestInit) {
  const serialized =
    typeof init.body === "string" ? init.body : JSON.stringify(init.body ?? "");
  expect(serialized).not.toContain("data:image/");
  expect(serialized).not.toContain("data:video/");
  expect(serialized).not.toContain(";base64,");
}

describe("write paths use FormData, never JSON/base64 (HU15)", () => {
  it("addUser sends FormData (foto path, not base64)", async () => {
    const fd = new FormData();
    fd.append("foto", new Blob(["x"]), "avatar.png");
    await addUser(fd);
    const { init } = lastCall();
    expectMultipartFormData(init);
    expectNoBase64Payload(init);
  });

  it("updateUser sends FormData", async () => {
    const fd = new FormData();
    fd.append("foto", new Blob(["x"]), "avatar.png");
    await updateUser(1, fd);
    const { init } = lastCall();
    expectMultipartFormData(init);
    expectNoBase64Payload(init);
  });

  it("createProyecto sends FormData (imagen path, not base64)", async () => {
    const fd = new FormData();
    fd.append("imagen", new Blob(["x"]), "cover.png");
    await createProyecto(fd);
    const { init } = lastCall();
    expectMultipartFormData(init);
    expectNoBase64Payload(init);
  });

  it("updateProyecto sends FormData", async () => {
    const fd = new FormData();
    fd.append("titulo", "Nuevo titulo");
    await updateProyecto(1, fd);
    const { init } = lastCall();
    expectMultipartFormData(init);
    expectNoBase64Payload(init);
  });

  it("addEventoNoticia sends FormData (imagen/material path, not base64)", async () => {
    const fd = new FormData();
    fd.append("imagen", new Blob(["x"]), "evento.png");
    await addEventoNoticia(fd);
    const { init } = lastCall();
    expectMultipartFormData(init);
    expectNoBase64Payload(init);
  });

  it("updateEventoNoticia sends FormData", async () => {
    const fd = new FormData();
    fd.append("titulo", "Nuevo titulo");
    await updateEventoNoticia(1, fd);
    const { init } = lastCall();
    expectMultipartFormData(init);
    expectNoBase64Payload(init);
  });

  it("addContenido sends FormData (imagen path, not base64)", async () => {
    await addContenido(
      { titulo: "Mision", texto: "Texto", tipo: "mision" } as never,
      new File(["x"], "mision.png"),
    );
    const { init } = lastCall();
    expectMultipartFormData(init);
    expectNoBase64Payload(init);
  });

  it("updateContenido sends FormData", async () => {
    await updateContenido(1, { titulo: "Mision" } as never);
    const { init } = lastCall();
    expectMultipartFormData(init);
    expectNoBase64Payload(init);
  });

  it("createGuia sends FormData (imagen path, not base64)", async () => {
    const fd = new FormData();
    fd.append("imagen", new Blob(["x"]), "guia.png");
    await createGuia(fd);
    const { init } = lastCall();
    expectMultipartFormData(init);
    expectNoBase64Payload(init);
  });

  it("updateGuia sends FormData", async () => {
    const fd = new FormData();
    fd.append("titulo", "Guia");
    await updateGuia(1, fd);
    const { init } = lastCall();
    expectMultipartFormData(init);
    expectNoBase64Payload(init);
  });
});

// ---------------------------------------------------------------------------
// Known broken paths — expected failures, NOT to be "fixed" by editing tests.
// HU15: migrate these to FormData + VARCHAR path like the rest.
// ---------------------------------------------------------------------------
describe("known JSON-instead-of-FormData gaps (HU15)", () => {
  // PR12 migrado a FormData — ahora debe pasar.
  it(
    "addMetodologiaPrueba sends FormData (today: JSON with bare filename)",
    async () => {
      await addMetodologiaPrueba({ nombre: "Test UX" } as never);
      const { init } = lastCall();
      expectMultipartFormData(init);
    },
  );

  // PR12 migrado a FormData — ahora debe pasar.
  it(
    "updateMetodologiaPrueba sends FormData (today: JSON with bare filename)",
    async () => {
      await updateMetodologiaPrueba(1, { nombre: "Test UX" } as never);
      const { init } = lastCall();
      expectMultipartFormData(init);
    },
  );

  // PR12 migrado a FormData — ahora debe pasar.
  it(
    "addRecursoToGuia sends FormData for file resources (today: JSON)",
    async () => {
      await addRecursoToGuia(1, { recurso: "manual.pdf" } as never);
      const { init } = lastCall();
      expectMultipartFormData(init);
    },
  );
});

describe("/uploads prefix consistency (HU15)", () => {
  it("avatar URL builders share the same /uploads prefix", async () => {
    const { ENDPOINTS } = await import("@/config/endpoints");
    const file = "avatar-1.png";
    expect(ENDPOINTS.USUARIOS.AVATAR(file)).toBe(ENDPOINTS.USUARIOS.AVATAR2(file));
    expect(ENDPOINTS.USUARIOS.AVATAR(file)).toContain("/uploads/");
  });

  it.todo(
    "normalize divergent /uploads prefixes in page templates " +
      "(misionVision valores icons use bare /uploads/valores/, " +
      "EventoViews materiales link omits API_URL) — HU15",
  );
});
