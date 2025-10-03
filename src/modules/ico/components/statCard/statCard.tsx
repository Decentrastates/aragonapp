import { Card } from '@cddao/gov-ui-kit';

export interface IStatCardProps {
    /**
     * 标题
     */
    title: string;
    /**
     * 值
     */
    value: string | number;
    /**
     * 可选的描述信息
     */
    description?: string;
    /**
     * 自定义类名
     */
    className?: string;
}

/**
 * 统计信息卡片组件
 * 用于展示关键指标数据
 */
export const StatCard: React.FC<IStatCardProps> = (props) => {
    const { title, value, description, className = '', ...rest } = props;

    return (
        <Card className={`rounded-lg border border-gray-200 bg-white p-4 ${className}`} {...rest}>
            <h3 className="mb-1 text-sm font-medium text-gray-500">{title}</h3>
            <p className="text-lg font-semibold">{value}</p>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </Card>
    );
};