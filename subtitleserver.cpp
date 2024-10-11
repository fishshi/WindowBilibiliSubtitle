#include "subtitleserver.h"

SubtitleServer::SubtitleServer()
{
	server = new QWebSocketServer(QStringLiteral("Subtitle Server"), QWebSocketServer::NonSecureMode, this);
	if (server->listen(QHostAddress::Any, 80))
	{
		connect(server, &QWebSocketServer::newConnection, this, &SubtitleServer::onNewConnection);
	}
}
