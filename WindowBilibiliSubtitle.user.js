// ==UserScript==
// @name         WindowBilibiliSubtitle
// @version      1.1.0
// @description  悬浮窗显示Bilibili字幕（获取字幕内容并通过WebSocket发送至悬浮窗）
// @author       fishshi
// @match        https://www.bilibili.com/video/*
// @grant        none
// ==/UserScript==

(function () {
	'use strict';
	const ws = new WebSocket('ws://localhost:80');
	ws.onopen = () => {
		console.log('WebSocket 连接成功');
		const checkInterval = setInterval(() => {
			const subtitleCtrlDiv = document.querySelector('.bpx-player-ctrl-subtitle');
			if (subtitleCtrlDiv) {
				console.log("字幕按钮存在");
				const flag = subtitleCtrlDiv.querySelector('filter');
				if (flag) {
					document.querySelector('.bpx-player-ctrl-btn[aria-label="字幕"] .bpx-common-svg-icon').click();
				}
				const subtitleDiv = document.querySelector('.bpx-player-subtitle-panel-major-group');
				const observer = new MutationObserver((mutations) => {
					mutations.forEach((mutation) => {
						if (mutation.type === 'childList') {
							const subtitleSpan = document.querySelector('.bpx-player-subtitle-panel-text');
							if (subtitleSpan) {
								console.log('字幕更新:', subtitleSpan.textContent);
								if (ws.readyState === WebSocket.OPEN) {
									ws.send(subtitleSpan.textContent);
								}
							}
						}
					});
				});
				const config = { subtree: true, childList: true };
				observer.observe(subtitleDiv, config);
				clearInterval(checkInterval);
			}
		}, 2000);
	};
	ws.onerror = (error) => {
		console.log('WebSocket 错误: ', error);
	};
})();