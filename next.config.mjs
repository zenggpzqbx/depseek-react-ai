/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: [
        "antd",
        "@ant-design/icons",
        "@ant-design/icons-svg",
        "@rc-component/util",
        "rc-util",
        "rc-input",
        "rc-pagination",
        "rc-picker",
        "rc-field-form",
        "rc-dialog",
        "rc-collapse",
        "rc-motion",
        "rc-overflow",
        "rc-select",
        "rc-tabs",
        "rc-tree",
        "rc-resize-observer",
        "rc-virtual-list",
    ],
    experimental: {
        optimizePackageImports: ['antd'] // Next.js 15 新特性，优化导入
    }
};

export default nextConfig;
