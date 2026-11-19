import { useEffect, useRef } from "react";
import { EditorState, Compartment } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { json } from "@codemirror/lang-json";
import { javascript } from "@codemirror/lang-javascript";
import { basicSetup } from "codemirror";

interface CodeMirrorEditorImplProps {
  value: string;
  onChange: (value: string) => void;
  language?: "json" | "javascript";
  readOnly?: boolean;
  height?: number;
}

function readOnlyExtensions(readOnly: boolean) {
  return [EditorState.readOnly.of(readOnly), EditorView.editable.of(!readOnly)];
}

// 让编辑器撑满外层固定高度的容器，点击容器内任意位置都能聚焦编辑
const fillHeightTheme = EditorView.theme({
  "&": { height: "100%" },
});

export default function CodeMirrorEditorImpl({
  value,
  onChange,
  language,
  readOnly = false,
  height = 300,
}: CodeMirrorEditorImplProps) {
  const ref = useRef<HTMLDivElement>(null);
  const editorRef = useRef<EditorView | null>(null);
  const languageCompartment = useRef(new Compartment());
  const readOnlyCompartment = useRef(new Compartment());
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const lastDocRef = useRef(value);

  useEffect(() => {
    if (!ref.current) return;
    const languageExt = language === "json" ? json() : javascript();
    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        fillHeightTheme,
        languageCompartment.current.of(languageExt),
        readOnlyCompartment.current.of(readOnlyExtensions(readOnly)),
        EditorView.lineWrapping,
      ],
    });
    const view = new EditorView({
      state,
      parent: ref.current,
    });
    editorRef.current = view;

    const observer = new MutationObserver(() => {
      if (editorRef.current) {
        const currentDoc = editorRef.current.state.doc.toString();
        if (currentDoc !== lastDocRef.current) {
          lastDocRef.current = currentDoc;
          onChangeRef.current(currentDoc);
        }
      }
    });
    observer.observe(ref.current, { childList: true, subtree: true, characterData: true });

    return () => {
      observer.disconnect();
      view.destroy();
      editorRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (editorRef.current && language) {
      const languageExt = language === "json" ? json() : javascript();
      editorRef.current.dispatch({
        effects: languageCompartment.current.reconfigure(languageExt),
      });
    }
  }, [language]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.dispatch({
        effects: readOnlyCompartment.current.reconfigure(readOnlyExtensions(readOnly)),
      });
    }
  }, [readOnly]);

  useEffect(() => {
    if (editorRef.current) {
      const currentDoc = editorRef.current.state.doc.toString();
      if (currentDoc !== value) {
        lastDocRef.current = value;
        editorRef.current.dispatch({
          changes: { from: 0, to: currentDoc.length, insert: value },
        });
      }
    }
  }, [value]);

  return (
    <div
      ref={ref}
      style={{ height }}
      className="overflow-hidden rounded-md border border-border bg-surface-muted"
    />
  );
}
