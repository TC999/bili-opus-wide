// ==UserScript==
// @name         哔哩哔哩专栏宽度修改
// @namespace    https://github.com/TC999/bili-opus-wide
// @version      1.0
// @description  修改哔哩哔哩专栏页面的宽度
// @author       陈生杂物房（TC999）
// @match        https://www.bilibili.com/opus/*
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

    // 确保值以px结尾
    function ensurePx(value) {
        const trimmed = value.trim();
        if (/^\d+$/.test(trimmed)) {
            return `${trimmed}px`;
        }
        return trimmed;
    }

    // 修改宽度
    function modifyWidth(width) {
        const detailElement = document.querySelector('.opus-detail');
        if (detailElement) {
            detailElement.style.width = width;
        }

        // 处理侧边栏的margin-left
        const sidebar = document.querySelector('.right-sidebar-wrap');
        if (sidebar) {
            // 解析宽度值并计算新的margin-left
            const value = parseInt(width, 10);
            if (!isNaN(value)) {
                sidebar.style.marginLeft = `${value + 12}px`;
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
            // 确保宽度值以px结尾
            config.width = ensurePx(newWidth);
            saveConfig(config);
            modifyWidth(config.width);
        }
    });

    // 页面加载完成后初始化
    window.addEventListener('load', init);

    // 监听DOM变化，处理可能的动态加载内容
    const observer = new MutationObserver(init);
    observer.observe(document.body, { childList: true, subtree: true });
})();