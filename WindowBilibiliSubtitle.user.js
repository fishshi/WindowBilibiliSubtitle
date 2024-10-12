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
	const initWebSocketConnection = () => {
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
	};

	initWebSocketConnection();

	const observeRouteChange = () => {
		let oldHref = location.href;
		const body = document.querySelector('body');
		const observer = new MutationObserver(() => {
			if (oldHref !== location.href) {
				oldHref = location.href;
				console.log('检测到路由变化，重新初始化字幕逻辑');
				initWebSocketConnection();
			}
		});
		const config = { childList: true, subtree: true };
		observer.observe(body, config);

		// 捕获 pushState 和 replaceState
		const originalPushState = history.pushState;
		history.pushState = function () {
			originalPushState.apply(this, arguments);
			window.dispatchEvent(new Event('locationchange'));
		};

		const originalReplaceState = history.replaceState;
		history.replaceState = function () {
			originalReplaceState.apply(this, arguments);
			window.dispatchEvent(new Event('locationchange'));
		};

		window.addEventListener('locationchange', () => {
			console.log('路由变化捕获，重新初始化字幕逻辑');
			initWebSocketConnection();
		});

		// 监听浏览器的前进/后退操作
		window.addEventListener('popstate', () => {
			console.log('浏览器后退/前进操作，重新初始化字幕逻辑');
			initWebSocketConnection();
		});
	};

	// 调用监听路由变化的方法
	observeRouteChange();
})();
