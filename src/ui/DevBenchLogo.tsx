import type { FC, SVGProps } from 'react';

/**
 * DevBench 品牌 logo。
 * 图形：输入面板（实线）→ 转换输出（虚线行 + 实线行），抽象表达"输入→处理→结果"。
 * 主色 #426A91（--color-primary），圆角与 DESIGN.md 品牌方向一致。
 */
export const DevBenchLogo: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    role="img"
    {...props}
  >
    <rect width="512" height="512" rx="104" fill="#426A91" />
    <g fill="none" stroke="#FFFFFF" strokeLinecap="round">
      <rect x="118" y="156" width="122" height="200" rx="16" strokeWidth="22" />
      <line x1="304" y1="172" x2="394" y2="172" strokeWidth="22" />
      <line x1="304" y1="256" x2="394" y2="256" strokeWidth="22" strokeDasharray="44 24" />
      <line x1="304" y1="340" x2="394" y2="340" strokeWidth="22" />
    </g>
  </svg>
);
