import type { ComponentProps, FC } from 'react';
import type { LucideIcon } from 'lucide-react';
import { toolIcon } from './icon-map';

type SvgProps = ComponentProps<LucideIcon>;

interface ToolIconProps extends Omit<SvgProps, 'children'> {
  /** 注册中心 icon 字符串 */
  icon: string;
}

/** 工具图标渲染层：把注册中心的 icon 字符串映射为 Lucide 图标 */
export const ToolIcon: FC<ToolIconProps> = ({ icon, ...props }) => {
  const Comp = toolIcon(icon);
  return <Comp aria-hidden="true" {...props} />;
};
