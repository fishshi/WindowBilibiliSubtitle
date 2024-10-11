#ifndef SUBTITLESERVER_H
#define SUBTITLESERVER_H

#include <QWebSocketServer>
#include <QWebSocket>
#include <QCoreApplication>
#include <QTimer>

class SubtitleServer : public QObject
{
	Q_OBJECT

public:
	SubtitleServer();

private:
	QWebSocketServer *server;

private slots:
	void onNewConnection()
	{
		QWebSocket *socket = server->nextPendingConnection();
		connect(socket, &QWebSocket::textMessageReceived, this, &SubtitleServer::processMessage);
	}

	void processMessage(const QString &message)
	{
		emit subtitleReceived(message);
	}

signals:
	void subtitleReceived(const QString &subtitle);
};

#endif // SUBTITLESERVER_H
