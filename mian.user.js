// ==UserScript==
// @name         哔哩哔哩专栏宽度修改
// @namespace    https://github.com/TC999/bili-opus-wide
// @version      1.1
// @description  修改哔哩哔哩专栏页面的宽度，支持像素和百分比设置
// @author       陈生杂物房
// @match        https://www.bilibili.com/opus/*
// @match        https://www.bilibili.com/read/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         https://www.bilibili.com/favicon.ico
// @license      GPL-3
// ==/UserScript==

(function() {
    'use strict';

    // 存储配置的键名
    const CONFIG_KEY = 'opusWidthConfig';

    // 获取当前配置
    function getConfig() {
        return GM_getValue(CONFIG_KEY, { width: '900px' });
    }

    // 保存配置
    function saveConfig(config) {
        GM_setValue(CONFIG_KEY, config);
    }

    // 确保值格式正确
    function ensureValidUnit(value) {
        const trimmed = value.trim();
        // 检查是否为纯数字
        if (/^\d+$/.test(trimmed)) {
            return `${trimmed}px`;
        }
        // 检查是否为百分比
        if (/^\d+%$/.test(trimmed)) {
            return trimmed;
        }
        // 检查是否为带px的数值
        if (/^\d+px$/.test(trimmed)) {
            return trimmed;
        }
        // 默认返回原值
        return trimmed;
    }

    // 修改宽度
    function modifyWidth(width) {
        const detailElement = document.querySelector('.opus-detail, .article-detail');
        if (detailElement) {
            detailElement.style.width = width;
        }

        // 处理侧边栏的margin-left
        const sidebar = document.querySelector('.right-sidebar-wrap, .right-side-bar');
        if (sidebar) {
            let marginLeft;

            // 检查是否为百分比宽度
            if (width.endsWith('%')) {
                // 提取百分比数值
                const percentage = parseFloat(width);
                if (!isNaN(percentage)) {
                    // 计算屏幕宽度的百分比 + 12px
                    const screenWidth = window.innerWidth;
                    marginLeft = `${(screenWidth * percentage / 100) + 12}px`;
                }
            } else {
                // 处理像素宽度
                const value = parseInt(width, 10);
                if (!isNaN(value)) {
                    marginLeft = `${value + 12}px`;
                }
            }

            if (marginLeft) {
                sidebar.style.marginLeft = marginLeft;
            }
        }
    }

    // 初始化
    function init() {
        const config = getConfig();
        modifyWidth(config.width);
    }

    // 注册菜单命令
    GM_registerMenuCommand('设置专栏宽度', () => {
        const config = getConfig();
        const newWidth = prompt('请输入专栏宽度 (例如: 900px, 80%, 1200px):', config.width);

        if (newWidth !== null && newWidth.trim() !== '') {
            // 确保宽度值格式正确
            config.width = ensureValidUnit(newWidth);
            saveConfig(config);
            modifyWidth(config.width);
        }
    });

    // 页面加载完成后初始化
    window.addEventListener('load', init);

    // 监听窗口大小变化，以便在窗口大小改变时重新计算宽度
    window.addEventListener('resize', init);

    // 监听DOM变化，处理可能的动态加载内容
    const observer = new MutationObserver(init);
    observer.observe(document.body, { childList: true, subtree: true });
})();
