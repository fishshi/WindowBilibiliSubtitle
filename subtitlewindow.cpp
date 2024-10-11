#include "subtitlewindow.h"

SubtitleWindow::SubtitleWindow()
{
	setWindowFlags(Qt::FramelessWindowHint | Qt::WindowStaysOnTopHint | Qt::Tool);
	setAttribute(Qt::WA_TranslucentBackground);
	setFixedSize(160, 50);
	QLabel *subtitleLabel = new QLabel("字幕加载中...", this);
	subtitleLabel->setStyleSheet("color: white; background-color: rgba(0, 0, 0, 0.5); font-size: 24px;");
	subtitleLabel->setAlignment(Qt::AlignCenter);
	QVBoxLayout *layout = new QVBoxLayout();
	layout->addWidget(subtitleLabel);
	QWidget *centralWidget = new QWidget(this);
	centralWidget->setLayout(layout);
	setCentralWidget(centralWidget);
	setMouseTracking(true);
}

void SubtitleWindow::mousePressEvent(QMouseEvent *event)
{
	if (event->button() == Qt::LeftButton)
	{
		mousePressed = true;
		dragStartPosition = event->globalPosition().toPoint() - frameGeometry().topLeft();
		event->accept();
	}
	else
	{
		QApplication::quit();
	}
}

void SubtitleWindow::mouseMoveEvent(QMouseEvent *event)
{
	if (mousePressed && event->buttons() & Qt::LeftButton)
	{
		move(event->globalPosition().toPoint() - dragStartPosition);
		event->accept();
	}
}

void SubtitleWindow::mouseReleaseEvent(QMouseEvent *event)
{
	if (event->button() == Qt::LeftButton)
	{
		mousePressed = false;
		event->accept();
	}
}

void SubtitleWindow::updateSubtitle(const QString &subtitle)
{
	QLabel *label = findChild<QLabel *>();
	label->setText(subtitle);
	QFontMetrics fontMetrics(label->font());
	int textWidth = fontMetrics.horizontalAdvance(subtitle);
	int padding = 20;
	int windowWidth = textWidth + padding;
	setFixedSize(windowWidth, 50);
}
