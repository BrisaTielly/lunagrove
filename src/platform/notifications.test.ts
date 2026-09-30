import manifest from "../../manifest.config";
import { NOTIFICATION_ICON } from "./notifications";

const shipped = Object.keys(import.meta.glob("/public/icons/*.png")).map((path) => path.replace("/public/", ""));

describe("extension icons", () => {
  it("ships the icon completion notifications point to", () => {
    expect(shipped).toContain(NOTIFICATION_ICON);
  });

  it("ships every icon the manifest declares", async () => {
    const resolved = await (typeof manifest === "function" ? manifest({ command: "build", mode: "production" }) : manifest);
    const declared = [
      ...Object.values(resolved.icons ?? {}),
      ...Object.values((resolved.action?.default_icon ?? {}) as Record<string, string>),
    ];

    expect(declared.length).toBeGreaterThan(0);
    for (const icon of declared) expect(shipped, String(icon)).toContain(icon);
  });
});
