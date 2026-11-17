import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ToolPageLayout } from "@/components/layout/ToolPageLayout";
import { ToolActionBar } from "@/components/editor/ToolActionBar";
import { TextareaInput } from "@/components/editor/TextareaInput";
import { decodeJwt, CLAIM_DESCRIPTIONS } from "./core";

export function JwtDecoder() {
  const { t, i18n } = useTranslation();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ReturnType<typeof decodeJwt> | null>(null);
  const isZh = i18n.language === "zh-CN";

  const handleDecode = () => {
    setResult(decodeJwt(input));
  };

  return (
    <ToolPageLayout
      title={t("tools.jwt-decoder.name")}
      description={t("tools.jwt-decoder.description")}
      category={t("nav.category.http")}
    >
      <div className="space-y-4">
        <div className="rounded-md border border-warning bg-warning/10 p-2 text-sm text-warning">
          {t("tools.jwt-decoder.securityWarning")}
        </div>

        <TextareaInput value={input} onChange={setInput} placeholder="eyJhbGci..." rows={3} />

        <ToolActionBar primaryLabel={t("tools.jwt-decoder.decode")} onPrimary={handleDecode} primaryDisabled={!input} />

        {result && result.errors.length > 0 && (
          <div role="alert" className="space-y-1">
            {result.errors.map((err, i) => (
              <div key={i} className="rounded-md border border-error bg-error/10 p-2 text-sm text-error">{err}</div>
            ))}
          </div>
        )}

        {result && result.expired && (
          <div role="alert" className="rounded-md border border-warning bg-warning/10 p-2 text-sm text-warning">
            {t("tools.jwt-decoder.expExpired")}
          </div>
        )}

        {result && result.header && (
          <div>
            <h3 className="text-sm font-medium text-text-secondary">{t("tools.jwt-decoder.header")}</h3>
            <pre className="mt-1 rounded-md bg-surface-muted p-3 font-mono text-sm text-text">
              {JSON.stringify(result.header, null, 2)}
            </pre>
          </div>
        )}

        {result && result.payload && (
          <div>
            <h3 className="text-sm font-medium text-text-secondary">{t("tools.jwt-decoder.payload")}</h3>
            <pre className="mt-1 rounded-md bg-surface-muted p-3 font-mono text-sm text-text">
              {JSON.stringify(result.payload, null, 2)}
            </pre>
            {Object.keys(result.payload).filter(
              (k) => k in CLAIM_DESCRIPTIONS && result.payload![k] !== undefined
            ).length > 0 && (
              <div className="mt-2 space-y-1">
                {Object.entries(result.payload)
                  .filter(([k]) => k in CLAIM_DESCRIPTIONS)
                  .map(([k, v]) => (
                    <div key={k} className="text-sm text-text-secondary">
                      <span className="font-mono text-text">{k}</span>: {String(v)}{" "}
                      <span className="text-text-muted">
                        — {isZh ? CLAIM_DESCRIPTIONS[k].zh : CLAIM_DESCRIPTIONS[k].en}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
