#ifndef SUBTITLEWINDOW_H
#define SUBTITLEWINDOW_H

#include <QApplication>
#include <QMainWindow>
#include <QLabel>
#include <QVBoxLayout>
#include <QWebSocketServer>
#include <QWebSocket>
#include <QMouseEvent>
#include <QPoint>
#include <QFontMetrics>

class SubtitleWindow : public QMainWindow
{
	Q_OBJECT

public:
	SubtitleWindow();

public slots:
	void updateSubtitle(const QString &subtitle);

protected:
	void mousePressEvent(QMouseEvent *event) override;
	void mouseMoveEvent(QMouseEvent *event) override;
	void mouseReleaseEvent(QMouseEvent *event) override;

private:
	bool mousePressed = false;
	QPoint dragStartPosition;
};

#endif // SUBTITLEWINDOW_H
