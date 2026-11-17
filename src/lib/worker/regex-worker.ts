interface RegexWorkerInput {
  pattern: string;
  flags: string;
  text: string;
}

export interface RegexWorkerOutput {
  matches: {
    text: string;
    index: number;
    groups: string[];
    namedGroups: Record<string, string>;
  }[];
  count: number;
  truncated: boolean;
  error?: string;
}

const MAX_MATCHES = 10000;

export function regexWorkerHandler(data: RegexWorkerInput): RegexWorkerOutput {
  try {
    const regex = new RegExp(data.pattern, data.flags);
    const allMatches: RegexWorkerOutput["matches"] = [];
    let truncated = false;

    if (data.flags.includes("g")) {
      let m: RegExpExecArray | null;
      while ((m = regex.exec(data.text)) !== null) {
        if (allMatches.length >= MAX_MATCHES) {
          truncated = true;
          break;
        }
        const namedGroups: Record<string, string> = {};
        if (m.groups) {
          for (const key of Object.keys(m.groups)) {
            namedGroups[key] = m.groups[key] ?? "";
          }
        }
        allMatches.push({
          text: m[0],
          index: m.index,
          groups: m.slice(1),
          namedGroups,
        });
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }
      }
    } else {
      const m = data.text.match(regex);
      if (m) {
        const namedGroups: Record<string, string> = {};
        if (m.groups) {
          for (const key of Object.keys(m.groups)) {
            namedGroups[key] = m.groups[key] ?? "";
          }
        }
        allMatches.push({
          text: m[0],
          index: m.index ?? 0,
          groups: m.slice(1),
          namedGroups,
        });
      }
    }

    return { matches: allMatches, count: allMatches.length, truncated };
  } catch (e) {
    return {
      matches: [],
      count: 0,
      truncated: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}
