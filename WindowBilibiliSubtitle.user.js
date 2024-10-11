// ==UserScript==
// @name         WindowBilibiliSubtitle
// @version      1.0.0
// @description  悬浮窗显示Bilibili字幕（获取字幕内容并通过WebSocket发送至悬浮窗）
// @author       fishshi
// @match        https://www.bilibili.com/video/*
// @grant        none
// ==/UserScript==

(function () {
	'use strict';
	function observeSubtitle() {
		const subtitleDiv = document.querySelector('.bpx-player-subtitle-panel-major-group');
		if (subtitleDiv) {
			console.log('找到字幕');
			const ws = new WebSocket('ws://localhost:80');
			ws.onopen = () => {
				console.log('WebSocket 连接成功');
			};
			ws.onerror = (error) => {
				console.log('WebSocket 错误: ', error);
			};
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
		} else {
			console.log('未找到字幕');
		}
	}
	const checkInterval = setInterval(observeSubtitle, 2000);
})();