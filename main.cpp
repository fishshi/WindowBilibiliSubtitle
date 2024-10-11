#include <QApplication>
#include "SubtitleWindow.h"
#include "SubtitleServer.h"

int main(int argc, char *argv[])
{
	QApplication app(argc, argv);
	SubtitleWindow window;
	window.show();
	SubtitleServer server;
	QObject::connect(&server, &SubtitleServer::subtitleReceived, &window, &SubtitleWindow::updateSubtitle);
	return app.exec();
}
